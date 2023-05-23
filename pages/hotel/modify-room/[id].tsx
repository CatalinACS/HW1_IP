import { ref, uploadBytes } from 'firebase/storage';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { editRoom, getHotel, getRoom } from '../../../src/firebase/database';
import { storage } from '../../../src/firebase/firebase';
import { AuthContext } from '../../../src/providers/auth/AuthProvider';
import { Hotel, Room } from '../../../src/utils/types';
import styles from '../../../styles/Home.module.css';

export default function ModifyRoom({ id }: { id: string }) {
  const { state } = useContext(AuthContext);
  const router = useRouter();
  const roomData = useRef<Room>();
  const roomNameRef = useRef<string>(roomData.current?.name ?? '');
  const roomNoBedsRef = useRef<number>(roomData.current?.beds ?? 0);
  const roomPriceRef = useRef<number>(roomData.current?.pricePerNight ?? 0);
  const roomBenefitsRef = useRef<string>(roomData.current?.benefits ?? '');
  const roomOriginalData = useRef<Room>();
  const hotelData = useRef<Hotel>();
  const hotelOwnerId = useRef<string>();
  const images = useRef<File[]>([]);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
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
          roomNameRef.current = roomData.current.name;
          roomNoBedsRef.current = roomData.current.beds;
          roomPriceRef.current = roomData.current.pricePerNight;
          roomBenefitsRef.current = roomData.current.benefits;

          if (roomData.current) {
            getHotel(roomData.current.hotelId)
              .then((data) => {
                hotelData.current = data;
                hotelOwnerId.current = data.ownerId ?? '';
              })
              .catch((error) => {
                console.log('Error getting hotel:', error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log('Error getting room:', error);
          setIsLoading(false);
        });
    }
  }, [id, router, state]);

  const addImage = () => {
    if (imageUpload == null) {
      alert("Please select an image!");
      return;
    }
    images.current.push(imageUpload);
    alert("Image uploaded successfully!");
  };

  const onSave = () => {
    const onSuccess = () => {
      alert('Room successfully modified!');
      router.back();
    };

    const onFailure = (error: any) => {
      alert('Error modifying room: ' + error);
    };

    if (!roomNameRef.current) {
      alert('Room name cannot be empty!');
      return;
    }

    if (!roomNoBedsRef.current) {
      alert('Room number of beds cannot be empty!');
      return;
    }

    if (!roomPriceRef.current) {
      alert('Room price cannot be empty!');
      return;
    }

    if (!roomBenefitsRef.current) {
      alert('Room benefits cannot be empty!');
      return;
    }

    let newData = {};

    if (roomNameRef.current !== roomOriginalData.current?.name) {
      newData = { ...newData, name: roomNameRef.current };
    }

    if (roomNoBedsRef.current !== roomOriginalData.current?.beds) {
      newData = { ...newData, beds: roomNoBedsRef.current };
    }

    if (roomPriceRef.current !== roomOriginalData.current?.pricePerNight) {
      newData = { ...newData, pricePerNight: roomPriceRef.current };
    }

    if (roomBenefitsRef.current !== roomOriginalData.current?.benefits) {
      newData = { ...newData, benefits: roomBenefitsRef.current };
    }

    if (images.current.length > 0) {
      const updatedImages = [...roomOriginalData.current?.images || []];

      images.current.forEach((image) => {
        const uniqueId = image.name + Date.now().toString();
        updatedImages.push(uniqueId);
        const imageRef = ref(storage, `rooms/${id}/${uniqueId}`);
        uploadBytes(imageRef, image);
      });

      newData = { ...newData, images: updatedImages};
    }

    if (Object.keys(newData).length === 0) {
      alert('No changes were made!');
      return;
    }
    editRoom({ roomId: id, newData, onSuccess, onFailure });
  };

  const renderPage = () => {
    return (
      <>
        <h1>{'Room name'}</h1>
        <input
          type="text"
          defaultValue={roomOriginalData.current?.name}
          onChange={(e) => (roomNameRef.current = e.target.value)}
        />
        <h1>{'Room number of beds'}</h1>
        <input
          type="number"
          defaultValue={roomOriginalData.current?.beds}
          onChange={(e) => (roomNoBedsRef.current = parseInt(e.target.value))}
        />
        <h1>{'Room price'}</h1>
        <input
          type="number"
          defaultValue={roomOriginalData.current?.pricePerNight}
          onChange={(e) => (roomPriceRef.current = parseInt(e.target.value))}
        />
        <h1>{'Room benefits'}</h1>
        <input
          type="text"
          defaultValue={roomOriginalData.current?.benefits}
          onChange={(e) => (roomBenefitsRef.current = e.target.value)}
        />
        <input
            type="file"
            onChange={(e) => {
              setImageUpload(e.target.files?.[0] ?? null);
            }}
            className={styles.input}
          />

        <button onClick={addImage} className={styles.card}>
          {'Upload Image'}
        </button>
        <button onClick={onSave}>
          {'Save'}
        </button>
      </>
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
