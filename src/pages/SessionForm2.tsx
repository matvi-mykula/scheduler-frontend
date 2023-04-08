import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import {
  getSessions,
  postSession,
  updateSession,
  timeSlotValidation,
  isTimePast,
} from '@/services/sessionsService';
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
import { getClients } from '@/services/clientsService';
dayjs.extend(tz);

///// --------- the idea here is to make a single reusable
///// --------- sessionform component that can be used while scheduling
///// --------- for a client, for a time, or editing a session

interface Props {
  startSession?: Session;
}

const SessionForm: React.FC<Props> = ({ startSession }) => {
  const router = useRouter();

  // if a props is passed use that as the starting values for the form if not then start with query passed in
  let oldSession;
  startSession
    ? (oldSession = startSession)
    : (oldSession = router.query as unknown as Session);
  let now;
  oldSession.date_time
    ? (now = new Date(oldSession.date_time.toString()))
    : (now = new Date());

  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const fetchUnavailableTimes = async () => {
    const response = await getSessions();
    // const bookedTimes: any = [];
    const { data, success } = response;
    if (success) {
      // data.forEach((session: Session) => {
      //   bookedTimes.push(new Date(session.date_time));
      // });
      setUnavailableTimes(data);
      console.log({ unavailableTimes });
    }
  };

  /// prob should make this its own table
  const [locationData, setLocationData] = useState([
    { value: 'Montclair Park', label: 'Montclair Park' },
    { value: 'Compound Dojo', label: 'Compound Dojo' },
  ]);

  const [possibleClients, setPossibleClients] = useState([
    // { value: '1', label: 'Kieran' },
    { value: '2', label: 'Matthew' },
    // { value: '3', label: 'Sheldon' },
  ]);
  const fetchClients = async () => {
    const response = await getClients();
    const { data, success } = response;
    if (success) {
      const mapped = data.map((client: Client) => {
        return { value: client.id.toString(), label: client.first_name };
      });

      setPossibleClients(mapped);
    }
  };
  useEffect(() => {
    fetchClients();
    fetchUnavailableTimes();
    console.log({ unavailableTimes });
  }, []);

  // update possibleClients to get from server all current clients
  const [dateValue, setDateValue] = useState<Date>(now);
  const [clientValue, setClientValue] = useState<string>('');
  //// initialize client, if client is not already one of the possible client_id
  //// then allow for choosing client from dropdown menu

  const form = useForm({
    initialValues: {
      id: oldSession.id,
      client_id: oldSession.client_id,
      date_time: dateValue,
      location: oldSession.location,
      reminder_sent: oldSession.reminder_sent,
      canceled: oldSession.canceled,
      confirmed: oldSession.confirmed,
    },
    ///something wierd here

    validate: (values: Session) => ({
      client_id:
        values.client_id === undefined
          ? 'client required'
          : values.client_id.length < 1
          ? 'Not a valid client'
          : null,
      date_time: !timeSlotValidation(values, unavailableTimes)
        ? 'This time is booked.'
        : !isTimePast(values.date_time)
        ? 'That time is in the past.'
        : null,
      location:
        values.location === undefined
          ? 'location required'
          : values.location.length < 2
          ? 'Not a valid location'
          : null,
      reminder_sent: values.reminder_sent === undefined ? 'need value' : null,
      canceled: values.canceled === undefined ? 'need value' : null,
      confimed: values.confirmed === undefined ? 'need value' : null,
    }),
  });

  const handleSubmit = async (formData: any) => {
    const newSession = {
      ...formData,
      date_time: dateValue,
    };

    //// how do i know whether to post or put??
    /// location data should only be initially passed to form if it is editing an already made session
    try {
      //this isnt happening
      if (newSession.date_time in unavailableTimes) {
        alert('That time slot is booked!');
        throw new Error('exiting try block');
      }

      let SessionResponse;
      startSession && startSession.location
        ? (SessionResponse = await updateSession(newSession)) //need to validate this still
        : (SessionResponse = await postSession(newSession));

      console.log({ SessionResponse });

      if (SessionResponse.success) {
        router.push({
          pathname: `/calendar`,
        });
      } else {
        console.log('success: ' + SessionResponse.success);
      }
    } catch (error) {
      console.error(error);
    }
    // if (SessionResponse.data.success)
    // const postSessionResponse = await postSession(newSession);

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
        {oldSession.client_id === '' && (
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
          error="Not a valid time or that time slot is already scheduled."
          valueFormat="DD MMM YYYY hh:mm A"
          label="Pick date and time"
          placeholder="Pick date and time"
          maw={400}
          defaultValue={dateValue}
          value={dateValue}
          // onChange={() => setDateValue}
          onChange={(e) => {
            if (e === null) {
              setDateValue(new Date());
            } else {
              setDateValue(e);
            }
          }}
          style={{ overflow: 'visible' }}
        />
        {/* remove when editing */}
        <Select
          label="Send Confirmation"
          placeholder="Pick one"
          defaultValue={'both'}
          data={[
            { value: '', label: 'None' },
            { value: 'text', label: 'Text' },
            { value: 'email', label: 'Email' },
            { value: 'both', label: 'Both' },
          ]}
          {...form.getInputProps('confirmation')}
        />
        {/* show when editing */}
        {startSession && startSession.location && (
          <Box>
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
          </Box>
        )}
        <br></br>
        <Box>
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            onClick={() => {
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
};

export default SessionForm;
