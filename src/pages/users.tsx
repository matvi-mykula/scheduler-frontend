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
import { postClient } from '@/services/clientsService';

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

  const handleSubmit = async (formData: any) => {
    const newClient = { ...formData, numSessions: 0, numCancels: 0 };
    const postClientResponse = await postClient(newClient);
  };

  return (
    <Box>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
          handleSubmit(values);
        })}
      >
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
