# 18-Hole Tee Time Booking System

## Overview
This system allows users to book 18-hole rounds by combining two 9-hole courses. Users can select their preferred second course and choose from available tee times around the recommended 2-hour interval.

## Key Features

### 1. Configurable Time Interval
- Located in `functions/types.ts`: `SECOND_COURSE_TIME_INTERVAL_HOURS = 2`
- This single constant controls the preferred time gap between first and second courses
- Can be easily changed to any number of hours (e.g., 1.5, 2.5, 3)

### 2. User-Selected Second Course Booking
The system now allows users to choose their preferred second tee time from available options:

#### Preferred Time Display
- Shows the recommended time (exactly X hours after the first tee time)
- Displays additional available times in 10-minute increments after the preferred time
- Only shows times at or after the recommended interval (no earlier times)

#### Time Selection Options
- **Open Slots**: Completely available tee times
- **Partial Bookings**: Existing bookings that allow others to join
- **Full/Private**: Information-only display for unavailable times

#### Time Display Format
- All times shown in 12-hour format (e.g., "9:00 AM", "2:30 PM")
- Includes player count and availability information for each option

### 3. User Interface Features

#### Course Selection
- Checkbox to enable 18-hole booking
- Dropdown to select second course (excludes the first course)
- Real-time loading of available second course times

#### Second Course Time Selection
- Radio button list of available times
- Shows number of players already booked
- Indicates available spots remaining
- Shows whether others can join the existing group
- Preferred time (2 hours later) appears first in the list

#### Booking Validation
- Prevents booking without selecting both second course and time
- Clear error messages for validation failures
- Success confirmation with both tee time details

### 4. API Endpoints

#### `/api/tee-times/second-course-options`
- **Method**: GET
- **Parameters**: 
  - `firstCourseId`: ID of the first course
  - `secondCourseId`: ID of the second course  
  - `date`: Date in YYYY-MM-DD format
  - `time`: Time in HH:MM format (24-hour)
  - `players`: Number of players (1-4)
- **Returns**: 
  - `suggestedTime`: Recommended time (24-hour format)
  - `suggestedTimeDisplay`: Recommended time (12-hour format)
  - `options`: Array of available time slots with display information

#### `/api/tee-times` (Enhanced)
- **Method**: POST
- **New Fields**:
  - `isEighteenHole`: Boolean flag for 18-hole booking
  - `secondCourseId`: ID of second course (required if `isEighteenHole` is true)
  - `secondCourseTime`: User-selected time for second course (required if `isEighteenHole` is true)
  - `allowOthersToJoin`: Applies to both first and second course bookings
- **Returns**: Success/failure status, both tee time IDs, and timing information

### 5. Database Changes
- Uses existing `tee_time_bookings` table
- Creates two separate booking records (one for each course)
- Both bookings inherit the same `allow_additional_players` setting
- Links bookings through member ID and notes field
- Implements transaction rollback if second booking fails

### 6. Error Handling
- Validates second course availability before booking first course
- Rolls back first booking if second booking fails
- Provides clear error messages for all failure scenarios
- Prevents invalid combinations (same course for both bookings)

## Usage Example

1. User selects a tee time for "The Birches" course at 9:00 AM
2. User checks "Book 18-hole round" checkbox
3. User selects "The Woods" as second course
4. System checks availability for 11:00 AM (2 hours later) on "The Woods"
5. If available, user can proceed with booking
6. System books both courses and confirms with appropriate timing message

## Configuration

To change the time interval between courses, modify this line in `functions/types.ts`:
```typescript
export const SECOND_COURSE_TIME_INTERVAL_HOURS = 2; // Change this number
```

For example:
- `1.5` for 1 hour 30 minutes
- `2.5` for 2 hours 30 minutes  
- `3` for 3 hours

## Course Combinations
- Any of the three 9-hole courses can be combined with any other
- No restrictions on course combinations
- Users can play Birches → Woods, Farms → Birches, etc.

## Operating Hours
- Tee times available from 7:00 AM to 6:00 PM
- Second course bookings must fall within these hours
- System automatically validates timing constraints
