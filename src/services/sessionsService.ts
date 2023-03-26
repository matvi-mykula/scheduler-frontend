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

export { getSessions, postSession };
