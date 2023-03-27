import axios from 'axios';
import Client from '@/types/user';

const postTextToPhone = (number: string, msg: string) => {
  axios
    .post('http://localhost:8080/sendMessage', {
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

const schedulingMessage = (date: Date, client: Client) => {
  console.log({ date });
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US');
  console.log(formattedDate);
  const schedulingText = `Hey ${
    client.first_name
  }! This text is confirming that you have scheduled personal training on ${
    daysOfWeek[date?.getDay()]
  } ${formattedDate} `;

  return schedulingText;
};

export { postTextToPhone, schedulingMessage };
