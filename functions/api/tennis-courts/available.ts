import { Env } from '../../types';
import { verifyAuth } from '../auth/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === 'GET') {
      return handleGetAvailableSlots(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Tennis courts available API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleGetAvailableSlots(request: Request, env: Env) {
  const member = await verifyAuth(request, env);
  if (!member) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  const courtType = url.searchParams.get('courtType') || 'tennis';

  // Validate court type
  if (!['tennis', 'pickleball'].includes(courtType)) {
    return new Response(JSON.stringify({ error: 'Invalid court type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }  // Get all reservations for the specified date and court type
  const query = `
    SELECT 
      cr.court_number,
      cr.time,
      cr.duration,
      cr.court_type,
      cr.notes,
      CASE 
        WHEN cr.member_id = ? THEN 1
        ELSE 0
      END as is_own_booking,
      m.first_name || ' ' || m.last_name as member_name,
      CASE 
        WHEN cr.member_id = ? THEN m.member_id
        ELSE NULL
      END as member_id_display
    FROM court_reservations cr
    JOIN members m ON cr.member_id = m.id
    WHERE cr.date = ? AND cr.court_type = ? AND cr.status = 'active'
    ORDER BY cr.court_number ASC, cr.time ASC
  `;

  const stmt = env.DB.prepare(query);
  const result = await stmt.bind(member.id, member.id, date, courtType).all();// Generate court occupation data
  const maxCourts = courtType === 'tennis' ? 9 : 4;
  const courts: Array<{
    courtNumber: number;
    reservations: Array<{
      time: string;
      duration: number;
      isOwnBooking: boolean;
      memberName: string;
      memberIdDisplay?: string;
      notes?: string;
    }>;
  }> = [];

  for (let courtNum = 1; courtNum <= maxCourts; courtNum++) {
    const courtReservations = (result.results || []).filter(
      (res: any) => res.court_number === courtNum
    );

    courts.push({
      courtNumber: courtNum,
      reservations: courtReservations.map((res: any) => ({
        time: res.time,
        duration: res.duration,
        isOwnBooking: res.is_own_booking === 1,
        memberName: res.member_name,
        memberIdDisplay: res.member_id_display,
        notes: res.notes
      }))
    });
  }
  return new Response(JSON.stringify({ 
    date,
    courtType,
    courts,
    metadata: {
      totalCourts: maxCourts,
      totalReservations: (result.results || []).length,
      timeRange: '6:00 AM - 10:00 PM'
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}