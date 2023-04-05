import axios from 'axios';
import { serverPath } from '@/utils/environment';
import { Session } from '@/types/session';

const getSessions = async () => {
  const response = await axios.get(`${serverPath}/api/sessions`);
  console.log('getSessions');
  console.log(response.data);
  //   let refined = {
  //     success: response.data.success,
  //     code: response.data.code,
  //     data: convertAllTimes(response.data.data),
  //   };
  return response.data;
};

const getSessionsForDay = async (day: string) => {
  console.log('get todays sessions');
  console.log(day);
  const response = await axios.get(`${serverPath}/api/sessions/day/${day}`);

  console.log(response.data);
  return response.data.data.rows;
};

const postSession = (sessionData: Session) => {
  console.log('postSession');
  console.log({ sessionData });
  axios
    .post(`${serverPath}/api/sessions`, {
      sessionData,
    })
    .then((response) => {
      console.log('should be updated');
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteSession = (sessionData: Session) => {
  console.log(sessionData);
  axios
    .delete(`${serverPath}/api/sessions`, { data: sessionData })
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
};

const updateSession = (sessionData: Session) => {
  console.log('updateSession');
  console.log(sessionData);
  axios
    .put(`${serverPath}/api/sessions`, { data: sessionData })
    .then((response) => {})
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

const convertAllTimes = (sessionArray: Session[]): Session[] => {
  //     if (sessionArray)
  //   let convertedSessions = { ...sessionArray };
  if (!Array.isArray(sessionArray)) {
    throw new Error('sessionArray must be an array');
  }
  sessionArray.forEach((session) => {
    // session.date_time = new Date(UTCtoPacific(session.date_time));
    // session.date_time = session.date_time.toString();
    console.log(session.date_time);
    console.log(typeof session.date_time);
  });
  return sessionArray;
};

export {
  getSessions,
  getSessionsForDay,
  postSession,
  deleteSession,
  updateSession,
  UTCtoPacific,
};
