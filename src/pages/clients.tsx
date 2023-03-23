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
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import Client from '@/types/user';
import ClientRow from '@/components/clients/ClientRow';
import { DataTable } from 'mantine-datatable';

export default function Clients() {
  const router = useRouter();
  // const navigate = useNavigate();
  // how to navigate to next page onclick????
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

  ////----- table stuff (max may want this in a seperate file)
  const [columnWidths, setColumnWidths] = useState([
    150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
  ]);
  const handleResize = (columnIndex: number, newWidth: number) => {
    const newWidths = [...columnWidths];
    newWidths[columnIndex] = newWidth;
    setColumnWidths(newWidths);
  };

  return (
    <Box>
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
            sortable: true,
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
        // onRowClick={({ name, party, bornIn }) =>
        //   alert(
        //     `You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`
        //   )
        // }
      />

      {/* 
      <Text>Users will go here</Text>
      <Box
        style={{
          width: '80%',
          height: '80%',
          margin: 'auto',
          border: '1px solid black',
          // display: 'flex',
          // // flexDirection: 'column',
          // justifyContent: 'center',
        }}
      >
        <Table
          fontSize="1vw"
          striped
          highlightOnHover
          withBorder
          withColumnBorders
          style={{ objectFit: 'contain', overflow: 'auto' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: `${columnWidths[0]}px`,
                  resize: 'horizontal',
                  userSelect: 'auto',
                }}
                onDrag={(e) => handleResize(0, e.currentTarget.offsetWidth)}
              >
                First Name
              </th>
              <th
                style={{
                  width: `${columnWidths[0]}px`,
                  resize: 'horizontal',
                  userSelect: 'none',
                }}
                onDrag={(e) => handleResize(0, e.currentTarget.offsetWidth)}
              >
                Last Name
              </th>
              <th>Cell</th>
              <th>Text OK</th>
              <th>Email</th>
              <th>Email OK</th>
              <th>Payment Method</th>
              <th>Number of Session</th>
              <th>Number of Cancels</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {clients.length &&
              clients.map((client, index) => (
                <ClientRow
                  key={index}
                  rowData={client}
                ></ClientRow>
              ))}
          </tbody>
        </Table>
      </Box> */}
    </Box>
  );
}
