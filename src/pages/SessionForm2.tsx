import { useForm } from '@mantine/form';
import { useState } from 'react';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import { postSession } from '@/services/sessionsService';
import Client from '@/types/user';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { Box, TextInput, Select, Checkbox, Button } from '@mantine/core';
import {
  postTextToPhone,
  reminderMessage,
  schedulingMessage,
} from '@/services/scheduleText';
import { Session } from '@/types/session';
import { useRouter } from 'next/router';
dayjs.extend(tz);

///// --------- the idea here is to make a single reusable
///// --------- sessionform component that can be used while scheduling
///// --------- for a client, for a time, or editing a session

export default function SessionForm() {
  const router = useRouter();
  const oldSession = router.query;

  let now;
  oldSession.date_time
    ? (now = new Date(oldSession.date_time.toString()))
    : (now = new Date());

  const [locationData, setLocationData] = useState([
    { value: 'Montclair Park', label: 'Montclair Park' },
    { value: 'Compound Dojo', label: 'Compound Dojo' },
  ]);

  const [possibleClients, setPossibleClients] = useState([
    { value: '1', label: 'Kieran' },
    { value: '2', label: 'Matthew' },
  ]);
  // update possibleClients to get from server all current clients
  const [dateValue, setDateValue] = useState<Date>(now);
  const [clientValue, setClientValue] = useState<string>('');
  //// initialize client, if client is not already one of the possible client_id
  //// then allow for choosing client from dropdown menu

  const form = useForm({
    initialValues: { ...oldSession, date_time: dateValue },

    validate: {},
  });

  const handleSubmit = async (formData: any) => {
    const newSession = {
      ...formData,
      date_time: dateValue,
      reminder_sent: false,
      canceled: false,
      confirmed: false,
    };
    const postSessionResponse = await postSession(newSession);
    router.push({
      pathname: `/calendar`,
    });

    ///
    /// must move all sending messages outside form
  };

  return (
    <Box style={{ overflow: 'visible' }}>
      <form
        onSubmit={form.onSubmit((values) => {
          values.date_time = dateValue;
          console.log(values);
          handleSubmit(values);
          // showSessionForm(false);
        })}
      >
        {oldSession.client_id != '' && (
          <Select
            label="Client"
            data={possibleClients}
            placeholder="Select Client"
            nothingFound="Nothing found"
            searchable
            // creatable this is not how clients should be created
            getCreateLabel={(query) => `+ Create ${query}`}
            {...form.getInputProps('client_id')}
          />
        )}
        <Select
          label="Location"
          data={locationData}
          placeholder="Select Location"
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
          onChange={() => setDateValue}
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
              /// go to session page
              // showSessionForm(false);
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
