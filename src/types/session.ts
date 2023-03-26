interface Session {
  id?: string;
  client_id: string; // should be able to find client with matching unique

  reminder_sent: boolean;
  confirmed: boolean;
  canceled: boolean;
  location: string;
  dateTime: Date;
}

export default Session;
