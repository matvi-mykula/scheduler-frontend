import {
  Button,
  Input,
  Box,
  Group,
  TextInput,
  Checkbox,
  Select,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

function User() {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      paymentMethod: 'cash',
      textOK: false,
      emailOK: false,
      email: '',
      cell: '',
      rate: 0,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  return (
    <Box>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="First Name"
          placeholder="first name"
          {...form.getInputProps('firstName')}
        />
        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="last name"
          {...form.getInputProps('lastName')}
        />
        <Select
          label="payment method"
          placeholder="Pick one"
          data={[
            { value: 'cash', label: 'Cash' },
            { value: 'credit', label: 'Credit' },
            { value: 'venmo', label: 'Venmo' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <Checkbox
          mt="md"
          label="TextOK?"
          {...form.getInputProps('textOK', { type: 'checkbox' })}
        />
        <Checkbox
          mt="md"
          label="EmailOK?"
          {...form.getInputProps('emailOK', { type: 'checkbox' })}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <TextInput
          withAsterisk
          label="Cell"
          placeholder="9876543210"
          {...form.getInputProps('cell')}
        />
        <NumberInput
          withAsterisk
          label="rate"
          placeholder="0"
          {...form.getInputProps('rate')}
        ></NumberInput>

        <Group
          position="center"
          mt="md"
        >
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default User;

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
