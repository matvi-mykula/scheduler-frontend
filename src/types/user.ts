import { Identifier } from 'typescript';

interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  paymentMethod: 'credit' | 'cash' | 'venmo' | 'other';
  textOK: boolean;
  emailOK: boolean;
  numSessions: number;
  numCancel: number;
  // add more
  rate: number;
  email: string;
  cell: string;
}

export default Client;
