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
  return (
    <Box>
      <SimpleGrid
        cols={7}
        spacing="md"
      >
        <Box>
          <DaySchedule day={0}></DaySchedule>
        </Box>
        <Box>
          {' '}
          <DaySchedule day={1}></DaySchedule>
        </Box>
        <Box>
          {' '}
          <DaySchedule day={2}></DaySchedule>
        </Box>
        <Box>
          {' '}
          <DaySchedule day={3}></DaySchedule>
        </Box>
        <Box>
          {' '}
          <DaySchedule day={4}></DaySchedule>
        </Box>
        <Box>
          {' '}
          <DaySchedule day={5}></DaySchedule>
        </Box>
        <Box>
          {' '}
          <DaySchedule day={6}></DaySchedule>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Calendar;
