// // features/auth/authSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { setStorage, getStorage, removeStorage } from '../../utils/storage';
// import { AUTH_CONFIG } from '../../config/constants';
// import {
//   loginUser as loginUserAPI,
//   registerUser as registerUserAPI,
//   getCurrentUser as getCurrentUserAPI,
//   logoutUser as logoutUserAPI,
//   verifyOTP as verifyOTPAPI,
//   createCheckout as createCheckoutAPI,
//   sendForgotOTP as sendForgotOTPAPI,
//   resetPasswordAPI,

// } from './authAPI';

// // ===== Async Thunks =====

// // Login
// export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await loginUserAPI(payload);
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Login failed');
//   }
// });

// // Register
// export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await registerUserAPI(payload);
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Registration failed');
//   }
// });

// // Get Current User
// export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
//   try {
//     const response = await getCurrentUserAPI();
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to get user');
//   }
// });

// // Logout
// export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
//   try {
//     const response = await logoutUserAPI();
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Logout failed');
//   }
// });

// // Verify OTP
// export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await verifyOTPAPI(payload);
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
//   }
// });

// // Send Forgot Password OTP
// export const sendForgotOTP = createAsyncThunk('auth/sendForgotOTP', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await sendForgotOTPAPI(payload);
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
//   }
// });

// // Reset Password
// export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await resetPasswordAPI(payload);
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
//   }
// });

// // Create Checkout
// export const createCheckout = createAsyncThunk('auth/createCheckout', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await createCheckoutAPI(payload);
//     if (!response.success) return rejectWithValue(response.message);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Checkout failed');
//   }
// });

// // ===== Initial State =====
// const initialState = {
//   user: getStorage(AUTH_CONFIG.USER_KEY) || null,
//   token: getStorage(AUTH_CONFIG.TOKEN_KEY) || null,
//   isAuthenticated: !!getStorage(AUTH_CONFIG.TOKEN_KEY),
//   loading: false,
//   error: null,
//   forgotPasswordSuccess: false,
//   checkoutData: null,
// };

// // ===== Slice =====
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     clearError: (state) => { state.error = null; },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       removeStorage(AUTH_CONFIG.USER_KEY);
//       removeStorage(AUTH_CONFIG.TOKEN_KEY);
//     },
//     clearForgotPassword: (state) => { state.forgotPasswordSuccess = false; },
//   },
//   extraReducers: (builder) => {
//     // ===== Login =====
//     builder
//       .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         setStorage(AUTH_CONFIG.USER_KEY, action.payload.user);
//         setStorage(AUTH_CONFIG.TOKEN_KEY, action.payload.token);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload || 'Login failed';
//       });

//     // ===== Register =====
//     builder
//       .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         setStorage(AUTH_CONFIG.USER_KEY, action.payload.user);
//         setStorage(AUTH_CONFIG.TOKEN_KEY, action.payload.token);
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Registration failed';
//       });

//     // ===== Get Current User =====
//     builder
//       .addCase(getCurrentUser.pending, (state) => { state.loading = true; })
//       .addCase(getCurrentUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         setStorage(AUTH_CONFIG.USER_KEY, action.payload);
//       })
//       .addCase(getCurrentUser.rejected, (state) => {
//         state.loading = false;
//         state.isAuthenticated = false;
//         state.user = null;
//         state.token = null;
//         removeStorage(AUTH_CONFIG.USER_KEY);
//         removeStorage(AUTH_CONFIG.TOKEN_KEY);
//       });

//     // ===== Logout =====
//     builder.addCase(logoutUser.fulfilled, (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       removeStorage(AUTH_CONFIG.USER_KEY);
//       removeStorage(AUTH_CONFIG.TOKEN_KEY);
//     });

//     // ===== Verify OTP =====
//     builder
//       .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(verifyOTP.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         setStorage(AUTH_CONFIG.USER_KEY, action.payload.user);
//         setStorage(AUTH_CONFIG.TOKEN_KEY, action.payload.token);
//       })
//       .addCase(verifyOTP.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'OTP verification failed';
//       });

//     // ===== Forgot Password =====
//     builder
//       .addCase(sendForgotOTP.pending, (state) => { state.loading = true; state.error = null; state.forgotPasswordSuccess = false; })
//       .addCase(sendForgotOTP.fulfilled, (state) => {
//         state.loading = false;
//         state.forgotPasswordSuccess = true;
//       })
//       .addCase(sendForgotOTP.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to send OTP';
//         state.forgotPasswordSuccess = false;
//       });

