import { getSessionsByDay, socket } from '@/services/sessionsService';
import { getClient } from '@/services/clientsService';
import { Session } from '@/types/session';
import { SimpleGrid, Box, Text, Paper, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import Client from '@/types/user';
import { DaySchedule } from '@/components/calendar/DailySchedule';
import { io } from 'socket.io-client';

/// use websocket to check sessions and place sessions that are made onto
/// the calendar as tiles
const Calendar = () => {
  const numbers = [0, 1, 2, 3, 4, 5, 6]; // create an array of numbers from 0 to 6
  const [sessions, setSessions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  async function fetchData() {
    /// need leading zero on month
    const sessionsByDay = await getSessionsByDay();
    setSessions(sessionsByDay);
    setLoaded(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  socket.on('calendar:updated', () => {
    fetchData();
  });

  ///// drag and drop
  const [draggedItem, setDraggedItem] = useState(null);

  ////////

  return (
    <Box>
      {loaded ? (
        <SimpleGrid
          cols={7}
          spacing="md"
        >
          {numbers.map((number) => (
            <Box key={number}>
              <DaySchedule
                day={number}
                sessions={sessions && sessions[number]}
                draggedItem={draggedItem}
                setDraggedItem={setDraggedItem}
              />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Loader color="gray" />
      )}
    </Box>
  );
};

export default Calendar;
