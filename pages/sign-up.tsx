import Head from 'next/head';
import { provider, auth, firebaseDb } from '../src/firebase/firebase';
import styles from '../styles/Home.module.css';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useContext, useEffect, useRef } from 'react';
import router from 'next/router';
import { BasicUser } from '../src/utils/types';
import { addUser } from '../src/firebase/database';
import { AuthContext } from '../src/providers/auth/AuthProvider';

export default function SignInPage() {
  const { state, dispatch } = useContext(AuthContext);
  const email = useRef<string>('');
  const password = useRef<string>('');
  const firstName = useRef<string>('');
  const lastName = useRef<string>('');
  const dateOfBirth = useRef<Date>(new Date());

  if (state.isUserLoggedIn) {
    console.log('You are currently logged in!')
    router.push('/');
    return;
  }

  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user: BasicUser = {
          firstName: result.user.displayName ?? '',
          lastName: '',
          isOwner: false,
          id: result.user.uid,
          dateOfBirth: dateOfBirth.current.getTime(),
        };
        const onSuccess = () => {
          dispatch({
            type: 'sign-in',
          });
          dispatch({
            type: 'set-user',
            payload: { user: user },
          });
          router.push('/');
        };
        const onFailure = (error: any) => {
          console.warn('[SignUp]', error);
        };

        addUser({ user, onSuccess, onFailure });
      })
      .catch((error) => {
        console.warn('[SignIn]', error);
      });
  };

  const signUpWithCredentials = () => {
    // verify that email string resembles an email
    if (
      !email.current.includes('@') ||
      !email.current.includes('.') ||
      !(email.current.length > 5)
    ) {
      alert('Please enter a valid email address.');
      return;
    }

    // verify that password is at least 6 characters
    if (password.current.length < 6) {
      alert('Please enter a password with at least 6 characters.');
      return;
    }

    if (new Date().getTime() - dateOfBirth.current.getTime() < 504910816000) {
      alert('You must be at least 16 years old to sign up.');
      return;
    }

    createUserWithEmailAndPassword(auth, email.current, password.current)
      .then((userCredential) => {
        const user: BasicUser = {
          firstName: firstName.current,
          lastName: lastName.current,
          isOwner: false,
          id: userCredential.user.uid,
          dateOfBirth: dateOfBirth.current.getTime(),
        };
        const onSuccess = () => {
          dispatch({
            type: 'sign-in',
          });
          dispatch({
            type: 'set-user',
            payload: { user: user },
          });
          router.push('/');
        };
        const onFailure = (error: any) => {
          console.warn('[SignUp]', error);
        };

        addUser({ user, onSuccess, onFailure });
      })
      .catch((error) => {
        console.warn('[SignUp]', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('Email already in use.');
        }
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Unde Dorm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => (email.current = e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => (password.current = e.target.value)}
          className={styles.input}
        />
        <input
          placeholder="First Name"
          className={styles.input}
          onChange={(e) => (firstName.current = e.target.value)}
        />
        <input
          placeholder="Last Name"
          className={styles.input}
          onChange={(e) => (lastName.current = e.target.value)}
        />
        <input
          type="date"
          placeholder="Date Of Birth"
          className={styles.input}
          onChange={(e) => (dateOfBirth.current = new Date(e.target.value))}
        />
        <button onClick={signUpWithCredentials} className={styles.card}>
          <p>Sign Up</p>
        </button>

        <button onClick={signUpWithGoogle} className={styles.card}>
          <p>Sign Up with Google</p>
        </button>
      </main>
    </div>
  );
}
