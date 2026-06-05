import React, { useState } from 'react';
import { Copy, Check, Code, Smartphone, Globe } from 'lucide-react';

interface TabIntegrationsProps {
  activeEntity: string;
  entities: any[];
}

const TabIntegrations: React.FC<TabIntegrationsProps> = ({ activeEntity, entities }) => {
  const [platform, setPlatform] = useState<'html' | 'react'>('html');
  const [copied, setCopied] = useState(false);

  const entity = entities.find(e => e.name === activeEntity);
  const entityId = entity?._id || 'ENTITY_ID';
  const getBackendUrl = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window !== 'undefined') {
      if (window.location.hostname.includes('caller.work')) {
        return 'https://caller-24ie.onrender.com';
      }
    }
    return 'http://localhost:3001';
  };

  const backendUrl = getBackendUrl();

  // For live preview in the dashboard
  React.useEffect(() => {
    const script = document.createElement('script');
    // Add timestamp to bypass cache during development
    script.src = `${backendUrl}/widget.js?v=${Date.now()}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      const root = document.getElementById('caller-ai-widget-root');
      if (root) root.remove();
    };
  }, [backendUrl, entityId]);

  const htmlSnippet = `<!-- 1. Add this script to your <head> -->
<script src="${backendUrl}/widget.js"></script>

<!-- 2. Add this div where you want the widget to appear (usually at the end of <body>) -->
<div id="caller-ai" data-agent-id="${entityId}"></div>`;

  const reactSnippet = `// 1. Install the SDK (once published)
// npm install caller-ai-sdk

import { CallerWidget } from 'caller-ai-sdk';

function App() {
  return (
    <div>
      {/* ... your app */}
      <CallerWidget agentId="${entityId}" />
    </div>
  );
}`;

  const handleCopy = () => {
    const text = platform === 'html' ? htmlSnippet : reactSnippet;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight mb-2 uppercase italic font-display">Integrations</h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold">
            Embed your AI agent "{activeEntity}" into any website or application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => setPlatform('html')}
            className={`p-6 rounded-[24px] border transition-all text-left cursor-pointer ${
              platform === 'html' 
              ? 'border-white bg-[#0a0a0a] shadow-lg' 
              : 'border-white/5 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] hover:border-white/10'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
              <Globe className="text-orange-400 w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1 text-white font-display">HTML / Vanilla JS</h3>
            <p className="text-xs text-neutral-400">Works with any website (WordPress, Webflow, Shopify, etc.)</p>
          </button>

          <button 
            onClick={() => setPlatform('react')}
            className={`p-6 rounded-[24px] border transition-all text-left cursor-pointer ${
              platform === 'react' 
              ? 'border-white bg-[#0a0a0a] shadow-lg' 
              : 'border-white/5 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] hover:border-white/10'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
              <Smartphone className="text-blue-400 w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1 text-white font-display">React / Next.js</h3>
            <p className="text-xs text-neutral-400">Seamlessly integrate with your React application.</p>
          </button>
        </div>

        <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/50">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
                {platform === 'html' ? 'HTML Embed Code' : 'React Component'}
              </span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs font-bold text-white cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 overflow-x-auto bg-[#030303]">
            <pre className="text-xs font-mono text-neutral-300 bg-black p-4 rounded-xl border border-white/5 leading-relaxed overflow-x-auto">
              {platform === 'html' ? htmlSnippet : reactSnippet}
            </pre>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20">
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Pro Tip</h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
            You can customize the widget theme and initial messages directly from the <span className="underline cursor-pointer text-white">Agent Settings</span> tab. Any changes made there will automatically reflect in your embedded widget without updating the code.
          </p>
        </div>

        {/* Live Preview Trigger */}
        <div id="caller-ai" data-agent-id={entityId} style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default TabIntegrations;
