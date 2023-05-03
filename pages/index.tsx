import Head from 'next/head';
import { auth } from '../src/firebase/firebase';
import styles from '../styles/Home.module.css';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import router from 'next/router';
import Link from 'next/link';
import { getUser } from '../src/firebase/database';

export default function Home() {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [username, setUsername] = useState('Guest');

  const signOut = () => {
    auth.signOut().then(() => {
      setUsername('Guest');
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsUserLoaded(false);
      if (user) {
        try {
          const data = await getUser(user.uid);
          setUsername(data ? data.firstName : 'Guest');
        } catch (error) {
          console.warn('[Home]', error);
          setUsername('Guest');
        }
      } else {
        setUsername('Guest');
      }
      setIsUserLoaded(true);
    });

    return unsubscribe;
  }, []);

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
            Hello, {username}! Welcome to <a href="">UndeDorm</a>
          </h1>
        )}

        {isUserLoaded && username !== 'Guest' && (
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

        {!isUserLoaded && <div className={styles.grid}></div>}

        {isUserLoaded && (
          <div className={styles.grid}>
            {username !== 'Guest' && (
              <button onClick={signOut} className={styles.card}>
                <p>Log out</p>
              </button>
            )}
            {username === 'Guest' && (
              <button onClick={onSignIn} className={styles.card}>
                <p>Sign In</p>
              </button>
            )}
            {username === 'Guest' && (
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
