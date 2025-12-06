import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  onClick,
  disabled,
  ...props 
}) => {
  // Try to use sound, but don't fail if used outside provider (though App structure prevents this)
  let play: any = () => {};
  try {
     // eslint-disable-next-line react-hooks/rules-of-hooks
     const sound = useSound();
     play = sound.play;
  } catch(e) { /* ignore */ }

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg relative overflow-hidden';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white focus:ring-primary-500 shadow-lg shadow-primary-900/20',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
    outline: 'border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px] sm:min-h-[32px]',
    md: 'px-4 py-3 sm:py-2 text-base min-h-[44px]',
    lg: 'px-6 py-4 sm:py-3 text-lg min-h-[52px]'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      play('click');
      onClick?.(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
      disabled={disabled}
      {...props as any} // Framer motion types compat
    >
      {children}
    </motion.button>
  );
};
