import axios from 'axios';
import Client from '@/types/user';
import { Session } from '@/types/session';
import schedule from 'node-schedule';
import { updateSession } from './sessionsService';

const postTextToPhone = (number: string, msg: string) => {
  axios
    .post('http://localhost:3001/sendMessage', {
      number: number,
      msg: msg,
    })
    .then((response) => {
      console.log('message should be sent');
    })
    .catch((err) => {
      console.log(err);
    });
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const schedulingMessage = (
  date: Date,
  client: Client,
  session: Session,
  variable: string
) => {
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US');

  //   const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const schedulingText = `Hey ${
    client.first_name
  }! This text is ${variable} that you have scheduled personal training on ${
    daysOfWeek[date?.getDay()]
  } ${formattedDate} at ${formattedTime} at ${session.location}`;

  return schedulingText;
};
const getDate24HoursBefore = (date: Date): Date => {
  const newDate = new Date();
  newDate.setTime(date.getTime() - 24 * 60 * 60 * 1000);
  return newDate;
};

const reminderMessage = (date: Date, client: Client, session: Session) => {
  const reminderDate = getDate24HoursBefore(date);
  console.log('should remind at');
  console.log({ reminderDate });
  const reminderContent = schedulingMessage(
    date,
    client,
    session,
    'a reminder'
  );
  console.log({ reminderContent });
  schedule.scheduleJob(reminderDate, () => {
    //this is commented out to save money
    // postTextToPhone(client.cell, reminderContent);
    session.reminder_sent = true;
    console.log({ session });
    updateSession(session);
    console.log('reminder sent');
  });
};

export { postTextToPhone, schedulingMessage, reminderMessage };
