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
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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
    <div className="p-8 h-full overflow-y-auto bg-gray-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Integrations</h1>
          <p className="text-secondary text-sm">
            Embed your AI agent "{activeEntity}" into any website or application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => setPlatform('html')}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              platform === 'html' 
              ? 'border-black bg-white shadow-sm' 
              : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <Globe className="text-orange-600 w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1">HTML / Vanilla JS</h3>
            <p className="text-xs text-secondary">Works with any website (WordPress, Webflow, Shopify, etc.)</p>
          </button>

          <button 
            onClick={() => setPlatform('react')}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              platform === 'react' 
              ? 'border-black bg-white shadow-sm' 
              : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Smartphone className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="font-bold mb-1">React / Next.js</h3>
            <p className="text-xs text-secondary">Seamlessly integrate with your React application.</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                {platform === 'html' ? 'HTML Embed Code' : 'React Component'}
              </span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-border transition-all text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
              {platform === 'html' ? htmlSnippet : reactSnippet}
            </pre>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
          <h4 className="text-sm font-bold text-emerald-900 mb-2">Pro Tip</h4>
          <p className="text-xs text-emerald-700 leading-relaxed font-medium">
            You can customize the widget theme and initial messages directly from the <span className="underline cursor-pointer">Agent Settings</span> tab. Any changes made there will automatically reflect in your embedded widget without updating the code.
          </p>
        </div>

        {/* Live Preview Trigger */}
        <div id="caller-ai" data-agent-id={entityId} style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default TabIntegrations;
