import axios from 'axios';
import { ClientInput } from '@/types/user';
import { serverPath } from '@/utils/environment';

const getClients = async () => {
  const response = await axios.get(`${serverPath}/api/clients`);
  return response.data;
};

const postClient = async (clientData: ClientInput) => {
  console.log({ clientData });
  console.log('posting');
  try {
    const response = await axios.post(`${serverPath}/api/clients/`, {
      clientData,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// this is happening a lot

const getClient = async (client_id: string) => {
  const response = await axios.get(`${serverPath}/api/clients/${client_id}`);
  return response.data;
};
export { getClients, postClient, getClient };
