import { Env, TeeTime } from '../../types';

// Helper function to add CORS headers
function addCORSHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return addCORSHeaders(new Response(null, { status: 200 }));
  }
  
  // Add debugging logs
  console.log('Tee times available API called:', {
    method: request.method,
    url: request.url,
    environment: env.ENVIRONMENT || 'unknown',
    hasDB: !!env.DB
  });
  
  if (request.method !== 'GET') {
    return addCORSHeaders(new Response('Method not allowed', { status: 405 }));
  }
  
  try {
    const url = new URL(request.url);
    const course = url.searchParams.get('course') || url.searchParams.get('courseId');
    const date = url.searchParams.get('date');

    console.log('Tee times available parameters:', { course, date });

    if (!course || !date) {
      const errorResponse = new Response(JSON.stringify({ error: 'Course and date parameters required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
      return addCORSHeaders(errorResponse);
    }    // Get all individual bookings for the specified course and date
    const stmt = env.DB.prepare(`
      SELECT 
        ttb.time, 
        ttb.players, 
        ttb.player_names,
        ttb.allow_additional_players,
        m.first_name,
        m.last_name,
        m.member_id as member_display_id,
        ttb.member_id
      FROM tee_time_bookings ttb
      JOIN members m ON ttb.member_id = m.id
      WHERE ttb.course_name = ? AND ttb.date = ? AND ttb.status = 'active'
      ORDER BY ttb.time ASC, ttb.created_at ASC
    `);
    
    const result = await stmt.bind(course, date).all();
    const allBookings = result.results || [];
    
    // Group bookings by time slot
    const bookingsByTime = allBookings.reduce((acc: any, booking: any) => {
      if (!acc[booking.time]) {
        acc[booking.time] = [];
      }
      acc[booking.time].push(booking);
      return acc;
    }, {});
    
    const bookedTimes = Object.keys(bookingsByTime);// Generate all time slots (every 10 minutes from 7:00 AM to 6:00 PM)
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
          // Check if this time slot has any bookings
        const timeSlotBookings = bookingsByTime[timeStr];        if (timeSlotBookings) {
          // This time slot has some bookings
          const totalPlayers = timeSlotBookings.reduce((sum: number, booking: any) => sum + (booking.players || 1), 0);
          const remainingSpots = maxPlayers - totalPlayers;
          
          // Check if any booking allows additional players (usually the first one)
          const allowsAdditional = timeSlotBookings.some((booking: any) => booking.allow_additional_players);
          
          // Status logic: if no remaining spots OR additional players not allowed, mark as booked
          let status = 'booked';
          if (remainingSpots > 0 && allowsAdditional) {
            status = 'partial';
          }
          
          // Get all player names from all bookings
          const allPlayerNames = timeSlotBookings
            .map((booking: any) => booking.player_names)
            .filter((names: string) => names)
            .join(', ');
          
          // Use the first booking's member info as the primary booker for display
          const primaryBooking = timeSlotBookings[0];
          
          allTimes.push({
            id: `${course}-${date}-${timeStr}`,
            courseId: course,
            courseName: courseNames[course as keyof typeof courseNames] || course,
            date: date,
            time: timeStr,
            players: totalPlayers,
            maxPlayers: maxPlayers,
            price: basePrice,
            status: status,
            availableSpots: allowsAdditional ? remainingSpots : 0,
            bookedBy: {
              firstName: primaryBooking.first_name,
              lastName: primaryBooking.last_name,
              memberId: primaryBooking.member_display_id,
              playerNames: allPlayerNames
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
    }    const successResponse = new Response(JSON.stringify(allTimes), {
      headers: { 'Content-Type': 'application/json' }
    });
    return addCORSHeaders(successResponse);
  } catch (error) {
    console.error('Tee times available API error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      environment: env.ENVIRONMENT || 'unknown'
    });
    const errorResponse = new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    return addCORSHeaders(errorResponse);
  }
};
