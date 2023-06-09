interface Client {
  id: string;
  first_name: string;
  last_name: string;
  payment_method: 'credit' | 'cash' | 'venmo' | 'other';
  text_ok: boolean;
  email_ok: boolean;
  num_sessions: number;
  num_cancels: number;
  // add more
  rate: number;
  email: string;
  cell: string;
  [key: string]: string | boolean | number | undefined;
}

interface ClientInput {
  id?: string;
  first_name: string;
  last_name: string;
  payment_method: 'credit' | 'cash' | 'venmo' | 'other';
  text_ok: boolean;
  email_ok: boolean;
  num_sessions: number;
  num_cancels: number;
  // add more
  rate: number;
  email: string;
  cell: string;
  [key: string]: string | boolean | number | undefined;
}

export type { Client, ClientInput };

// balance of sessions???? owed vs?
