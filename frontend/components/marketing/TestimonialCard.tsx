'use client';

import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  company 
}) => {
  return (
    <div className="p-8 border border-white/5 bg-white/[0.005] hover:border-white/10 rounded-3xl backdrop-blur-sm transition-all duration-300 flex flex-col justify-between h-[200px]">
      <div className="space-y-4">
        <Quote className="w-5 h-5 text-neutral-600 fill-neutral-600" />
        <p className="text-xs text-neutral-300 font-semibold leading-relaxed line-clamp-3">
          "{quote}"
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-neutral-400">
        <span>{author}</span>
        <span className="text-[8px] opacity-60">{role} at {company}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
