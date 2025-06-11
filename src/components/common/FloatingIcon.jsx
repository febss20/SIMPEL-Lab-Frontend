import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../../utils/animations.css';

const FloatingIcon = ({ icon, to, title, color = 'indigo', showBadge = false, badgeContent }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef(null);

  useEffect(() => {
    const savedPos = localStorage.getItem('floatingIconPosition');
    if (savedPos) {
      try {
        const parsedPos = JSON.parse(savedPos);
        setPosition(parsedPos);
      } catch (error) {
        console.error('Error parsing saved position:', error);
      }
    } else {
      setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
    }
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const rect = iconRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setInitialPosition({ x: offsetX, y: offsetY });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const touch = e.touches[0];
    const rect = iconRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    setInitialPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - initialPosition.x;
    const newY = e.clientY - initialPosition.y;
    
    const maxX = window.innerWidth - iconRef.current.offsetWidth;
    const maxY = window.innerHeight - iconRef.current.offsetHeight;
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, initialPosition.x, initialPosition.y]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - initialPosition.x;
    const newY = touch.clientY - initialPosition.y;
    
    const maxX = window.innerWidth - iconRef.current.offsetWidth;
    const maxY = window.innerHeight - iconRef.current.offsetHeight;
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, initialPosition.x, initialPosition.y]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('floatingIconPosition', JSON.stringify(position));
    }
  }, [isDragging, position]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={iconRef}
      className={`fixed z-50 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.1s ease',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Link
        to={to}
        className={`bg-${color}-600 hover:bg-${color}-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center relative backdrop-blur-sm bg-opacity-90 border border-${color}-400 hover:border-${color}-300`}
        title={title}
        onClick={(e) => isDragging && e.preventDefault()}
        style={{
          boxShadow: `0 4px 20px rgba(79, 70, 229, 0.3)`,
        }}
      >
        <div className="relative">
          {icon}
          {showBadge && badgeContent}
        </div>
      </Link>
    </div>
  );
};

export default FloatingIcon;