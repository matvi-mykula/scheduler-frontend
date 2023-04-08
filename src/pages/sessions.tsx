import { Box, Text, ActionIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import {
  deleteSession,
  getSessions,
  UTCtoPacific,
} from '@/services/sessionsService';
import { Session } from '@/types/session';
import { IconTrash } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import SessionForm2 from './SessionForm2';

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
              <SessionForm2 startSession={record}></SessionForm2>
              {/* <EditSession
                session={record}
                tableChange={tableChange}
                setTableChange={setTableChange}
                collapse={collapse}
              ></EditSession> */}
            </Box>
          ),
        }}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Box>
  );
}
