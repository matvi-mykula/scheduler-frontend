import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { Box } from '@mantine/core';
import { Inter } from 'next/font/google';
import Layout from './index';
const inter = Inter({ subsets: ['latin'] });

function Home() {
  return (
    <Box>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>Home of Matvi Plays</p>
        </div>

        {/* <div className={styles.center}>hero image</div> */}

        <div className={styles.grid}>
          <Link
            href="/clients"
            className={styles.card}
          >
            <h2 className={inter.className}>
              See All Clients <span>-&gt;</span>
            </h2>
          </Link>
          <Link
            href="/sessions"
            className={styles.card}
          >
            <h2 className={inter.className}>
              See All Sessions <span>-&gt;</span>
            </h2>
          </Link>
          <Link
            href="/users"
            className={styles.card}
          >
            <h2 className={inter.className}>
              Create New Client <span>-&gt;</span>
            </h2>
          </Link>
          <Link
            href="/calendar"
            className={styles.card}
          >
            <h2 className={inter.className}>
              See Calendar <span>-&gt;</span>
            </h2>
          </Link>
        </div>
      </main>
    </Box>
  );
}

export default Home;
