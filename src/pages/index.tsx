import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { AppShell, Navbar, Header, Box, Button, Text } from '@mantine/core';
import { Router, useRouter } from 'next/router';
import Link from 'next/link';
import { Notifications } from '@mantine/notifications';

const inter = Inter({ subsets: ['latin'] });
interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <AppShell
        padding="md"
        // navbar={
        //   <Navbar
        //     width={{ base: 300 }}
        //     height={500}
        //     p="xs"
        //   >
        //     {/* Navbar content */}
        //   </Navbar>
        // }
        header={
          <Header
            height={100}
            p="xs"
            className={styles.header}
          >
            <Link href="/home">
              <Text>Home</Text>
            </Link>{' '}
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Head>
          <title>Create Next App</title>
          <meta
            name="description"
            content="Generated by create next app"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <link
            rel="icon"
            href="/favicon.ico"
          />
        </Head>
        <Notifications />

        <main>{children}</main>
      </AppShell>
    </>
  );
};

export default Layout;
