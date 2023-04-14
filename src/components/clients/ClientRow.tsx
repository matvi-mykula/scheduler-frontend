import Client from '@/types/user';
import { Box } from '@mantine/core';

interface ClientRowProps {
  key: number;
  rowData: Client;
}

export default function ClientRow({ key, rowData }: ClientRowProps) {
  return (
    <tr key={rowData.id}>
      {Object.values(rowData).map((value, index) => (
        <td key={index}>{value}</td>
      ))}
    </tr>
  );
}
