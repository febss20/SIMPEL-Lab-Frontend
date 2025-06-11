import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../api/auth';
import BiometricService from '../../api/biometric';

const ensureUserRole = (user) => {
  if (!user) return null;
  
  if (!user.role) {
    user.role = 'USER';
  }
  
  user.role = user.role.toUpperCase();
  
  if (!['ADMIN', 'TECHNICIAN', 'USER'].includes(user.role)) {
    user.role = 'USER';
  }
  
  return user;
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await AuthService.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await AuthService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await AuthService.getCurrentUser();
      if (!data) {
        return rejectWithValue('User not found');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Biometric Authentication Actions
export const registerBiometric = createAsyncThunk(
  'auth/registerBiometric',
  async (username, { rejectWithValue }) => {
    try {
      const data = await BiometricService.registerBiometric(username);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to register biometric');
    }
  }
);

export const loginWithBiometric = createAsyncThunk(
  'auth/loginWithBiometric',
  async (username, { rejectWithValue }) => {
    try {
      const data = await BiometricService.loginWithBiometric(username);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Biometric login failed');
    }
  }
);

export const checkBiometricSupport = createAsyncThunk(
  'auth/checkBiometricSupport',
  async (_, { rejectWithValue }) => {
    try {
      const isSupported = BiometricService.isSupported();
      const isPlatformAvailable = await BiometricService.isPlatformAuthenticatorAvailable();
      return {
        isSupported,
        isPlatformAvailable
      };
    } catch (error) {
      return rejectWithValue('Failed to check biometric support');
    }
  }
);

const user = AuthService.getUserFromLocalStorage();
const initialState = {
  user: ensureUserRole(user),
  isAuthenticated: !!user,
  isLoading: false,
  error: null,
  biometric: {
    isSupported: false,
    isPlatformAvailable: false,
    isRegistered: false,
    isLoading: false,
    error: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      AuthService.logout();
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = ensureUserRole(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = ensureUserRole(action.payload);
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Biometric Authentication Cases
      .addCase(checkBiometricSupport.pending, (state) => {
        state.biometric.isLoading = true;
        state.biometric.error = null;
      })
      .addCase(checkBiometricSupport.fulfilled, (state, action) => {
        state.biometric.isLoading = false;
        state.biometric.isSupported = action.payload.isSupported;
        state.biometric.isPlatformAvailable = action.payload.isPlatformAvailable;
      })
      .addCase(checkBiometricSupport.rejected, (state, action) => {
        state.biometric.isLoading = false;
        state.biometric.error = action.payload;
      })
      .addCase(registerBiometric.pending, (state) => {
        state.biometric.isLoading = true;
        state.biometric.error = null;
      })
      .addCase(registerBiometric.fulfilled, (state) => {
        state.biometric.isLoading = false;
        state.biometric.isRegistered = true;
      })
      .addCase(registerBiometric.rejected, (state, action) => {
        state.biometric.isLoading = false;
        state.biometric.error = action.payload;
      })
      .addCase(loginWithBiometric.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.biometric.error = null;
      })
      .addCase(loginWithBiometric.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = ensureUserRole(action.payload.user);
      })
      .addCase(loginWithBiometric.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.biometric.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;