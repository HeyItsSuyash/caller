'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  glowColor?: 'emerald' | 'indigo' | 'neutral';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
  }
};

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  glowColor = 'neutral'
}) => {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.15)', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group p-6 border border-white/5 bg-white/[0.005] rounded-2xl backdrop-blur-sm flex flex-col justify-between h-[200px]"
    >
      <div className="space-y-4">
        {/* Clean minimal icon housing */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 text-white transition-all group-hover:border-white/20 group-hover:bg-white/10">
          <Icon className="w-4.5 h-4.5" />
        </div>
        
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none">{title}</h4>
        <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed line-clamp-3">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;

