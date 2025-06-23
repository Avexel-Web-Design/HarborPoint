import { Env, SECOND_COURSE_TIME_INTERVAL_HOURS } from '../../types';

// Helper function to convert 24-hour time to 12-hour format
function formatTime12Hour(time24: string): string {
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const firstCourseId = url.searchParams.get('firstCourseId');
    const secondCourseId = url.searchParams.get('secondCourseId');
    const date = url.searchParams.get('date');
    const time = url.searchParams.get('time');
    const players = url.searchParams.get('players');

    if (!firstCourseId || !secondCourseId || !date || !time || !players) {
      return new Response(JSON.stringify({ 
        error: 'Missing required parameters: firstCourseId, secondCourseId, date, time, players' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const playersNeeded = parseInt(players);
    if (isNaN(playersNeeded) || playersNeeded < 1 || playersNeeded > 4) {
      return new Response(JSON.stringify({ 
        error: 'Players must be a number between 1 and 4' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }    // Calculate suggested start time (first tee time + interval)
    const [firstHour, firstMinute] = time.split(':').map(Number);
    const firstTimeInMinutes = firstHour * 60 + firstMinute;
    const suggestedTimeInMinutes = firstTimeInMinutes + (SECOND_COURSE_TIME_INTERVAL_HOURS * 60);
    
    // Search window: from suggested time to 3 hours after (don't show times before suggested time)
    const searchStartMinutes = Math.max(7 * 60, suggestedTimeInMinutes); // Start from suggested time, but not before 7 AM
    const searchEndMinutes = Math.min(18 * 60, suggestedTimeInMinutes + 180); // Don't go past 6 PM

    // Get all bookings for the second course on this date
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
    
    const result = await stmt.bind(secondCourseId, date).all();
    const allBookings = result.results || [];
    
    // Group bookings by time slot
    const bookingsByTime = allBookings.reduce((acc: any, booking: any) => {
      if (!acc[booking.time]) {
        acc[booking.time] = [];
      }
      acc[booking.time].push(booking);
      return acc;
    }, {});    const availableOptions: any[] = [];
    const maxPlayers = 4;

    // Generate time slots in 10-minute increments within search window
    for (let minutes = searchStartMinutes; minutes < searchEndMinutes; minutes += 10) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      const timeSlotBookings = bookingsByTime[timeStr];
      const minutesFromSuggested = Math.abs(minutes - suggestedTimeInMinutes);
      const hoursFromSuggested = Math.round((minutesFromSuggested / 60) * 100) / 100;
        if (!timeSlotBookings) {
        // Completely available slot
        availableOptions.push({
          time: timeStr,
          displayTime: formatTime12Hour(timeStr),
          status: 'available',
          players: 0,
          maxPlayers: maxPlayers,
          availableSpots: maxPlayers,
          isPreferred: minutes === suggestedTimeInMinutes,
          hoursFromPreferred: hoursFromSuggested,
          bookings: []
        });
      } else {
        // Check existing bookings
        const totalPlayers = timeSlotBookings.reduce((sum: number, booking: any) => sum + (booking.players || 1), 0);
        const remainingSpots = maxPlayers - totalPlayers;
        const allowsAdditional = timeSlotBookings.some((booking: any) => booking.allow_additional_players);
        
        // Format booking information
        const bookingInfo = timeSlotBookings.map((booking: any) => ({
          memberName: `${booking.first_name} ${booking.last_name}`,
          memberId: booking.member_display_id,
          players: booking.players,
          playerNames: booking.player_names
        }));        if (remainingSpots >= playersNeeded && allowsAdditional) {
          // Partially booked but joinable
          availableOptions.push({
            time: timeStr,
            displayTime: formatTime12Hour(timeStr),
            status: 'partial',
            players: totalPlayers,
            maxPlayers: maxPlayers,
            availableSpots: remainingSpots,
            isPreferred: minutes === suggestedTimeInMinutes,
            hoursFromPreferred: hoursFromSuggested,
            bookings: bookingInfo
          });
        } else if (remainingSpots < playersNeeded) {
          // Full - show for information but not selectable
          availableOptions.push({
            time: timeStr,
            displayTime: formatTime12Hour(timeStr),
            status: 'full',
            players: totalPlayers,
            maxPlayers: maxPlayers,
            availableSpots: 0,
            isPreferred: minutes === suggestedTimeInMinutes,
            hoursFromPreferred: hoursFromSuggested,
            bookings: bookingInfo,
            selectable: false
          });
        } else {
          // Has space but doesn't allow additional players
          availableOptions.push({
            time: timeStr,
            displayTime: formatTime12Hour(timeStr),
            status: 'private',
            players: totalPlayers,
            maxPlayers: maxPlayers,
            availableSpots: remainingSpots,
            isPreferred: minutes === suggestedTimeInMinutes,
            hoursFromPreferred: hoursFromSuggested,
            bookings: bookingInfo,
            selectable: false
          });
        }
      }
    }

    // Sort by time, but put preferred time first if it's available
    availableOptions.sort((a, b) => {
      if (a.isPreferred && a.status !== 'full' && a.status !== 'private') return -1;
      if (b.isPreferred && b.status !== 'full' && b.status !== 'private') return 1;
      return a.time.localeCompare(b.time);
    });    const suggestedTime24 = `${Math.floor(suggestedTimeInMinutes / 60).toString().padStart(2, '0')}:${(suggestedTimeInMinutes % 60).toString().padStart(2, '0')}`;
    
    return new Response(JSON.stringify({
      suggestedTime: suggestedTime24,
      suggestedTimeDisplay: formatTime12Hour(suggestedTime24),
      searchWindow: {
        start: `${Math.floor(searchStartMinutes / 60).toString().padStart(2, '0')}:${(searchStartMinutes % 60).toString().padStart(2, '0')}`,
        end: `${Math.floor(searchEndMinutes / 60).toString().padStart(2, '0')}:${(searchEndMinutes % 60).toString().padStart(2, '0')}`
      },
      options: availableOptions
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Second course options API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
