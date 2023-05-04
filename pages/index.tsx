import Head from 'next/head';
import { auth } from '../src/firebase/firebase';
import styles from '../styles/Home.module.css';
import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import router from 'next/router';
import Link from 'next/link';
import { getUser } from '../src/firebase/database';
import { AuthContext } from '../src/providers/auth/AuthProvider';

export default function Home() {
  const {
    dispatch,
    state: { isUserLoaded, isUserLoggedIn, user },
  } = useContext(AuthContext);

  const signOut = () => {
    auth.signOut().then(() => {
      dispatch({ type: 'logout' });
    });
  };

  const onSignIn = () => {
    router.push('/sign-in');
  };

  const onSignUp = () => {
    router.push('/sign-up');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!isUserLoaded && <h1 className={styles.title}>Loading...</h1>}
        {isUserLoaded && (
          <h1 className={styles.title}>
            Hello, {user?.firstName ?? 'Guest'}! Welcome to{' '}
            <a href="">UndeDorm</a>
          </h1>
        )}

        {isUserLoaded && isUserLoggedIn && (
          <div className={styles.grid}>
            <Link href="/profile" className={styles.card}>
              <h2>Profil &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </Link>

            <Link href="/reservations" className={styles.card}>
              <h2>Rezervari &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </Link>

            <Link href="/hotels" className={styles.card}>
              <h2>Cauta hotel &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </Link>

            <Link
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <h2>Deploy &rarr;</h2>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </Link>
          </div>
        )}

        {isUserLoaded && (
          <div className={styles.grid}>
            {isUserLoggedIn && (
              <button onClick={signOut} className={styles.card}>
                <p>Log out</p>
              </button>
            )}
            {!isUserLoggedIn && (
              <button onClick={onSignIn} className={styles.card}>
                <p>Sign In</p>
              </button>
            )}
            {!isUserLoggedIn && (
              <button onClick={onSignUp} className={styles.card}>
                <p>Sign Up</p>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
