import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../src/providers/auth/AuthProvider';
import styles from '../styles/Home.module.css';

export default function Profile() {
  const { state } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!state.isUserLoggedIn) {
      console.log('You are not logged in!');
      router.push('/');
    }
  }, [state.isUserLoggedIn, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Reservations</h1>
      </main>
    </div>
  );
}
