import axios from 'axios';
import { serverPath } from '@/utils/environment';
import Session from '@/types/session';

const getSessions = async () => {
  const response = await axios.get(`${serverPath}/api/sessions`);
  return response.data;
};

const postSession = (sessionData: Session) => {
  axios
    .post(`${serverPath}/api/sessions`, {
      sessionData,
    })
    .then((response) => {})
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

const updateSession = (sessionData: Session, column: string) => {
  console.log(sessionData);
  console.log(column);
  axios
    .put(`${serverPath}/api/sessions`, { data: sessionData, column })
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
};

const UTCtoPacific = (time: string) => {
  const utcDateString = time;
  const utcDate = new Date(utcDateString);

  // Convert to Pacific Time
  const options = { timeZone: 'America/Los_Angeles' };
  const pacificDateString = utcDate.toLocaleString('en-US', options);

  return pacificDateString;
};

// const convertAllTimes= (sessionArray:[])=>{
//     for (let i = 0; i < sessionArray.length; i++) {
// sessionArray[i].date_time = UTCtoPacific(sessionArray[i].date_time)
//     }
// }

export { getSessions, postSession, deleteSession, updateSession };
