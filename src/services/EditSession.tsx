import { useForm } from '@mantine/form';
import { useState } from 'react';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import { postSession, updateSession } from '@/services/sessionsService';
import Client from '@/types/user';
import { DateTimePicker } from '@mantine/dates';
import { Box, TextInput, Select, Checkbox, Button } from '@mantine/core';
import {
  postTextToPhone,
  reminderMessage,
  schedulingMessage,
} from '@/services/scheduleText';
import { Session, SessionFormProps } from '@/types/session';
import ReactDOM from 'react-dom';
dayjs.extend(tz);

export default function EditSession({
  session,
  tableChange,
  setTableChange,
  collapse,
}: SessionFormProps) {
  console.log(typeof session.id);
  const now = new Date(session.date_time);

  const [locationData, setLocationData] = useState([
    { value: 'Montclair Park', label: 'Montclair Park' },
    { value: 'Compound Dojo', label: 'Compound Dojo' },
  ]);
  const [dateValue, setDateValue] = useState<Date | null>(now);

  const form = useForm({
    initialValues: {
      ...session,
      date_time: dateValue,
    },

    validate: {},
  });

  const handleSubmit = async (formData: any) => {
    const newSession = {
      ...formData,
      date_time: dateValue,
    };
    console.log({ newSession });
    updateSession(newSession);
    setTableChange(!tableChange);
    collapse();
  };

  return (
    <Box style={{ overflow: 'visible' }}>
      <form
        onSubmit={form.onSubmit((values) => {
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
