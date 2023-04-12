import Client from '@/types/user';
import { Box, Card, Text, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SessionForm2 from './SessionForm2';

export default function ClientProfile() {
  const router = useRouter();

  let client: Client = {
    id: '',
    first_name: '',
    last_name: '',
    payment_method: 'credit',
    text_ok: false,
    email_ok: false,
    num_sessions: 0,
    num_cancels: 0,
    rate: 0,
    email: '',
    cell: '',
    // set default values for all required properties
  };
  const [loaded, setLoaded] = useState(false);

  // let client: Client;
  if (router.query) {
    Object.keys(router.query).forEach((key) => {
      if (key in client) {
        client[key] = router.query[key]?.toString();
      }
    });
    // setLoaded(true);
  }

  const [sessionForm, showSessionForm] = useState(false);

  return (
    <Box style={{ padding: '5%' }}>
      <Text>Client Profile</Text>
      <br></br>
      {/* {loaded && ( */}
      <Box>
        <Box>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text>{client.id}</Text>
            <Text>{`${client.first_name}  ${client.last_name}`}</Text>
            {/* fill in perinent info and offer option to edit */}
            <span>
              <Text
                style={{ display: 'inline-block' }}
              >{`Cell : ${client.cell}`}</Text>
              {client.text_ok && (
                <Text style={{ display: 'inline-block' }}>{'  '}&#10003;</Text>
              )}
            </span>
            <span style={{ display: 'block' }}>
              <Text
                style={{ display: 'inline-block' }}
              >{`Email : ${client.email}`}</Text>
              {client.email_ok && (
                <Text style={{ display: 'inline-block' }}>{'  '}&#10003;</Text>
              )}
            </span>
            <Text>{`Payment Method : ${client.payment_method}`}</Text>

            <Text>{`Rate : ${client.rate}`}</Text>

            {/* open up calendar popup and post new appt */}
          </Card>
        </Box>
        <Box>
          {sessionForm ? (
            <SessionForm2
              startSession={{
                client_id: client.id,
                reminder_sent: false,
                confirmed: false,
                canceled: false,
                location: '',
                date_time: new Date(),
              }}
            ></SessionForm2>
          ) : (
            <Button
              onClick={() => {
                showSessionForm(true);
              }}
            >
              Schedule Session
            </Button>
          )}
        </Box>
      </Box>
      {/* )} */}
    </Box>
  );
}
