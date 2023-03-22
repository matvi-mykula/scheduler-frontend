import axios from 'axios';
import Client from '@/types/user';
import currentEnv from '@/utils/environment';

const getClients = () => {
  console.log('getting user data');
};

const postClient = (clientData: Client) => {
  console.log('posting blog post');
  axios
    .post(currentEnv() + 'postClient', {
      clientData,
    })
    .then((response) => {
      console.log('this blog post should be posted');

      console.log(response.data);
    });
};

export { getClients, postClient };