//     // ===== Reset Password =====
//    builder
//   .addCase(resetPassword.pending, (state) => {
//     state.loading = true;
//     state.error = null;
//     state.forgotPasswordSuccess = false;
//   })
//   .addCase(resetPassword.fulfilled, (state) => {
//     state.loading = false;
//     state.forgotPasswordSuccess = true; // success flag
//   })
//   .addCase(resetPassword.rejected, (state, action) => {
//     state.loading = false;
//     state.error = action.payload || 'Failed to reset password';
//     state.forgotPasswordSuccess = false;
//   });

//     // ===== Checkout =====
//     builder
//       .addCase(createCheckout.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(createCheckout.fulfilled, (state, action) => { state.loading = false; state.checkoutData = action.payload; })
//       .addCase(createCheckout.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Checkout failed'; });
//   }
// });

// // ===== Exports =====
// export const { clearError, logout, clearForgotPassword } = authSlice.actions;

// // Selectors
// export const selectAuth = (state) => state.auth;
// export const selectUser = (state) => state.auth.user;
// export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
// export const selectCheckoutData = (state) => state.auth.checkoutData;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setStorage, getStorage, removeStorage } from '../../utils/storage';
import { AUTH_CONFIG } from '../../config/constants';

import {
  loginUser as loginUserAPI,
  registerUser as registerUserAPI,
  getCurrentUser as getCurrentUserAPI,
  logoutUser as logoutUserAPI,
  verifyOTP as verifyOTPAPI,
  createCheckout as createCheckoutAPI,
  sendForgotOTP as sendForgotOTPAPI,
  resetPasswordAPI,
} from './authAPI';

/* =======================
   Async Thunks
======================= */

// Login
export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await loginUserAPI(payload);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerUserAPI(payload);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserAPI();
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutUserAPI();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyOTPAPI(payload);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

// Send Forgot Password OTP
export const sendForgotOTP = createAsyncThunk(
  'auth/sendForgotOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sendForgotOTPAPI(payload);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await resetPasswordAPI(payload);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

// Create Checkout
export const createCheckout = createAsyncThunk(
  'auth/createCheckout',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createCheckoutAPI(payload);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Checkout failed');
    }
  }
);

/* =======================
   Initial State
======================= */

const initialState = {
  user: getStorage(AUTH_CONFIG.USER_KEY) || null,
  token: getStorage(AUTH_CONFIG.TOKEN_KEY) || null,
  isAuthenticated: !!getStorage(AUTH_CONFIG.TOKEN_KEY),
  loading: false,
  error: null,
  forgotPasswordSuccess: false,
  checkoutData: null,
};

/* =======================
   Slice
======================= */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      removeStorage(AUTH_CONFIG.USER_KEY);
      removeStorage(AUTH_CONFIG.TOKEN_KEY);
    },
    clearForgotPassword: (state) => {
      state.forgotPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== Login ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        setStorage(AUTH_CONFIG.USER_KEY, action.payload.user);
        setStorage(AUTH_CONFIG.TOKEN_KEY, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Register ===== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        setStorage(AUTH_CONFIG.USER_KEY, action.payload.user);
        setStorage(AUTH_CONFIG.TOKEN_KEY, action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Get Current User ===== */
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        setStorage(AUTH_CONFIG.USER_KEY, action.payload);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Logout ===== */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        removeStorage(AUTH_CONFIG.USER_KEY);
        removeStorage(AUTH_CONFIG.TOKEN_KEY);
      })

      /* ===== Verify OTP ===== */
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        setStorage(AUTH_CONFIG.USER_KEY, action.payload.user);
        setStorage(AUTH_CONFIG.TOKEN_KEY, action.payload.token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Forgot Password ===== */
      .addCase(sendForgotOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(sendForgotOTP.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(sendForgotOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.forgotPasswordSuccess = false;
      })

      /* ===== Reset Password ===== */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.forgotPasswordSuccess = false;
      })

      /* ===== Checkout ===== */
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* =======================
   Exports
======================= */

export const { clearError, logout, clearForgotPassword } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
export const selectCheckoutData = (state) => state.auth.checkoutData;

export default authSlice.reducer;
