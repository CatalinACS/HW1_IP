import Head from 'next/head';
import styles from '../styles/Hotels.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../src/providers/auth/AuthProvider';
import { useRouter } from 'next/router';
import { firebaseDb, storage, storageRef } from '../src/firebase/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

export default function HotelList() {
  const { state } = useContext(AuthContext);
  const router = useRouter();
  const hotelsRef = collection(firebaseDb, 'hotels');

  const [hotelImages, setHotelImages] = useState<string[]>([]);
  const [hotelNames, setHotelNames] = useState<string[]>([]);
  const [hotelLocations, setHotelLocations] = useState<string[]>([]);
  const [hotelDescriptions, setHotelDescriptions] = useState<string[]>([]);
  const [hotelIds, setHotelIds] = useState<string[]>([]);

  useEffect(() => {
    if (!state.isUserLoggedIn && !state.isUserLoaded) {
      console.log('You are not logged in!');
      router.push('/');
    } else if (state.isUserLoggedIn && state.isUserLoaded) {
      console.log(hotelsRef);
      const getHotels = async () => {
        const hotelsSnapshot = await getDocs(hotelsRef);
        const hotelsData = hotelsSnapshot.docs
          .map((doc) => doc.data())
          .filter(
            (data) =>
              data.name !== undefined &&
              data.name !== null &&
              data.ownerId === state.user.id
          );

        const hotelImages = hotelsData.map((data) => data.images);
        const hotelNames = hotelsData.map((data) => data.name);
        const hotelLocations = hotelsData.map((data) => data.location);
        const hotelDescriptions = hotelsData.map((data) => data.description);
        const hotelIds = hotelsData.map((data) => data.id);

        // Set the state with the hotel names and locations
        setHotelImages(hotelImages);
        setHotelNames(hotelNames);
        setHotelLocations(hotelLocations);
        setHotelDescriptions(hotelDescriptions);
        setHotelIds(hotelIds);
      };
      getHotels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isUserLoggedIn, state.isUserLoaded]);
  const handleDelete = async (hotelId) => {
    try {
      await deleteDoc(doc(firebaseDb, 'hotels', hotelId));
      console.log('Hotel deleted successfully!');
      router.reload();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Hoteluri detinute</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              <th>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {hotelNames.map((name, index) => (
              <tr key={name}>
                <td>{hotelImages[index].at(hotelImages[index].length - 1)}</td>
                <td className={styles.td}>{name}</td>
                <td className={styles.td}>{hotelLocations[index]}</td>
                <td className={styles.td}>{hotelDescriptions[index]}</td>
                <td className={styles.td}>
                  <button onClick={() => handleDelete(hotelIds[index])}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
