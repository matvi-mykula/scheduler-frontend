import { getSessionsForDay } from '@/services/sessionsService';
import { Session } from '@/types/session';
import { SimpleGrid, Box, Text, Paper } from '@mantine/core';
import { useEffect, useState } from 'react';

interface DayScheduleProps {
  day: number;
}

/// use websocket to check sessions and place sessions that are made onto
/// the calendar as tiles
const Calendar = () => {
  return (
    <Box>
      <SimpleGrid
        cols={7}
        spacing="sm"
      >
        <Box>
          <DaySchedule day={0}></DaySchedule>
        </Box>
        <Box>Tuesday</Box>
        <Box>Wednesday</Box>
        <Box>Thursday</Box>
        <Box>Friday</Box>
        <Box>Saturday</Box>
        <Box>Sunday</Box>
      </SimpleGrid>
    </Box>
  );
};

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const DaySchedule = (props: DayScheduleProps) => {
  const today = new Date();
  const day = today.getDate() + props.day;
  const month = today.getMonth() + 1; // add 1 because January is 0
  const year = today.getFullYear();
  const fullDay = `${year}-${month}-${day}`;

  const [sessions, setSessions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const sessionsForDay = await getSessionsForDay(fullDay);
      setSessions(sessionsForDay);
    }

    fetchData();
  }, []);
  //   const sessionsForDay = getSessionsForDay(fullDay);
  //   console.log({ today });

  //   console.log({ sessionsForDay });
  useEffect(() => {
    console.log(sessions);
    setLoaded(true);
  }, [sessions]);

  return (
    <Box>
      <>
        {' '}
        <Text>{weekdays[today.getDay()]}</Text>
        {loaded &&
          sessions.map((session: Session) => {
            return (
              <Box key={session.id}>
                <SessionTile session={session}></SessionTile>
              </Box>
            );
          })}
      </>
    </Box>
  );
};

const SessionTile = (props: { session: Session }) => {
  console.log(props.session);
  //get client name from id
  //get time from date_time

  return (
    <Box>
      <Paper
        shadow="xs"
        p="md"
        radius="lg"
      >
        <Text>Session</Text>
        <Text>{props.session.client_id}</Text>
        <Text>{props.session.location}</Text>
      </Paper>
    </Box>
  );
};

export default Calendar;
