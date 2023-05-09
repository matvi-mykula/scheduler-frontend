import { Session } from '@/types/session';
import { handleRouter, timeSlotValidation } from './sessionsService';
import { ActionIcon, Box } from '@mantine/core';
import {
  handleDragEnd,
  handleDragLeave,
  handleDragOver,
  handleDragStart,
  handleDrop,
} from './calendarDrag';
import { notifications } from '@mantine/notifications';
import SessionTile from '@/components/calendar/SessionTile';
import router, { useRouter } from 'next/router';
import moment from 'moment';
import styles from '@/styles/Home.module.css';
import { IconX } from '@tabler/icons-react';

interface DayScheduleProps {
  day: number;
  sessions: Session[];
  draggedItem: any;
  setDraggedItem: Function;
}

const buildDayElements = (props: DayScheduleProps) => {
  // const router = useRouter();

  const today = new Date();
  today.setDate(today.getDate() + props.day);
  const day = today.getDate();
  const month = (today.getMonth() + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const startHour = 7; // 7am
  const endHour = 19; // 7pm

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

  // Define the duration of each time slot in minutes
  const timeSlotDuration = 30;

  // Iterate through the time slots
  for (let i = 0 * 60; i < timeBlocks.length; i += 1) {
    // Calculate the start and end times for the current slot

    let blockStatus = null;
    let session;
    if (!props.sessions) {
      blockStatus = 'available';
    } else {
      [blockStatus, session] = checkSlotStatus(timeBlocks[i], props.sessions);
    }
    // Add the appropriate element to the dayElements array

    switch (blockStatus) {
      case 'scheduled':
        if (session) {
          dayElements.push(
            sessionElement({
              session: session,
              draggedItem: props.draggedItem,
              setDraggedItem: props.setDraggedItem,
            })
          );
        }
        i += 2; /// skip 2 timeblocks
        continue;
      case 'buffer':
        dayElements.push(unavailableElement(timeBlocks[i]));
        continue;

      case 'available':
        dayElements.push(
          availableElement({
            timeBlock: timeBlocks[i],
            setDraggedItem: props.setDraggedItem,
          })
        );
        continue;
    }
  }
  return dayElements;
};

// Function to check if a time slot is within 75 minutes before a scheduled slot
/// make this return scheduled, available or unavailable and then do a switch
function checkSlotStatus(timeSlot: Date, bookedSlots: Session[]) {
  const timeSlotStart = moment(timeSlot);
  const timeSlotEnd = moment(timeSlot).add(29, 'minutes');

  for (const bookedSlot of bookedSlots) {
    const sessionStart = moment(bookedSlot.date_time);
    const sessionStartMinus = moment(bookedSlot.date_time).subtract(
      1,
      'minutes'
    );
    const bufferBeforeSession = moment(bookedSlot.date_time).subtract(
      75,
      'minutes'
    );

    if (sessionStart.isBetween(timeSlotStart, timeSlotEnd, null, '[]')) {
      return ['scheduled', bookedSlot];
    } else if (
      timeSlotStart.isBetween(
        bufferBeforeSession,
        sessionStartMinus,
        null,
        '[]'
      )
    ) {
      return ['buffer', null];
    }
  }
  /// the timeslot is not scheduled or in buffer zone of any booked slot
  return ['available', null];
}

interface ScheduledSlotProps {
  session: any; //// had to type this any cause i was getting type errors
  draggedItem: any;
  setDraggedItem: Function;
}

const sessionElement = (props: ScheduledSlotProps) => {
  if (!props.session || props.session === null) {
    return null;
  }
  return (
    <Box
      className="scheduledSlot"
      draggable="true"
      onDragStart={(e) =>
        handleDragStart(e, props.session, props.setDraggedItem)
      }
      onDragLeave={(e) => handleDragLeave(e)}
      onDragEnd={(e) => {
        handleDragEnd(e);
      }}
      key={props.session.id}
      onClick={() => {
        notifications.show({
          autoClose: 5000,
          color: 'red',
          icon: (
            <ActionIcon
              variant="default"
              onClick={() => {
                handleRouter(props.session);
              }}
            ></ActionIcon>
          ),

          title: 'Unavailable Time',
          message: '<<-- Click to edit session',
        });
        console.log('unavailable');
      }}
    >
      <SessionTile session={props.session}></SessionTile>
    </Box>
  );
};

interface AvailableElementProps {
  timeBlock: any;
  setDraggedItem: Function;
}

const availableElement = (props: AvailableElementProps) => {
  let time = `${props.timeBlock.getHours().toString()}:${props.timeBlock
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return (
    <Box
      key={time}
      className={styles.emptySlot}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDrop={(e: any) => handleDrop(e, props.timeBlock, props.setDraggedItem)}
      onClick={() => {
        let time = new Date(props.timeBlock);
        router.push({
          pathname: `/SessionForm2`,
          query: {
            client_id: '',
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
};

const unavailableElement = (timeBlock: any) => {
  let time = `${timeBlock.getHours().toString()}:${timeBlock
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return (
    <Box
      key={time}
      className={styles.unavailableSlot}
      onClick={() => {
        notifications.show({
          autoClose: 5000,
          color: 'red',
          icon: <IconX />,

          title: 'Unavailable Time',
          message: 'This time is unavailable!!',
        });
        console.log('unavailable');
      }}
    >
      {time}
    </Box>
  );
};

export { buildDayElements };
