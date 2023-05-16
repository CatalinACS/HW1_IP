import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import Head from 'next/head';
import router, { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  addRoom,
  editRoom,
  getHotel,
  getRoom,
} from '../../../src/firebase/database';
import { firebaseDb } from '../../../src/firebase/firebase';
import { AuthContext } from '../../../src/providers/auth/AuthProvider';
import { Room } from '../../../src/utils/types';
import styles from '../../../styles/Home.module.css';
import { error } from 'console';

export default function ModifyRoom({ id }: { id: string }) {
  const { state } = useContext(AuthContext);

  const [hotelId, setHotelId] = useState<string>();
  const router = useRouter();
  const roomData = useRef<Room>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!state.isUserLoggedIn) {
      console.log('You are not logged in!');
      router.push('/');
      return;
    } else {
      getRoom(id)
        .then((data) => {
          roomData.current = data;
        })
        .catch((error) => {
          console.error('Error getting room', error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, state, router, hotelId]);

  const renderPage = () => {
    return (
      <main className={styles.main}>
        {
          <main className={styles.main}>
            <h1>{'Room name'}</h1>
            <h2>{roomData.current?.name}</h2>

            <h2>
              {'Room number of beds: '}
              {roomData.current?.beds}
            </h2>

            <h2>
              {'Price per night: '}
              {roomData.current?.pricePerNight}
            </h2>

            <h2>
              {'Room benefits: '}
              {roomData.current?.benefits}
            </h2>
          </main>
        }
      </main>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Modify Room</title>
        <meta name="description" content="View Room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <>
          <h1 className={styles.title}>{'Room'}</h1>
          {isLoading ? (
            <h1 className={styles.title}>{'Loading...'}</h1>
          ) : (
            renderPage()
          )}
        </>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: {
      id,
    },
  };
}
