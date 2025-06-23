import { Env, TeeTime } from '../../types';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const url = new URL(request.url);
    const course = url.searchParams.get('course') || url.searchParams.get('courseId');
    const date = url.searchParams.get('date');

    if (!course || !date) {
      return new Response(JSON.stringify({ error: 'Course and date parameters required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }    // Get booked tee times with member information for the specified course and date
    const stmt = env.DB.prepare(`
      SELECT 
        tt.time, 
        tt.players, 
        tt.player_names,
        tt.allow_additional_players,
        m.first_name,
        m.last_name,
        m.member_id as member_display_id
      FROM tee_times tt
      JOIN members m ON tt.member_id = m.id
      WHERE tt.course_name = ? AND tt.date = ? AND tt.status = 'active'
      ORDER BY tt.time ASC
    `);
    
    const result = await stmt.bind(course, date).all();
    const bookedTeeTimes = result.results || [];
    const bookedTimes = bookedTeeTimes.map((row: any) => row.time);// Generate all time slots (every 10 minutes from 7:00 AM to 6:00 PM)
    const allTimes: any[] = [];
    const startHour = 7;
    const endHour = 18;
    const maxPlayers = 4;
    const basePrice = 85;

    // Course name mapping
    const courseNames = {
      'birches': 'The Birches',
      'woods': 'The Woods', 
      'farms': 'The Farms'
    };

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this time slot is booked
        const bookedTeeTime = bookedTeeTimes.find((bt: any) => bt.time === timeStr);        if (bookedTeeTime) {
          // This time slot has some bookings
          const currentPlayers = bookedTeeTime.players || 1;
          const remainingSpots = maxPlayers - currentPlayers;
          const allowsAdditional = bookedTeeTime.allow_additional_players;
          
          // Status logic: if no remaining spots OR additional players not allowed, mark as booked
          let status = 'booked';
          if (remainingSpots > 0 && allowsAdditional) {
            status = 'partial';
          }
          
          allTimes.push({
            id: `${course}-${date}-${timeStr}`,
            courseId: course,
            courseName: courseNames[course as keyof typeof courseNames] || course,
            date: date,
            time: timeStr,
            players: currentPlayers,
            maxPlayers: maxPlayers,
            price: basePrice,
            status: status,
            availableSpots: allowsAdditional ? remainingSpots : 0,
            bookedBy: {
              firstName: bookedTeeTime.first_name,
              lastName: bookedTeeTime.last_name,
              memberId: bookedTeeTime.member_display_id,
              playerNames: bookedTeeTime.player_names
            }
          });
        } else {
          // This time slot is available
          allTimes.push({
            id: `${course}-${date}-${timeStr}`,
            courseId: course,
            courseName: courseNames[course as keyof typeof courseNames] || course,
            date: date,
            time: timeStr,
            players: 0,
            maxPlayers: maxPlayers,
            price: basePrice,
            status: 'available'
          });
        }
      }
    }

    return new Response(JSON.stringify(allTimes), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Available times API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
