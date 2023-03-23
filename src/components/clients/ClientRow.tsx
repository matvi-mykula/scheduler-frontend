import Client from '@/types/user';
import { Box } from '@mantine/core';

interface ClientRowProps {
  key: number;
  rowData: Client;
}

export default function ClientRow({ key, rowData }: ClientRowProps) {
  return (
    <tr key={rowData.id}>
      <td>{rowData.first_name}</td>
      <td>{rowData.last_name}</td>
      <td>{rowData.cell}</td>
      <td>{`${rowData.text_ok}`}</td>
      <td>{rowData.email}</td> <td>{`${rowData.email_ok}`}</td>
      <td>{rowData.payment_method}</td> <td>{rowData.num_sessions}</td>{' '}
      <td>{rowData.num_cancels}</td>
      <td>{rowData.rate}</td>{' '}
    </tr>
  );
}
