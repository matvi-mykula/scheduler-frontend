import axios from 'axios';
import { serverPath } from '@/utils/environment';
import { Session } from '@/types/session';
import { io } from 'socket.io-client';
import { notifications } from '@mantine/notifications';
import { ActionIcon } from '@mantine/core';
import router from 'next/router';
import styles from '@/styles/Home.module.css';

//// --- socket.io-client stuff --- should emit anytime the calendar changes
const socket = io('http://localhost:3001');
const socketEmitter = () => {
  console.log('calendar change emit');
  socket.emit('calendar:updated');
};
////----

const getSessions = async () => {
  const response = await axios.get(`${serverPath}/api/sessions`);
  return response.data;
};

const getSessionsByDay = async () => {
  try {
    const response = await axios.get(`${serverPath}/api/sessions/week`);
    return response.data.success ? response.data.data : [];
  } catch (err) {
    console.log(err);
  }
};

const postSession = async (sessionData: Session) => {
  console.log('posting');
  console.log(sessionData);
  try {
    const SessionResponse = await axios.post(`${serverPath}/api/sessions`, {
      sessionData,
    });
    console.log('success : ' + SessionResponse.data.success);
    return SessionResponse.data;
  } catch (err) {
    console.log(err);
  }
};

const updateSession = async (sessionData: Session) => {
  console.log('putting');
  console.log(sessionData);

  try {
    const UpdateResponse = await axios.put(`${serverPath}/api/sessions`, {
      sessionData,
    });
    console.log(`success : ${UpdateResponse.data.success}`);
    return UpdateResponse.data;
  } catch (err) {
    console.log(err);
  }
};
const deleteSession = (sessionData: Session) => {
  axios
    .delete(`${serverPath}/api/sessions`, { data: sessionData })
    .then((response) => {
      console.log('deleted');
    })
    .catch((err) => {
      console.log(err);
    });
};

const UTCtoPacific = (time: Date) => {
  const options = { timeZone: 'America/Los_Angeles' };
  const pacificDateString = time.toLocaleString('en-US', options);
  const date = new Date(pacificDateString);
  const day = date.toLocaleString('en-US', { weekday: 'long' });
  const month = date.toLocaleString('en-US', { month: 'long' });
  const dayOfMonth = date.toLocaleString('en-US', { day: 'numeric' });
  const year = date.toLocaleString('en-US', { year: 'numeric' });
  const oclock = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return [`${day}, ${month} ${dayOfMonth}, ${year}, \n${oclock}`];
};

//need this to not cast out the current time
const timeSlotValidation = (session: Session, bookedSlots: Session[]) => {
  // console.log({ bookedSlots });
  if (!bookedSlots || bookedSlots.length === 0) {
    // checks if there are any booked slots in the day
    return true;
  }

  if (session && session.date_time) {
    //if session.id

    for (let i = 0; i < bookedSlots.length; i++) {
      bookedSlots[i].date_time;
      const timeDiff = Math.abs(
        session.date_time.getTime() -
          new Date(bookedSlots[i].date_time).getTime()
      );
      const diffInMinutes = Math.floor(timeDiff / (1000 * 60));
      if (diffInMinutes <= 75) {
        if (session.id === bookedSlots[i].id) {
          //this means its the same session being edited and can therefore be
          //rescheduled within the same block of time
          return true;
        }
        return false;
      }
    }
  }
  return true;
};
const isTimePast = (time: Date | null) => {
  if (time) {
    return time > new Date() ? true : false;
  }
  return false;
};

////// show notification when clicking session on calendar

const handleRouter = (session: Session) => {
  router.push({
    pathname: `/SessionForm2`,
    query: {
      id: session.id,
      client_id: session.client_id,
      reminder_sent: session.reminder_sent,
      confirmed: session.confirmed,
      canceled: session.canceled,
      location: session.location,
      date_time: session.date_time.toString(),
      edit: true,
    },
  });
};

const notificationMessage = (edit: any) => {
  return edit ? 'Edit successful for session at ' : 'Session created at';
};

const getClientName = (clientId: string, possibleClients: any) => {
  const client = possibleClients.find((c: any) => c.value === clientId);
  return client ? client.label : '';
};

///drag adn drop

const handleDragStart = (e: any, item: any, setState: Function) => {
  setState(item);
  console.log({ item });
  e.dataTransfer?.setData('text/plain', JSON.stringify(item));
  e.currentTarget?.classList.add(styles.dragOver);
};
const handleDragEnd = (e: any) => {
  // Remove the class added during drag start
  e.currentTarget?.classList.remove(styles.dragged);
};

const handleDragOver = (e: any) => {
  e.preventDefault();
  e.currentTarget.classList.add(styles.dragOver);
};

const handleDragLeave = (e: any) => {
  // Remove the class from the empty slot when the dragged item leaves it
  e.currentTarget.classList.remove(styles.dragOver);
};

const handleDrop = (e: any, targetItem: any, setState: Function) => {
  e.preventDefault();
  // const target = e.target as HTMLDivElement; // Cast event.target to HTMLDivElement
  // console.log(target);
  e.currentTarget.classList.remove(styles.dragOver);

  // Do something with the dragged item and the target item
  console.log('Dragged item:');
  console.log('Target item:', targetItem);
  const session = e.dataTransfer?.getData('text/plain');

  const date = targetItem;

  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const dateString = date.toLocaleString('en-US', options);

  if (session) {
    if (
      window.confirm(
        `Are you sure you want to move this session to ${dateString}?`
      )
    ) {
      let newSession = JSON.parse(session);
      console.log({ newSession });
      newSession.date_time = targetItem;
      updateSession(newSession);
      socketEmitter();
      notifications.show({
        title: 'Session Edited',
        message: `Edit successful for session at ${newSession.location} with ${newSession.client_id}`,
      });
    }

    setState(null);
  }
};

export {
  getSessions,
  getSessionsByDay,
  postSession,
  deleteSession,
  updateSession,
  UTCtoPacific,
  timeSlotValidation,
  isTimePast,
  handleRouter,
  socketEmitter,
  notificationMessage,
  getClientName,
  socket,
  handleDragOver,
  handleDragStart,
  handleDragEnd,
  handleDrop,
  handleDragLeave,
};
