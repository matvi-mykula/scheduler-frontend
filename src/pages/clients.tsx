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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getClients } from '@/services/clientsService';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import Client from '@/types/user';
import { DataTable } from 'mantine-datatable';

export default function Clients() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    const response = await getClients();
    const { data, success } = response;
    if (success) {
      setClients(data);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

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
          ...clients,
          // more records...
        ]}
        // define columns
        columns={[
          {
            accessor: 'id',
            // this column has a custom title
            title: 'ID',
            // right-align column
            textAlignment: 'right',
            sortable: true, // add this to pertinent columns
          },
          { accessor: 'first_name' },
          { accessor: 'last_name' },
          { accessor: 'cell' },
          {
            accessor: 'text_ok',
            render: ({ text_ok }) => <Text>{`${text_ok}`}</Text>,
          },
          { accessor: 'email' },
          {
            accessor: 'email_ok',
            render: ({ email_ok }) => <Text>{`${email_ok}`}</Text>,
          },
          { accessor: 'payment_method' },
          { accessor: 'rate' },

          { accessor: 'num_sessions' },
          { accessor: 'num_cancels' },
        ]}
        // execute this callback when a row is clicked
        onRowClick={({ ...client }) => {
          console.log({ client });
          router.push({
            pathname: `/clientProfile`,
            query: {
              id: client.id,
              first_name: client.first_name,
              last_name: client.last_name,
              payment_method: client.payment_method,
              text_ok: client.text_ok,
              email_ok: client.email_ok,
              num_sessions: client.num_sessions,
              num_cancels: client.num_cancels,
              cell: client.cell,
              email: client.email,
              rate: client.rate,
            },
          });
          //maybe use mantine HoverCard here
        }}
      />
    </Box>
  );
}
