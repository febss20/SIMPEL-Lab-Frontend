import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../../store/slices/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Password tidak cocok');
      return false;
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Password harus minimal 6 karakter');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    
    try {
      await dispatch(register(userData)).unwrap();
      navigate('/login', { state: { message: 'Pendaftaran berhasil. Silakan login.' } });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 8 + 2;
      const styles = {
        position: 'absolute',
        borderRadius: '50%',
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: `rgba(${Math.floor(Math.random() * 128 + 128)}, ${Math.floor(Math.random() * 128 + 128)}, ${Math.floor(Math.random() * 128 + 128)}, ${Math.random() * 0.5 + 0.2})`,
        animation: `float ${Math.random() * 10 + 10}s linear infinite`,
        animationDelay: `-${Math.random() * 10}s`,
        zIndex: 1
      };
      particles.push(<div key={i} style={styles} className="particle" />);
    }
    return particles;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden p-4">
      {generateParticles()}
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-purple-500/20 to-transparent animate-pulse-slow"></div>
        <div className="absolute -right-[10%] -bottom-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-blue-500/20 to-transparent animate-pulse-slow" style={{animationDelay: '-3s'}}></div>
      </div>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-2xl"
      >
        <motion.div 
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-lg shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white text-center border-b border-white/10">
            <h1 className="text-2xl font-bold">SIMPEL Lab Manager</h1>
            <p className="text-white/80 mt-1">Buat Akun Baru</p>
          </div>
          
          <div className="p-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-400/20 backdrop-blur-md border border-red-400/30 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="firstName">
                    Nama Depan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-white/5 text-white pl-10 w-full border border-white/10 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      required
                      placeholder="Nama depan"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="lastName">
                    Nama Belakang
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-white/5 text-white pl-10 w-full border border-white/10 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      required
                      placeholder="Nama belakang"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-white/5 text-white pl-10 w-full border border-white/10 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    required
                    placeholder="Masukkan username"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white/5 text-white pl-10 w-full border border-white/10 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    required
                    placeholder="contoh@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white/5 text-white pl-10 w-full border border-white/10 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    required
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2" htmlFor="confirmPassword">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-white/5 text-white pl-10 w-full border border-white/10 rounded-lg py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    required
                    placeholder="Ulangi password"
                  />
                </div>
                {passwordError && (
                  <p className="text-red-300 text-xs mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordError}
                  </p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </div>
                  ) : (
                    'Daftar'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="p-6 border-t border-white/10 bg-black/5">
            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-indigo-300 hover:text-white transition-colors">
                <span>Sudah punya akun? </span>
                <span className="font-semibold ml-1 underline hover:text-indigo-200">Masuk</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="text-center mt-6"
        >
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Kembali ke Beranda</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 