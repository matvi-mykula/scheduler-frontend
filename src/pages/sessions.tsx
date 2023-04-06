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
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import {
  deleteSession,
  getSessions,
  UTCtoPacific,
} from '@/services/sessionsService';
import { Session } from '@/types/session';
import { IconEdit, IconTrash, IconTrashX } from '@tabler/icons-react';
import EditSession from '@/services/EditSession';
import sortBy from 'lodash/sortBy';

// import { showNotification } from '@mantine/notifications';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tableChange, setTableChange] = useState(false);

  const fetchSessions = async () => {
    const response = await getSessions();
    const { data, success } = response;
    if (success) {
      setSessions(data);
    }
  };

  /// need update on useeffect functionality
  useEffect(() => {
    fetchSessions();
  }, [tableChange]);

  ////-------make sortable by id
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });
  const [records, setRecords] = useState(sortBy(sessions, 'id'));

  useEffect(() => {
    const data = sortBy(sessions, sortStatus.columnAccessor) as Session[];
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, sessions]);
  ///----

  return (
    <Box
      style={{
        margin: '5%',
        height: 600,
      }}
    >
      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={records}
        columns={[
          {
            accessor: 'actions',
            title: <Text mr="xs">Actions</Text>,
            textAlignment: 'left',
            width: 80,
            render: (row) => (
              <>
                <Box>
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
                </Box>
              </>
            ),
          },
          {
            accessor: 'id',
            title: 'ID',
            textAlignment: 'right',
            sortable: true, // add to this to make sortable so things dont get mixed up
          },
          { accessor: 'client_id', width: 40 },
          { accessor: 'location' },
          {
            accessor: 'date_time',
            title: 'Date/Time',
            render: ({ date_time }) => (
              <Text>{`${UTCtoPacific(date_time)}`}</Text>
            ),
          },

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
        rowExpansion={{
          content: ({ record, collapse }) => (
            <Box>
              <EditSession
                session={record}
                tableChange={tableChange}
                setTableChange={setTableChange}
                collapse={collapse}
              ></EditSession>
            </Box>
          ),
        }}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Box>
  );
}
