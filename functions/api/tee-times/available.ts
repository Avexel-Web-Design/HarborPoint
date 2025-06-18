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
    }

    // Get booked tee times for the specified course and date
    const stmt = env.DB.prepare(`
      SELECT time FROM tee_times 
      WHERE course_name = ? AND date = ? AND status = 'active'
      ORDER BY time ASC
    `);
    
    const result = await stmt.bind(course, date).all();
    const bookedTimes = result.results?.map((row: any) => row.time) || [];    // Generate available time slots (every 10 minutes from 7:00 AM to 6:00 PM)
    const availableTimes: any[] = [];
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
        if (!bookedTimes.includes(timeStr)) {
          availableTimes.push({
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

    return new Response(JSON.stringify(availableTimes), {
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
