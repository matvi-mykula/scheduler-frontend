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
import { Modal } from '@mantine/core';
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';

import { useEffect, useState } from 'react';
// import Client from '@/types/user';
// import ClientRow from '@/components/clients/ClientRow';
import { DataTable } from 'mantine-datatable';
import { deleteSession, getSessions } from '@/services/sessionsService';
import Session from '@/types/session';
import { IconEdit, IconTrash, IconTrashX } from '@tabler/icons-react';
import EditSession from '@/services/EditSession';
// import { showNotification } from '@mantine/notifications';

export default function Sessions() {
  const router = useRouter();
  // const navigate = useNavigate();
  // how to navigate to next page onclick????
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tableChange, setTableChange] = useState(false);
  const [editFormOpened, { open, close }] = useDisclosure(false);
  const [editSession, setEditSession] = useState(null);
  const fetchSessions = async () => {
    console.log('fetching');
    const response = await getSessions();
    const { data, success } = response;
    console.log(data);
    if (success) {
      setSessions(data);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  useEffect(() => {
    fetchSessions();
  }, [tableChange]);
  //   const [selectedRecords, setSelectedRecords] = useState<Session[]>([]);

  return (
    <Box
      style={{
        margin: '5%',
      }}
    >
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
            render: (row) => (
              <>
                {/*  this opens a modal with a edit session form */}
                <Box>
                  {' '}
                  <Modal
                    opened={editFormOpened}
                    onClose={close}
                    title="Authentication"
                  >
                    <EditSession session={row}></EditSession>
                  </Modal>
                </Box>
                <Group
                  spacing={4}
                  position="left"
                  noWrap
                >
                  <ActionIcon
                    color="blue"
                    onClick={open}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this post?'
                        )
                      ) {
                        console.log(row);
                        deleteSession(row);
                        setTableChange(!tableChange);
                      }
                      console.log('delete entry');
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </>
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
        onRowClick={({ ...client }) => {
          console.log({ client });

          //maybe use mantine HoverCard here
        }}
      />
    </Box>
  );
}
