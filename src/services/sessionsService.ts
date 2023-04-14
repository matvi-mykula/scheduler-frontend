import axios from 'axios';
import { serverPath } from '@/utils/environment';
import { Session } from '@/types/session';

const getSessions = async () => {
  const response = await axios.get(`${serverPath}/api/sessions`);
  return response.data;
};

const getSessionsForDay = async (day: string) => {
  const response = await axios.get(`${serverPath}/api/sessions/day/${day}`);
  return response.data.success ? response.data.data : [];
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

const updateSession = async (sessionData: Session) => {
  console.log(sessionData);

  try {
    const UpdateResponse = await axios.put(`${serverPath}/api/sessions`, {
      data: sessionData,
    });
    console.log(`success : ${UpdateResponse.data.success}`);
    return UpdateResponse.data;
  } catch (err) {
    console.log(err);
  }
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

export {
  getSessions,
  getSessionsForDay,
  postSession,
  deleteSession,
  updateSession,
  UTCtoPacific,
  timeSlotValidation,
  isTimePast,
};
