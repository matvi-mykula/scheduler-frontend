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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getClients } from '@/services/clientService';
import { useEffect, useState } from 'react';
import Client from '@/types/user';

export default function SeeUsers() {
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
    <Box>
      <Text>Users will go here</Text>
      {clients.length &&
        clients.map((client, index) => (
          <Text key={index}>{client.first_name}</Text>
        ))}
    </Box>
  );
}
