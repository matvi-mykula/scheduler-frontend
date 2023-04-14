import { getClient } from '@/services/clientsService';
import { Session } from '@/types/session';
import Client from '@/types/user';
import { Box, Paper, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';

const SessionTile = (props: { session: Session }) => {
  let sessionTime = new Date(props.session.date_time);
  const timeString = sessionTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [client, setClient] = useState<Client>({
    id: '',
    first_name: '',
    last_name: '',
    payment_method: 'cash',
    text_ok: false,
    email_ok: false,
    email: '',
    cell: '',
    rate: 0,
    num_cancels: 0,
    num_sessions: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const aClient = await getClient(props.session.client_id);

      setClient(aClient.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setLoaded(true);
  }, [client]);

  return (
    <Box>
      {loaded && (
        <Paper
          shadow="xs"
          p="xs"
          radius="lg"
          className={styles.sessionCard}
        >
          <Text>{client.first_name}</Text>
          <Text>{props.session.location}</Text>
          <Text>{timeString}</Text>
        </Paper>
      )}
    </Box>
  );
};
export default SessionTile;
