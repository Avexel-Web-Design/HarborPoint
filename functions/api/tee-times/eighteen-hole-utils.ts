import { Env, SECOND_COURSE_TIME_INTERVAL_HOURS } from '../../types';

export interface SecondTeeTimeResult {
  success: boolean;
  teeTime?: {
    courseId: string;
    date: string;
    time: string;
    actualTimeDifference?: number; // In hours, if different from preferred interval
  };
  error?: string;
}

/**
 * Finds the best available tee time for the second course in an 18-hole booking
 * @param env Database environment
 * @param firstCourseDetails Details of the first course booking
 * @param secondCourseId ID of the second course
 * @param playersNeeded Number of players needing spots
 * @param firstCourseMembers Array of member IDs from the first course booking
 * @returns Result object with success status and tee time details
 */
export async function findAvailableSecondTeeTime(
  env: Env,
  firstCourseDetails: {
    date: string;
    time: string;
    players: number;
  },
  secondCourseId: string,
  playersNeeded: number,
  firstCourseMembers: number[]
): Promise<SecondTeeTimeResult> {
  
  // Calculate preferred start time (first tee time + interval)
  const [firstHour, firstMinute] = firstCourseDetails.time.split(':').map(Number);
  const firstTimeInMinutes = firstHour * 60 + firstMinute;
  const preferredTimeInMinutes = firstTimeInMinutes + (SECOND_COURSE_TIME_INTERVAL_HOURS * 60);
  
  // Convert back to time string
  const preferredHour = Math.floor(preferredTimeInMinutes / 60);
  const preferredMinute = preferredTimeInMinutes % 60;
  const preferredTimeStr = `${preferredHour.toString().padStart(2, '0')}:${preferredMinute.toString().padStart(2, '0')}`;
  
  // Check if preferred time is within operating hours (7:00 AM to 6:00 PM)
  if (preferredHour < 7 || preferredHour >= 18) {
    return {
      success: false,
      error: 'Preferred second tee time falls outside operating hours'
    };
  }
  
  // First, check the exact preferred time
  const preferredTimeResult = await checkTeeTimeAvailability(
    env,
    secondCourseId,
    firstCourseDetails.date,
    preferredTimeStr,
    playersNeeded,
    firstCourseMembers
  );
  
  if (preferredTimeResult.success) {
    return {
      success: true,
      teeTime: {
        courseId: secondCourseId,
        date: firstCourseDetails.date,
        time: preferredTimeStr,
        actualTimeDifference: SECOND_COURSE_TIME_INTERVAL_HOURS
      }
    };
  }
  
  // If preferred time not available, search for next available slots
  // Check every 10 minutes after the preferred time until end of day
  for (let searchMinutes = preferredTimeInMinutes + 10; searchMinutes < 18 * 60; searchMinutes += 10) {
    const searchHour = Math.floor(searchMinutes / 60);
    const searchMinute = searchMinutes % 60;
    const searchTimeStr = `${searchHour.toString().padStart(2, '0')}:${searchMinute.toString().padStart(2, '0')}`;
    
    const result = await checkTeeTimeAvailability(
      env,
      secondCourseId,
      firstCourseDetails.date,
      searchTimeStr,
      playersNeeded,
      firstCourseMembers
    );
    
    if (result.success) {
      const actualTimeDifferenceHours = (searchMinutes - firstTimeInMinutes) / 60;
      return {
        success: true,
        teeTime: {
          courseId: secondCourseId,
          date: firstCourseDetails.date,
          time: searchTimeStr,
          actualTimeDifference: Math.round(actualTimeDifferenceHours * 100) / 100 // Round to 2 decimal places
        }
      };
    }
  }
  
  return {
    success: false,
    error: 'No suitable tee time available for second course'
  };
}

/**
 * Checks if a specific tee time slot is available for the given requirements
 */
async function checkTeeTimeAvailability(
  env: Env,
  courseId: string,
  date: string,
  time: string,
  playersNeeded: number,
  firstCourseMembers: number[]
): Promise<{ success: boolean; reason?: string }> {
  
  // Get existing bookings for this slot
  const existingCheck = env.DB.prepare(`
    SELECT id, players, allow_additional_players, member_id 
    FROM tee_time_bookings 
    WHERE course_name = ? AND date = ? AND time = ? AND status = 'active'
    ORDER BY created_at ASC
  `);
  
  const existingBookings = await existingCheck.bind(courseId, date, time).all();
  
  if (!existingBookings.results || existingBookings.results.length === 0) {
    // Slot is completely available
    return { success: true };
  }
  
  // Calculate current occupancy
  const totalPlayers = existingBookings.results.reduce(
    (sum: number, booking: any) => sum + (booking.players || 1), 
    0
  );
  
  const remainingSpots = 4 - totalPlayers;
  
  if (remainingSpots < playersNeeded) {
    // Not enough spots available
    return { success: false, reason: 'Insufficient spots available' };
  }
  
  // Check if any booking allows additional players
  const allowsAdditional = existingBookings.results.some(
    (booking: any) => booking.allow_additional_players
  );
  
  if (!allowsAdditional) {
    // Existing bookings don't allow additional players
    return { success: false, reason: 'Existing bookings do not allow additional players' };
  }
  
  // Check if all existing members were part of the first course group
  const existingMemberIds = existingBookings.results.map((booking: any) => booking.member_id);
  const hasNonFirstCourseMembers = existingMemberIds.some(
    (memberId: number) => !firstCourseMembers.includes(memberId)
  );
  
  if (hasNonFirstCourseMembers) {
    // There are members in this slot who weren't in the first course group
    return { success: false, reason: 'Tee time contains members not from first course group' };
  }
  
  // All conditions met - slot is available
  return { success: true };
}

/**
 * Books a tee time for the second course
 */
export async function bookSecondTeeTime(
  env: Env,
  memberId: number,
  memberName: string,
  teeTimeDetails: {
    courseId: string;
    date: string;
    time: string;
  },
  players: number,
  allowOthersToJoin: boolean = false,
  notes?: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  
  const stmt = env.DB.prepare(`
    INSERT INTO tee_time_bookings (
      member_id, course_name, date, time, players, player_names, notes, allow_additional_players
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    try {
    const result = await stmt.bind(
      memberId,
      teeTimeDetails.courseId,
      teeTimeDetails.date,
      teeTimeDetails.time,
      players,
      memberName,
      notes || `Second course for 18-hole round`,
      allowOthersToJoin ? 1 : 0 // Use the same allow_additional_players setting as first course
    ).run();
    
    if (result.success && result.meta?.last_row_id) {
      return {
        success: true,
        id: result.meta.last_row_id as number
      };
    } else {
      return {
        success: false,
        error: 'Failed to create second course booking'
      };
    }
  } catch (error) {
    console.error('Error booking second tee time:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
