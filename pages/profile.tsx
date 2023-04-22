import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Profile() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pagina de profil</h1>
      </main>
    </div>
  );
}
