import sessions from '@/pages/sessions';
import { Box, Paper, Text } from '@mantine/core';
import { Session } from '@/types/session';
import { useEffect, useState } from 'react';
import Client from '@/types/user';
import { getClient } from '../../services/clientsService';
import { getSessionsForDay } from '../../services/sessionsService';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';

interface DayScheduleProps {
  day: number;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DaySchedule = (props: DayScheduleProps) => {
  const router = useRouter();

  const today = new Date();
  today.setDate(today.getDate() + props.day);
  const dayOfWeek = weekdays[today.getDay()];
  const day = today.getDate();
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

  //// ---- iterate through day by 30 minute sections creating empty blocks
  const startTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    7,
    0,
    0
  );
  const endTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    18,
    0,
    0
  );
  const interval = 30 * 60 * 1000;

  const dayElements: any[] = [];
  const timeBlocks: Date[] = [];
  for (let hour = 7; hour <= 18; hour++) {
    timeBlocks.push(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hour,
        0,
        0
      )
    );
    timeBlocks.push(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hour,
        30,
        0
      )
    );
  }

  timeBlocks.forEach((timeBlock) => {
    let time = `${timeBlock.getHours().toString()}:${timeBlock
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    dayElements.push(
      <Box
        className={styles.emptySlot}
        onClick={() => {
          let time = new Date(timeBlock);
          console.log(typeof time);
          router.push({
            pathname: `/SessionForm2`,
            query: {
              client_id: '0',
              reminder_sent: false,
              confirmed: false,
              canceled: false,
              location: 'Montclair Park',
              date_time: time.toString(),
            },
          });
        }}
      >
        {time}
      </Box>
    );
  });

  if (sessions) {
    sessions.forEach((session: Session) => {
      const eventTime = new Date(session.date_time);
      let isWithinTimeBlock = false;
      for (let i = 0; i < timeBlocks.length - 1; i += 1) {
        if (eventTime >= timeBlocks[i] && eventTime < timeBlocks[i + 1]) {
          isWithinTimeBlock = true;
          dayElements[i] = (
            <Box
              key={session.id}
              onClick={() => {
                console.log({ session });
              }}
            >
              <SessionTile session={session}></SessionTile>
            </Box>
          );
          dayElements.splice(i + 1, 1);
          dayElements.splice(i + 1, 1); // hacky way to deal with times
          //slots being too close to session ends
          //especilly when dealing with sesion that starts at off time
          i += 2;
        }
      }
    });
  }

  return (
    <Box>
      <>
        {' '}
        <Box className={styles.scheduleColumnHeader}>
          <Text>{`${month}/${day} ${dayOfWeek}`}</Text>
        </Box>
        <Box>{dayElements}</Box>
      </>
    </Box>
  );
};

const SessionTile = (props: { session: Session }) => {
  let sessionTime = new Date(props.session.date_time);
  const timeString = sessionTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [client, setClient] = useState<Client>({
    id: '',
    first_name: '',
    last_name: '',
    payment_method: 'cash',
    text_ok: false,
    email_ok: false,
    email: '',
    cell: '',
    rate: 0,
    num_cancels: 0,
    num_sessions: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const aClient = await getClient(props.session.client_id);

      setClient(aClient.data.rows[0]);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setLoaded(true);
  }, [client]);

  return (
    <Box>
      {loaded && (
        <Paper
          shadow="xs"
          p="xs"
          radius="lg"
          className={styles.sessionCard}
        >
          <Text>{client.first_name}</Text>
          <Text>{props.session.location}</Text>
          <Text>{timeString}</Text>
        </Paper>
      )}
    </Box>
  );
};

// const newSessionAtTime = (time: string) => {

//   router.push({
//     pathname: `/sessionForm2`,
//     query: {
//       client_id: '0',
//       reminder_sent: false,
//       confirmed: false,
//       canceled: false,
//       location: 'Montclair Park',
//       date_time: time,
//     },
//   });
// };
export { DaySchedule };
