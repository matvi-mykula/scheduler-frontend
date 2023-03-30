interface Session {
  id?: number;
  client_id: string; // should be able to find client with matching unique
  reminder_sent: boolean;
  confirmed: boolean;
  canceled: boolean;
  location: string;
  date_time: Date;
}

interface SessionFormProps {
  session: Session;
  tableChange: boolean;
  setTableChange: Function;
  collapse: Function;
}

export type { Session, SessionFormProps };
