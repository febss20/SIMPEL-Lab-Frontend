import api from './axios';

class BiometricService {
  static isSupported() {
    return (
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential === 'function' &&
      typeof navigator.credentials?.create === 'function' &&
      typeof navigator.credentials?.get === 'function'
    );
  }

  static async isPlatformAuthenticatorAvailable() {
    if (!this.isSupported()) return false;
    
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error('Error checking platform authenticator:', error);
      return false;
    }
  }

  static async registerBiometric(username) {
    try {
      const optionsResponse = await api.post('/auth/biometric/register-options', {
        username
      });
      
      const responseData = optionsResponse.data;
      const options = responseData.options || responseData;
      
      console.log('Registration options received:', options);
    
      const publicKeyCredentialCreationOptions = {
        ...options,
        challenge: this.base64ToArrayBuffer(options.challenge),
        user: {
          ...options.user,
          id: this.base64ToArrayBuffer(options.user.id)
        },
        excludeCredentials: options.excludeCredentials?.map(cred => ({
          ...cred,
          id: this.base64ToArrayBuffer(cred.id)
        })) || []
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (!credential) {
        throw new Error('Gagal membuat credential biometric');
      }


      const credentialData = {
        id: credential.id,
        rawId: this.arrayBufferToBase64(credential.rawId),
        response: {
          attestationObject: this.arrayBufferToBase64(credential.response.attestationObject),
          clientDataJSON: this.arrayBufferToBase64(credential.response.clientDataJSON)
        },
        type: credential.type
      };

      const verificationResponse = await api.post('/auth/biometric/register-verify', {
        username,
        credential: credentialData
      });

      return verificationResponse.data;
    } catch (error) {
      console.error('Error registering biometric:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Gagal mendaftarkan autentikasi biometric'
      );
    }
  }

  static async loginWithBiometric(username) {
    try {
      const optionsResponse = await api.post('/auth/biometric/login-options', {
        username
      });
      
      const responseData = optionsResponse.data;
      const options = responseData.options || responseData;
      
      console.log('Authentication options received:', options);
      
      const publicKeyCredentialRequestOptions = {
        ...options,
        challenge: this.base64ToArrayBuffer(options.challenge),
        allowCredentials: options.allowCredentials?.map(cred => ({
          ...cred,
          id: this.base64ToArrayBuffer(cred.id)
        })) || []
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (!assertion) {
        throw new Error('Autentikasi biometric dibatalkan atau gagal');
      }

      const assertionData = {
        id: assertion.id,
        rawId: this.arrayBufferToBase64(assertion.rawId),
        response: {
          authenticatorData: this.arrayBufferToBase64(assertion.response.authenticatorData),
          clientDataJSON: this.arrayBufferToBase64(assertion.response.clientDataJSON),
          signature: this.arrayBufferToBase64(assertion.response.signature),
          userHandle: assertion.response.userHandle ? 
            this.arrayBufferToBase64(assertion.response.userHandle) : null
        },
        type: assertion.type
      };

      const verificationResponse = await api.post('/auth/biometric/login-verify', {
        username,
        assertion: assertionData
      });

      if (verificationResponse.data.token) {
        localStorage.setItem('token', verificationResponse.data.token);
        localStorage.setItem('user', JSON.stringify(verificationResponse.data.user));
      }

      return verificationResponse.data;
    } catch (error) {
      console.error('Error biometric login:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Gagal login dengan autentikasi biometric'
      );
    }
  }

  static async hasBiometricCredential(username) {
    try {
      const response = await api.get(`/auth/biometric/check/${username}`);
      return response.data.hasCredential;
    } catch (error) {
      console.error('Error checking biometric credential:', error);
      return false;
    }
  }

  static async removeBiometricCredential(username) {
    try {
      const response = await api.delete(`/auth/biometric/remove/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error removing biometric credential:', error);
      throw new Error(
        error.response?.data?.message || 
        'Gagal menghapus credential biometric'
      );
    }
  }

  static arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  static base64ToArrayBuffer(base64) {
    if (!base64 || typeof base64 !== 'string') {
      console.error('Invalid base64 input:', { base64, type: typeof base64 });
      throw new Error(`Invalid base64 string provided. Received: ${typeof base64} - ${JSON.stringify(base64)}`);
    }
    
    if (base64.length === 0) {
      console.error('Empty base64 string provided');
      throw new Error('Empty base64 string provided');
    }
    
    try {
      let standardBase64 = base64;
      
      if (base64.includes('-') || base64.includes('_') || !base64.includes('=')) {
        standardBase64 = base64
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      }
      
      const cleanBase64 = standardBase64.replace(/[^A-Za-z0-9+/=]/g, '');
      
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error('Error decoding base64:', error, 'Input:', base64);
      throw new Error(`Failed to decode base64 string: ${error.message}`);
    }
  }
}

export default BiometricService;