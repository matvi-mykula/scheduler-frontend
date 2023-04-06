import axios from 'axios';
import { serverPath } from '@/utils/environment';
import { Session } from '@/types/session';

const getSessions = async () => {
  const response = await axios.get(`${serverPath}/api/sessions`);

  return response.data;
};

const getSessionsForDay = async (day: string) => {
  const response = await axios.get(`${serverPath}/api/sessions/day/${day}`);

  return response.data.data.rows;
};

const postSession = (sessionData: Session) => {
  axios
    .post(`${serverPath}/api/sessions`, {
      sessionData,
    })
    .then((response) => {
      console.log('posted');
    })
    .catch((err) => {
      console.log(err);
    });
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

const updateSession = (sessionData: Session) => {
  axios
    .put(`${serverPath}/api/sessions`, { data: sessionData })
    .then((response) => {
      console.log('updated');
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

export {
  getSessions,
  getSessionsForDay,
  postSession,
  deleteSession,
  updateSession,
  UTCtoPacific,
};
