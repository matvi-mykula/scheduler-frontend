import {
  Button,
  Input,
  Box,
  Group,
  TextInput,
  Checkbox,
  Select,
  NumberInput,
  Text,
  Table,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getClients } from '@/services/clientsService';
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
// import Client from '@/types/user';
// import ClientRow from '@/components/clients/ClientRow';
import { DataTable } from 'mantine-datatable';
import { getSessions } from '@/services/sessionsService';
import Session from '@/types/session';
import { IconEdit, IconTrash, IconTrashX } from '@tabler/icons-react';
// import { showNotification } from '@mantine/notifications';

export default function Sessions() {
  const router = useRouter();
  // const navigate = useNavigate();
  // how to navigate to next page onclick????
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchClients = async () => {
    const response = await getSessions();
    const { data, success } = response;
    if (success) {
      setSessions(data);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  //   const [selectedRecords, setSelectedRecords] = useState<Session[]>([]);

  return (
    <Box
      style={{
        margin: '5%',
      }}
    >
      <Box></Box>
      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        // provide data
        records={[
          ...sessions,
          // more records...
        ]}
        // define columns
        columns={[
          {
            accessor: 'actions',
            title: <Text mr="xs">Row actions</Text>,
            textAlignment: 'left',
            render: (session) => (
              <Group
                spacing={4}
                position="left"
                noWrap
              >
                <ActionIcon
                  color="blue"
                  onClick={() => {
                    console.log('edit session');
                  }}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  onClick={() => {
                    console.log('delete entry');
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ),
          },
          {
            accessor: 'id',
            // this column has a custom title
            title: 'ID',
            // right-align column
            textAlignment: 'right',
            sortable: true, // add this to pertinent columns
          },
          { accessor: 'client_id' },
          { accessor: 'location' },
          { accessor: 'date_time' },
          {
            accessor: 'confirmed',
            render: ({ confirmed }) => <Text>{`${confirmed}`}</Text>,
          },
          {
            accessor: 'canceled',
            render: ({ canceled }) => <Text>{`${canceled}`}</Text>,
          },
          {
            accessor: 'reminder_sent',
            render: ({ reminder_sent }) => <Text>{`${reminder_sent}`}</Text>,
          },
        ]}

        // execute this callback when a row is clicked
        // onRowClick={({ ...//session }) => {
        //   console.log({ session });
        //   router.push({
        //     pathname: `/clientProfile`,
        //     query: {
        //       id: session.id,
        //       client_id: session.client_id,
        //       location: session.location,
        //       date_time: session.dateTime,
        //       confirmed: session.confirmed,
        //       canceled: session.canceled,
        //       reminder_sent: session.reminder_sent,
        //     },
        //   });
        //maybe use mantine HoverCard here
        // }
      />
    </Box>
  );
}
