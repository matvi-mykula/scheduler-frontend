import axios from 'axios';
import Client from '@/types/user';
import Session from '@/types/session';

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

const schedulingMessage = (date: Date, client: Client, session: Session) => {
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US');

  //   const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const schedulingText = `Hey ${
    client.first_name
  }! This text is confirming that you have scheduled personal training on ${
    daysOfWeek[date?.getDay()]
  } ${formattedDate} at ${formattedTime} at ${session.location}`;

  return schedulingText;
};

export { postTextToPhone, schedulingMessage };
