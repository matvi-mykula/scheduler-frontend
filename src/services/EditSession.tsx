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
import Session from '@/types/session';
import ReactDOM from 'react-dom';
dayjs.extend(tz);

interface SessionFormProps {
  session: Session;
}
export default function EditSession({ session }: SessionFormProps) {
  console.log(session.date_time);
  // const now = new Date(session.date_time);
  const now = new Date();

  console.log(typeof session.date_time);
  console.log(typeof now);

  const [locationData, setLocationData] = useState([
    { value: 'Montclair Park', label: 'Montclair Park' },
    { value: 'Compound Dojo', label: 'Compound Dojo' },
  ]);
  const [dateValue, setDateValue] = useState<Date | null>(now);
  console.log({ now });

  const form = useForm({
    initialValues: {
      ...session,
      date_time: dateValue,
    },

    validate: {},
  });

  const handleSubmit = async (formData: any) => {
    console.log(formData);
    const newSession = {
      ...formData,
      date_time: dateValue,
    };
    // const postSessionResponse = await postSession(newSession);
    // if (dateValue) {
    //   const schedulingText = schedulingMessage(
    //     dateValue,
    //     client,
    //     newSession,
    //     'confirming'
    //   );
    //   //need to check if email or text or none or both
    //   const confirmationMessage = postTextToPhone(client.cell, schedulingText);
    //   const sendReminder = reminderMessage(dateValue, client, newSession);
    // }
  };

  return (
    <Box style={{ overflow: 'visible' }}>
      <form
        onSubmit={form.onSubmit((values) => {
          // values.date_time = dateValue;
          console.log(values);
          handleSubmit(values);
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
          // {...form.getInputProps('date_time')}
          defaultValue={dateValue}
          value={dateValue}
          onChange={setDateValue}
          style={{ overflow: 'visible' }}
        />
        <Checkbox
          mt="md"
          label="Canceled"
          {...form.getInputProps('canceled', { type: 'checkbox' })}
        />
        <Checkbox
          mt="md"
          label="Confirmed"
          {...form.getInputProps('confirmed', { type: 'checkbox' })}
        />
        <Checkbox
          mt="md"
          label="Reminder Sent"
          {...form.getInputProps('reminder_sent', { type: 'checkbox' })}
        />

        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
  );
}
