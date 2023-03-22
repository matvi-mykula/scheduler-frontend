import { Identifier } from 'typescript';

interface Client {
  id: Identifier;
  firstName: string;
  lastName: string;
  paymentMethod: 'credit' | 'cash' | 'venmo' | 'other';
  textOK: boolean;
  numSessions: number;
  numCancel: number;
  // add more
  rate: number;
}

export default Client;
