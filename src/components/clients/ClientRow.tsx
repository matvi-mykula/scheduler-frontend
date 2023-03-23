import Client from '@/types/user';
import { Box } from '@mantine/core';

interface ClientRowProps {
  key: number;
  rowData: Client;
}

export default function ClientRow({ key, rowData }: ClientRowProps) {
  console.log(rowData);
  return (
    <Box key={key}>
      <tr key={rowData.id}>
        <td>{rowData.first_name}</td>
        <td>{rowData.cell}</td> <td>{rowData.email}</td>{' '}
        <td>{rowData.email_ok}</td> <td>{rowData.cell}</td>{' '}
        <td>{rowData.text_ok}</td> <td>{rowData.num_sessions}</td>{' '}
        <td>{rowData.num_cancels}</td> <td>{rowData.rate}</td>{' '}
        <td>{rowData.payment_method}</td>{' '}
      </tr>
    </Box>
  );
}
