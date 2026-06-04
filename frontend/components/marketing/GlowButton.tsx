'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  showIcon?: boolean;
}

const GlowButton: React.FC<GlowButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  showIcon = true 
}) => {
  if (variant === 'secondary') {
    return (
      <motion.button 
        whileHover={{ scale: 1.03, borderColor: 'rgba(255, 255, 255, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`px-5 py-2.5 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-all duration-200 backdrop-blur-md bg-white/[0.02] shadow-sm flex items-center justify-center gap-2 group cursor-pointer ${className}`}
      >
        <span>{children}</span>
        {showIcon && <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />}
      </motion.button>
    );
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(255,255,255,0.15)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative px-5 py-2.5 bg-white text-black border border-white rounded-xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-neutral-100 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer overflow-hidden ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {showIcon && <ArrowUpRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
    </motion.button>
  );
};

export default GlowButton;

