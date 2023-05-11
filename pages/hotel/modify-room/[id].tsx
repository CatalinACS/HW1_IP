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
import { Hotel, Room } from '../../../src/utils/types';
import styles from '../../../styles/Home.module.css';
import { get } from 'http';

export default function ModifyRoom({ id }: { id: string }) {
  const { state } = useContext(AuthContext);
  const router = useRouter();
  const roomData = useRef<Room>();
  const roomOriginalData = useRef<Room>();
  const hotelData = useRef<Hotel>();
  const hotelOwnerId = useRef<string>();
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
          roomOriginalData.current = data;
        })
        .catch((error) => {
          console.log('Error getting room:', error);
        });

      if (roomData.current) {
        getHotel(roomData.current.hotelId)
          .then((data) => {
            hotelData.current = data;
            hotelOwnerId.current = data.ownerId ?? '';
          })
          .catch((error) => {
            console.log('Error getting hotel:', error);
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [id, router, state]);

  const onSave = () => {
    const onSuccess = () => {
      alert('Room successfully modified!');
    };

    const onFailure = (error: any) => {
      alert('Error modifying room: ' + error);
    };

    if (!roomData.current?.name) {
      alert('Room name cannot be empty!');
      return;
    }

    if (!roomData.current?.beds) {
      alert('Room number of beds cannot be empty!');
      return;
    }

    if (!roomData.current?.pricePerNight) {
      alert('Room price cannot be empty!');
      return;
    }

    if (!roomData.current?.benefits) {
      alert('Room benefits cannot be empty!');
      return;
    }

    let newData = {};

    if (roomData.current?.name !== roomOriginalData.current?.name) {
      newData = { ...newData, name: roomData.current?.name };
    }

    if (roomData.current?.beds !== roomOriginalData.current?.beds) {
      newData = { ...newData, beds: roomData.current?.beds };
    }

    if (
      roomData.current?.pricePerNight !==
      roomOriginalData.current?.pricePerNight
    ) {
      newData = { ...newData, pricePerNight: roomData.current?.pricePerNight };
    }

    if (roomData.current?.benefits !== roomOriginalData.current?.benefits) {
      newData = { ...newData, benefits: roomData.current?.benefits };
    }

    if (Object.keys(newData).length === 0) {
      alert('No changes were made!');
      return;
    }
    editRoom({ roomId: id, newData, onSuccess, onFailure });
  };
  const renderPage = () => {
    return (
      <main className={styles.main}>
        <h1>{'Room name'}</h1>
        <input
          type="text"
          value={roomOriginalData.current?.name}
          onChange={(e) => (roomData.current?.name = e.target.value)}
        />
        <h1>{'Room number of beds'}</h1>
        <input
          type="number"
          value={roomOriginalData.current?.beds}
          onChange={(e) => (roomData.current?.beds = e.target.value)}
        />
        <h1>{'Room price'}</h1>
        <input
          type="number"
          value={roomOriginalData.current?.pricePerNight}
          onChange={(e) => (roomData.current?.pricePerNight = e.target.value)}
        />
        <h1>{'Room benefits'}</h1>
        <input
          type="text"
          value={roomOriginalData.current?.benefits}
          onChange={(e) => (roomData.current?.benefits = e.target.value)}
        />
        <button onClick={onSave}>Save</button>
      </main>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <>
          <h1 className={styles.title}>{'Modify room'}</h1>
          {isLoading ? (
            <h1 className={styles.title}>{'Loading...'}</h1>
          ) : (
            <>
              {' '}
              {state.user?.isOwner &&
              state.user.id === hotelData.current?.ownerId
                ? renderPage()
                : router.push('/')}
            </>
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
