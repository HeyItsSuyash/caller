'use client';

import React from 'react';
import { Check } from 'lucide-react';
import GlowButton from './GlowButton';

const PricingCards = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '₹2,499',
      period: 'mo',
      desc: 'Deploy basic voice support automation.',
      features: [
        'Up to 1,000 AI Minutes',
        '2 Active AI Agents',
        'Google Standard Voice Synthesis',
        'MongoDB Lead Logs API',
        'Standard Email Support'
      ],
      active: false
    },
    {
      name: 'Growth',
      price: '₹9,999',
      period: 'mo',
      desc: 'Scale high-intent sales and campaign calls.',
      features: [
        'Up to 5,000 AI Minutes',
        '10 Active AI Agents',
        'Hinglish Conversational Speech Models',
        'Live WebSockets Monitoring Feed',
        'Retrieval grounding inspectors (RAG)',
        'CRM Kanban Pipelines Integrations',
        'Priority Slack Support'
      ],
      active: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'quote',
      desc: 'High-availability voice channels infrastructure.',
      features: [
        'Unlimited AI Voice Minutes',
        'Unlimited Deployable Agents',
        'ElevenLabs / Custom Voice Clones',
        'Direct Exotel/Plivo SIP integrations',
        'Local LLM / Private Cloud Options',
        'Dedicated Solutions Architect',
        '99.99% Telephony SLA'
      ],
      active: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
      {tiers.map((tier, idx) => (
        <div 
          key={idx} 
          className={`p-8 border rounded-3xl backdrop-blur-sm transition-all duration-500 flex flex-col justify-between h-[520px] ${
            tier.active 
              ? 'border-white/20 bg-white/[0.03] shadow-[0_20px_50px_rgba(255,255,255,0.02)] scale-[1.03]' 
              : 'border-white/5 bg-white/[0.005] opacity-80'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">{tier.name}</span>
              {tier.active && (
                <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-black text-white">{tier.price}</span>
              <span className="text-xs text-neutral-500">/{tier.period}</span>
            </div>
            
            <p className="text-xs text-neutral-400 font-semibold mb-8 leading-relaxed">{tier.desc}</p>
            <div className="h-[1px] w-full bg-white/5 mb-8" />
            
            <ul className="space-y-3.5">
              {tier.features.map((feat, fidx) => (
                <li key={fidx} className="flex gap-3 items-center text-xs text-neutral-300 font-medium">
                  <Check className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <GlowButton 
              variant={tier.active ? 'primary' : 'secondary'} 
              className="w-full"
              showIcon={false}
              onClick={() => window.location.href = '/signup'}
            >
              Initialize Workspace
            </GlowButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
