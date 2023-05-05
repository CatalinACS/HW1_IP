import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../src/providers/auth/AuthProvider';
import { useRouter } from 'next/router';
import { firebaseDb } from '../src/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function HotelList() {
  const { state } = useContext(AuthContext);
  const router = useRouter();
  const hotelsRef = collection(firebaseDb, 'hotels');

  const [hotelNames, setHotelNames] = useState<string[]>([]);

  useEffect(() => {
    if (!state.isUserLoggedIn && !state.isUserLoaded) {
      console.log('You are not logged in!');
      router.push('/');
    } else {
      console.log(hotelsRef);
      const getHotels = async () => {
        const hotelsSnapshot = await getDocs(hotelsRef);
        const newHotelNames = hotelsSnapshot.docs
          .map((doc) => doc.data().Name)
          .filter((Name) => Name !== undefined && Name !== null);

        setHotelNames(newHotelNames);
      };
      getHotels();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Cautare de hoteluri</h1>
        <ul>
          {hotelNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
