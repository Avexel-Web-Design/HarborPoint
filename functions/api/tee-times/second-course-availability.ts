import { Env, SECOND_COURSE_TIME_INTERVAL_HOURS } from '../../types';
import { findAvailableSecondTeeTime } from './eighteen-hole-utils';

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
    }

    // For now, we'll use an empty array for firstCourseMembers since this is a pre-booking check
    // In a real scenario, we might want to pass the authenticated member's ID
    const result = await findAvailableSecondTeeTime(
      env,
      {
        date,
        time,
        players: playersNeeded
      },
      secondCourseId,
      playersNeeded,
      [] // Empty array since this is a pre-booking availability check
    );

    if (result.success && result.teeTime) {
      return new Response(JSON.stringify({
        available: true,
        secondTeeTime: result.teeTime,
        message: result.teeTime.actualTimeDifference !== SECOND_COURSE_TIME_INTERVAL_HOURS
          ? `Second tee time available at ${result.teeTime.time} (${result.teeTime.actualTimeDifference} hours after first course)`
          : `Second tee time available at ${result.teeTime.time}`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        available: false,
        error: result.error,
        message: `Cannot book 18-hole round: ${result.error}`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Second course availability API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
