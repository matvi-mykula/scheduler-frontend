import axios from 'axios';
import { serverPath } from '@/utils/environment';
import { Session } from '@/types/session';
import { io } from 'socket.io-client';
import { notifications } from '@mantine/notifications';
import { ActionIcon } from '@mantine/core';
import router from 'next/router';

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
};
