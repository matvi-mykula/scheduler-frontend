import { useForm } from '@mantine/form';
import { useState } from 'react';

import Client from '@/types/user';
import { DateTimePicker } from '@mantine/dates';
import { Box, TextInput, Select } from '@mantine/core';

export default function SessionForm(client: Client) {
  const now = new Date();
  const [locationData, setLocationData] = useState([
    { value: 'montclair park', label: 'Montclair Park' },
    { value: 'dojo', label: 'Compound Dojo' },
  ]);

  const form = useForm({
    initialValues: {
      date: Date.now(),
      time: now.toLocaleTimeString(),
      location: 'Montclair',
    },

    validate: {},
  });

  const handleSubmit = async (formData: any) => {
    console.log(formData);
    const newSession = {
      ...formData,
      id: client.id,
      reminder_sent: false,
      canceled: false,
      confirmed: false,
    };
    //   const postClientResponse = await postClient(newClient);
  };

  return (
    <Box>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
          handleSubmit(values);
        })}
      >
        <Select
          label="Creatable Select"
          data={locationData}
          placeholder="Select items"
          nothingFound="Nothing found"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setLocationData((current) => [...current, item]);
            return item;
          }}
        />
        <DateTimePicker
          valueFormat="DD MMM YYYY hh:mm A"
          label="Pick date and time"
          placeholder="Pick date and time"
          maw={400}
          mx="auto"
        />
        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="last name"
          {...form.getInputProps('lastName')}
        />
      </form>
    </Box>
  );
}
