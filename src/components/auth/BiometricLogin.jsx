import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  checkBiometricSupport, 
  loginWithBiometric, 
  registerBiometric 
} from '../../store/slices/authSlice';
import BiometricService from '../../api/biometric';

const BiometricLogin = ({ username, onSuccess, onError }) => {
  const dispatch = useDispatch();
  const { biometric, isLoading } = useSelector((state) => state.auth);
  const [hasCredential, setHasCredential] = useState(false);
  const [isCheckingCredential, setIsCheckingCredential] = useState(false);

  useEffect(() => {
    dispatch(checkBiometricSupport());
  }, [dispatch]);

  useEffect(() => {
    const checkUserCredential = async () => {
      if (username && biometric.isSupported && biometric.isPlatformAvailable) {
        setIsCheckingCredential(true);
        try {
          const hasCredential = await BiometricService.hasBiometricCredential(username);
          setHasCredential(hasCredential);
        } catch (error) {
          console.error('Error checking biometric credential:', error);
        } finally {
          setIsCheckingCredential(false);
        }
      }
    };

    checkUserCredential();
  }, [username, biometric.isSupported, biometric.isPlatformAvailable]);

  const handleBiometricLogin = async () => {
    try {
      const result = await dispatch(loginWithBiometric(username)).unwrap();
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
    }
  };

  const handleRegisterBiometric = async () => {
    try {
      await dispatch(registerBiometric(username)).unwrap();
      setHasCredential(true);
      onSuccess?.({ message: 'Biometric berhasil didaftarkan! Silakan login dengan biometric.' });
    } catch (error) {
      onError?.(error);
    }
  };

  if (!biometric.isSupported) {
    return null;
  }

  if (biometric.isSupported && !biometric.isPlatformAvailable) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-yellow-700">
            Perangkat Anda tidak mendukung autentikasi biometric
          </span>
        </div>
      </div>
    );
  }

  if (isCheckingCredential || !username) {
    return (
      <div className="mt-4 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">atau</span>
        </div>
      </div>

      <div className="mt-6">
        {hasCredential ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBiometricLogin}
            disabled={isLoading || biometric.isLoading}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading || biometric.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memverifikasi...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Login dengan Biometric
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegisterBiometric}
            disabled={biometric.isLoading}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {biometric.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Mendaftarkan...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Daftarkan Biometric
              </>
            )}
          </motion.button>
        )}

        {/* Informasi biometric */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {hasCredential 
              ? 'Gunakan sidik jari, Face ID, atau Windows Hello untuk login'
              : 'Daftarkan biometric untuk login yang lebih aman dan cepat'
            }
          </p>
        </div>

        {/* Error message */}
        {biometric.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-700">{biometric.error}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BiometricLogin;