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

interface DayScheduleProps {
  day: number;
  sessions: Session[];
  draggedItem: any;
  setDraggedItem: Function;
}

// const socket = io('http://localhost:3001', { autoConnect: false });
// const socketEmitter = () => {
//   socket.emit('calendar:updated');
// };

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DaySchedule = (props: DayScheduleProps) => {
  const router = useRouter();

  const today = new Date();
  today.setDate(today.getDate() + props.day);
  const dayOfWeek = weekdays[today.getDay()];
  const day = today.getDate();
  const month = (today.getMonth() + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });

  const dayElements = buildDayElements({
    day: props.day,
    sessions: props.sessions,
    draggedItem: props.draggedItem,
    setDraggedItem: props.setDraggedItem,
  });

  //// ---- iterate through day by 30 minute sections creating empty blocks
  // const startTime = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate(),
  //   7,
  //   0,
  //   0
  // );
  // const endTime = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate(),
  //   18,
  //   0,
  //   0
  // );
  // const interval = 30 * 60 * 1000;

  // const dayElements: any[] = [];
  // const timeBlocks: Date[] = [];
  // for (let hour = 7; hour <= 18; hour++) {
  //   timeBlocks.push(
  //     new Date(
  //       today.getFullYear(),
  //       today.getMonth(),
  //       today.getDate(),
  //       hour,
  //       0,
  //       0
  //     )
  //   );
  //   timeBlocks.push(
  //     new Date(
  //       today.getFullYear(),
  //       today.getMonth(),
  //       today.getDate(),
  //       hour,
  //       30,
  //       0
  //     )
  //   );
  // }

  // timeBlocks.forEach((timeBlock) => {
  //   let time = `${timeBlock.getHours().toString()}:${timeBlock
  //     .getMinutes()
  //     .toString()
  //     .padStart(2, '0')}`;

  //   if (
  //     timeSlotValidation(
  //       {
  //         client_id: '',
  //         reminder_sent: false,
  //         confirmed: false,
  //         canceled: false,
  //         location: '',
  //         date_time: new Date(timeBlock),
  //       } as Session,
  //       props.sessions as Session[]
  //     )
  //   ) {
  //     dayElements.push(
  //       <Box
  //         key={time}
  //         className={styles.emptySlot}
  //         onDragOver={(e) => handleDragOver(e)}
  //         onDragLeave={(e) => handleDragLeave(e)}
  //         onDrop={(e: any) => handleDrop(e, timeBlock, props.setDraggedItem)}
  //         onClick={() => {
  //           let time = new Date(timeBlock);
  //           router.push({
  //             pathname: `/SessionForm2`,
  //             query: {
  //               client_id: '',
  //               reminder_sent: false,
  //               confirmed: false,
  //               canceled: false,
  //               location: 'Montclair Park',
  //               date_time: time.toString(),
  //             },
  //           });
  //         }}
  //       >
  //         {time}
  //       </Box>
  //     );
  //   } else {
  //     dayElements.push(
  //       <Box
  //         key={time}
  //         className={styles.unavailableSlot}
  //         onClick={() => {
  //           notifications.show({
  //             autoClose: 5000,
  //             color: 'red',
  //             icon: <IconX />,

  //             title: 'Unavailable Time',
  //             message: 'This time is unavailable!!',
  //           });
  //           console.log('unavailable');
  //         }}
  //       >
  //         {time}
  //       </Box>
  //     );
  //   }
  // });
  // if (props.sessions) {
  //   props.sessions.forEach((session: Session) => {
  //     const eventTime = new Date(session.date_time);
  //     let isWithinTimeBlock = false;
  //     for (let i = 0; i < timeBlocks.length - 1; i += 1) {
  //       if (eventTime >= timeBlocks[i] && eventTime < timeBlocks[i + 1]) {
  //         isWithinTimeBlock = true;
  //         dayElements[i] = (
  //           <Box
  //             className="scheduledSlot"
  //             draggable="true"
  //             onDragStart={(e) =>
  //               handleDragStart(e, session, props.setDraggedItem)
  //             }
  //             onDragLeave={(e) => handleDragLeave(e)}
  //             onDragEnd={(e) => {
  //               handleDragEnd(e);
  //             }}
  //             key={session.id}
  //             onClick={() => {
  //               notifications.show({
  //                 autoClose: 5000,
  //                 color: 'red',
  //                 icon: (
  //                   <ActionIcon
  //                     variant="default"
  //                     onClick={() => {
  //                       handleRouter(session);
  //                     }}
  //                   ></ActionIcon>
  //                 ),

  //                 title: 'Unavailable Time',
  //                 message: '<<-- Click to edit session',
  //               });
  //               console.log('unavailable');
  //             }}
  //           >
  //             <SessionTile session={session}></SessionTile>
  //           </Box>
  //         );
  //         dayElements.splice(i + 1, 1);
  //         dayElements.splice(i + 1, 1); // hacky way to deal with times
  //         //slots being too close to session ends
  //         //especilly when dealing with sesion that starts at off time
  //         i += 2;
  //       }
  //     }
  //   });
  // }
  if (dayElements) {
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
  } else {
    return <p>LOADING</p>;
  }
};

export { DaySchedule };
