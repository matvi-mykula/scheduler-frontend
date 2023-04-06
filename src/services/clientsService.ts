import axios from 'axios';
import Client from '@/types/user';
import { serverPath } from '@/utils/environment';

const getClients = async () => {
  const response = await axios.get(`${serverPath}/api/clients`);
  return response.data;
};

const postClient = (clientData: Client) => {
  axios
    .post(`${serverPath}/api/clients`, {
      clientData,
    })
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
};

const getClient = async (client_id: string) => {
  const response = await axios.get(`${serverPath}/api/client/${client_id}`);
  return response.data;
};
export { getClients, postClient, getClient };
