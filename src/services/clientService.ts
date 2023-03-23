import axios from 'axios';
import Client from '@/types/user';
import currentEnv from '@/utils/environment';

const getClients = async () => {
  const response = await axios.get(`${currentEnv()}/api/clients`);
  return response.data;
};

const postClient = (clientData: Client) => {
  axios
    .post(`${currentEnv()}/api/clients`, {
      clientData,
    })
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
};

export { getClients, postClient };
