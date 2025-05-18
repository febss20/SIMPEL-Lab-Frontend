import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('lab-particle');
      
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
      
      const colors = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
      particle.style.animationDelay = `-${Math.random() * 10}s`;
      
      return particle;
    };
    
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
      particleContainer.innerHTML = '';
      
      for (let i = 0; i < 30; i++) {
        particleContainer.appendChild(createParticle());
      }
    }
    
    return () => {
      if (particleContainer) {
        particleContainer.innerHTML = '';
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900">
      <div id="particle-container" className="absolute inset-0 z-0"></div>
      
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-transparent"></div>
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div 
          className="w-full max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight"
            variants={itemVariants}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              SIMPEL Lab Manager
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Platform manajemen peralatan laboratorium yang modern dan efisien untuk memudahkan peminjaman, pemeliharaan, dan inventarisasi.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={itemVariants}
          >
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="rounded-full bg-blue-500/20 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Peminjaman Mudah</h3>
              <p className="text-gray-300">Proses peminjaman peralatan yang cepat dan transparan dengan antarmuka yang intuitif.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="rounded-full bg-purple-500/20 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Inventarisasi Digital</h3>
              <p className="text-gray-300">Manajemen inventaris yang terorganisir dengan pelacakan status peralatan secara real-time.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="rounded-full bg-teal-500/20 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Pemeliharaan Terjadwal</h3>
              <p className="text-gray-300">Sistem pengelolaan pemeliharaan dan perbaikan untuk memastikan keandalan peralatan.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-6 justify-center"
            variants={itemVariants}
          >
            <Link to="/register" className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10">Daftar Sekarang</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            
            <Link to="/login" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-lg shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
              Masuk
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-auto pt-12 pb-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          &copy; {new Date().getFullYear()} SIMPEL Lab Manager. Semua hak dilindungi.
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage; 