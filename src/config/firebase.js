import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ENV } from './env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE.apiKey,
  authDomain: ENV.FIREBASE.authDomain,
  projectId: ENV.FIREBASE.projectId,
  storageBucket: ENV.FIREBASE.storageBucket,
  messagingSenderId: ENV.FIREBASE.messagingSenderId,
  appId: ENV.FIREBASE.appId,
  measurementId: ENV.FIREBASE.measurementId,
};

function assertFirebaseConfig() {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missing = required.filter((key) => !firebaseConfig[key]);
  if (missing.length) {
    throw new Error(`Missing Firebase config: ${missing.join(', ')}`);
  }
}

let app;
let auth;

export function getFirebaseAuth() {
  if (!auth) {
    assertFirebaseConfig();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return auth;
}
