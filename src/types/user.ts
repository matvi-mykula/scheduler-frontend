import { Identifier } from 'typescript';

interface Client {
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
}

export default Client;
