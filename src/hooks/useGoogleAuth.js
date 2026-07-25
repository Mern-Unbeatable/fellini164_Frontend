import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginWithGoogle } from '../features/auth/authAPI';
import { clearError } from '../features/auth/authSlice';
import { logGoogleAuth } from '../services/googleAuthDebug';

export function useGoogleAuth() {
  const dispatch = useDispatch();

  const handleGoogleSignIn = useCallback(async () => {
    logGoogleAuth(0, 'Button clicked — Continue with Google');
    dispatch(clearError());
    const result = await dispatch(loginWithGoogle());

    if (loginWithGoogle.fulfilled.match(result)) {
      toast.success('Signed in with Google. Welcome!', {
        position: 'top-right',
        autoClose: 2000,
      });
      return true;
    }

    if (result.payload) {
      toast.error(result.payload, {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    return false;
  }, [dispatch]);

  return { handleGoogleSignIn };
}
