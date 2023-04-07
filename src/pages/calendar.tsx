import { getSessionsForDay } from '@/services/sessionsService';
import { getClient } from '@/services/clientsService';
import { Session } from '@/types/session';
import { SimpleGrid, Box, Text, Paper } from '@mantine/core';
import { useEffect, useState } from 'react';
import Client from '@/types/user';
import { DaySchedule } from '@/components/calendar/DailySchedule';

/// use websocket to check sessions and place sessions that are made onto
/// the calendar as tiles
const Calendar = () => {
  const numbers = [0, 1, 2, 3, 4, 5, 6]; // create an array of numbers from 0 to 6

  return (
    <Box>
      <SimpleGrid
        cols={7}
        spacing="md"
      >
        {numbers.map((number) => (
          <Box key={number}>
            <DaySchedule day={number} />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Calendar;
