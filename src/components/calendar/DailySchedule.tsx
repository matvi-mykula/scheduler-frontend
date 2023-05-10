import sessions from '@/pages/sessions';
import { ActionIcon, Box, Paper, Text } from '@mantine/core';
import { Session } from '@/types/session';
import { useEffect, useState } from 'react';

import {
  handleRouter,
  timeSlotValidation,
} from '../../services/sessionsService';
import {
  handleDragOver,
  handleDragStart,
  handleDrop,
  handleDragEnd,
  handleDragLeave,
} from '../../services/calendarDrag';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { io } from 'socket.io-client';
import SessionTile from './SessionTile';
import { buildDayElements } from '@/services/buildDayElements';
import moment from 'moment';

interface DayScheduleProps {
  day: number;
  sessions: Session[];
  draggedItem: any;
  setDraggedItem: Function;
  weekOf: number;
}

// const socket = io('http://localhost:3001', { autoConnect: false });
// const socketEmitter = () => {
//   socket.emit('calendar:updated');
// };

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DaySchedule = (props: DayScheduleProps) => {
  const router = useRouter();

  const today = moment();
  const firstDayOfWeek = today.add(props.weekOf, 'weeks');
  const dayOfWeek = firstDayOfWeek.add(props.day, 'days');

  const dayTitle = dayOfWeek.format('ddd  DD/MM');

  const dayElements = buildDayElements({
    day: dayOfWeek,
    sessions: props.sessions,
    draggedItem: props.draggedItem,
    setDraggedItem: props.setDraggedItem,
  });
  if (dayElements) {
    return (
      <Box>
        <>
          {' '}
          <Box className={styles.scheduleColumnHeader}>
            <Text>{`${dayTitle} `}</Text>
          </Box>
          <Box>{dayElements}</Box>
        </>
      </Box>
    );
  } else {
    return <p>LOADING</p>;
  }
};

export { DaySchedule };
