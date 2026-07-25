import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';
import { logGoogleAuth } from './googleAuthDebug';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Opens Google sign-in popup via Firebase Auth and returns a Firebase ID token
 * for the backend to verify (Firebase Admin SDK).
 */
export async function getGoogleIdToken() {
  logGoogleAuth(2, 'Opening Google popup (Firebase signInWithPopup)...');

  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);

  logGoogleAuth(3, 'Google sign-in OK — Firebase user', {
    email: result.user.email,
    displayName: result.user.displayName,
    uid: result.user.uid,
  });

  // Force refresh so backend always gets a current Firebase ID token.
  const idToken = await result.user.getIdToken(true);

  logGoogleAuth(3, 'Firebase idToken received from getIdToken(true)', {
    length: idToken.length,
    preview: `${idToken.slice(0, 50)}...${idToken.slice(-20)}`,
  });

  return idToken;
}
