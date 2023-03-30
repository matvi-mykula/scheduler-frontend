import { useForm } from '@mantine/form';
import { useState } from 'react';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import { postSession } from '@/services/sessionsService';
import Client from '@/types/user';
import { DateTimePicker } from '@mantine/dates';
import { Box, TextInput, Select, Checkbox, Button } from '@mantine/core';
import {
  postTextToPhone,
  reminderMessage,
  schedulingMessage,
} from '@/services/scheduleText';
dayjs.extend(tz);

interface SessionFormProps {
  client: Client;
  showSessionForm: Function;
}
export default function SessionForm({
  client,
  showSessionForm,
}: SessionFormProps) {
  const now = new Date();
  const [locationData, setLocationData] = useState([
    { value: 'Montclair Park', label: 'Montclair Park' },
    { value: 'Compound Dojo', label: 'Compound Dojo' },
  ]);
  const [dateValue, setDateValue] = useState<Date | null>(now);

  const form = useForm({
    initialValues: {
      date_time: dateValue,
      location: 'Montclair',
      confirmation: 'none',
    },

    validate: {},
  });

  const handleSubmit = async (formData: any) => {
    const newSession = {
      ...formData,
      client_id: client.id,
      reminder_sent: false,
      canceled: false,
      confirmed: false,
    };
    const postSessionResponse = await postSession(newSession);
    if (dateValue && client.text_ok) {
      // checks if its ok to text client
      const schedulingText = schedulingMessage(
        dateValue,
        client,
        newSession,
        'confirming'
      );
      //   this is commented out to save money
      //   const confirmationMessage = postTextToPhone(client.cell, schedulingText);
      const sendReminder = reminderMessage(dateValue, client, newSession);
    }
    /// need to set up email message and check if its ok to email
  };

  return (
    <Box style={{ overflow: 'visible' }}>
      <form
        onSubmit={form.onSubmit((values) => {
          values.date_time = dateValue;
          console.log(values);
          handleSubmit(values);
          showSessionForm(false);
        })}
      >
        <Select
          label="Location"
          data={locationData}
          placeholder="Select items"
          nothingFound="Nothing found"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          {...form.getInputProps('location')}
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
          value={dateValue}
          onChange={setDateValue}
          style={{ overflow: 'visible' }}
        />
        <Select
          label="Send Confirmation"
          placeholder="Pick one"
          data={[
            { value: '', label: 'None' },
            { value: 'text', label: 'Text' },
            { value: 'email', label: 'Email' },
            { value: 'both', label: 'Both' },
          ]}
          {...form.getInputProps('confirmation')}
        />
        <Box>
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            onClick={() => {
              showSessionForm(false);
              form.reset();
            }}
          >
            {' '}
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}
