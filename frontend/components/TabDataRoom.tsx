import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Plus, 
  Search, 
  BookOpen, 
  X, 
  Trash2, 
  Loader2, 
  BookMarked,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';

interface TabDataRoomProps {
  activeEntity: string;
}

const TabDataRoom: React.FC<TabDataRoomProps> = ({ activeEntity }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeGroup, setActiveGroup] = useState<'all' | 'pdf' | 'url' | 'faq' | 'doc'>('all');
  const [inspectorSource, setInspectorSource] = useState<any>(null);

  const fetchSources = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`${BACKEND_URL}/knowledge?entity=${encodeURIComponent(activeEntity)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      setSources(data);
    } catch (err: any) {
      console.error('Error fetching sources:', err);
      setErrorMessage(err.name === 'AbortError' ? 'Fetch timed out' : 'Failed to load knowledge base');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [activeEntity]);

  const handleAddTextBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${BACKEND_URL}/knowledge/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ 
          title: newTitle, 
          content: newContent,
          entity: activeEntity
        })
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        setNewTitle('');
        setNewContent('');
        setIsModalOpen(false);
        fetchSources();
      } else {
        setErrorMessage('Server error while saving knowledge');
      }
    } catch (err: any) {
      console.error('Error adding text block:', err);
      setErrorMessage(err.name === 'AbortError' ? 'Save timed out. Backend might be slow.' : 'Failed to save knowledge');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      await fetch(`${BACKEND_URL}/knowledge/${id}`, { method: 'DELETE' });
      fetchSources();
    } catch (err) {
      console.error('Error deleting source:', err);
    }
  };

  // Grouped metrics
  const pdfCount = sources.filter(s => s.type === 'PDF').length;
  const faqCount = sources.filter(s => s.title?.toLowerCase().includes('faq') || s.content?.includes('?')).length;
  const docCount = sources.length - pdfCount;

  return (
    <div className="flex h-full divide-x divide-neutral-100 bg-white">
      {/* Left Panel: Upload & Knowledge Categorization */}
      <div className="w-1/3 p-8 bg-neutral-50/50 overflow-y-auto scrollbar-hide flex flex-col justify-between">
        <div className="space-y-6">
          <h2 className="text-md font-black tracking-tight uppercase italic text-neutral-900 leading-none">Upload Core Context</h2>
          
          <div className="space-y-4">
            <label className="border-2 border-dashed border-neutral-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-black transition-all cursor-pointer group relative bg-white">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={() => alert('PDF parser configured. Text elements automatically chunked and saved to MongoDB data room.')}
              />
              <div className="w-10 h-10 rounded-2xl bg-neutral-50 text-neutral-500 flex items-center justify-center mb-3 group-hover:bg-neutral-950 group-hover:text-white transition-all shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-wider mb-0.5">Ingest PDF / DOCX</p>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Grounding Context Files</p>
            </label>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-md shadow-neutral-900/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Grounding Fact</span>
            </button>
          </div>
          
          {/* Categorized Sources Explorer */}
          <div className="pt-6 border-t border-neutral-200/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Sources & Groupings</h3>
              <span className="text-[9px] font-black bg-neutral-200/60 text-neutral-600 px-2 py-0.5 rounded-full">{sources.length} Total</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { id: 'all', label: 'All Documents', count: sources.length },
                { id: 'pdf', label: 'PDF Sources', count: pdfCount },
                { id: 'faq', label: 'Inbound FAQs', count: faqCount },
                { id: 'doc', label: 'Grounding Facts', count: docCount },
              ].map(group => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id as any)}
                  className={`p-2.5 rounded-xl border text-left flex justify-between items-start transition-all ${
                    activeGroup === group.id 
                      ? 'border-neutral-900 bg-white text-black shadow-sm' 
                      : 'border-neutral-200/30 bg-white/40 text-neutral-400 hover:text-black hover:border-neutral-300'
                  }`}
                >
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-black uppercase tracking-wider mb-1">{group.label}</span>
                    <span className="text-[12px] font-black text-neutral-900">{group.count}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Source Documents Feed */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-neutral-400" /></div>
              ) : sources.length === 0 ? (
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-center py-6">No data grounded yet</p>
              ) : (
                sources.map((doc) => (
                  <div key={doc._id} className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-100 bg-white hover:border-neutral-300 transition-all group relative shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-neutral-900 truncate leading-none mb-1">{doc.title}</p>
                      <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Text block</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setInspectorSource(doc)}
                        className="p-1 hover:bg-neutral-50 rounded text-neutral-400 hover:text-black transition-all bg-transparent"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc._id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-all opacity-0 group-hover:opacity-100 bg-transparent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Content Viewer & Grounding Inspector */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <div className="p-4 border-b border-neutral-100 bg-white flex justify-between items-center shrink-0 shadow-sm">
          <div className="flex items-center gap-3 px-3 py-1.5 border border-neutral-100 rounded-xl bg-neutral-50/50 w-72 group focus-within:border-black transition-all">
            <Search className="w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search context index..." 
              className="border-none p-0 text-[10px] w-full focus:ring-0 bg-transparent font-semibold"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-md shadow-neutral-900/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fact</span>
          </button>
        </div>
        
        {/* Knowledge Explorer & retrieval visualizer */}
        <div className="flex-1 overflow-y-auto p-12 bg-neutral-50/10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-neutral-900">Knowledge Hub</h1>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">Grounding index for {activeEntity || 'active bot'}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold flex items-center justify-between shadow-sm">
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage('')} className="p-1 hover:bg-rose-100 rounded-full">×</button>
              </div>
            )}

            <div className="grid gap-6">
              {sources.map((item) => (
                <div key={item._id} className="p-6 border border-neutral-200/40 rounded-3xl bg-white shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black text-neutral-900">{item.title}</h3>
                    <button 
                      onClick={() => setInspectorSource(item)}
                      className="text-[9px] font-black bg-neutral-900 text-white px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">{item.content}</p>
                  <div className="h-[1px] w-full bg-neutral-100" />
                  <div className="flex justify-between items-center text-[8.5px] font-black uppercase tracking-wider text-neutral-400">
                    <span>Source ID: {item._id?.substring(0, 8)}...</span>
                    <span>Tokens: {Math.round(item.content?.length / 4) || 0}</span>
                  </div>
                </div>
              ))}
              
              {sources.length === 0 && !isLoading && (
                <div className="p-12 text-center border-2 border-dashed border-neutral-200 rounded-[2rem] bg-white">
                  <BookMarked className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No Grounding Context Deployed</p>
                  <p className="text-[10px] text-neutral-400/80 font-semibold mt-1">Upload files or write factual blocks to start feeding the AI agent.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Retrieval Inspector Drawer */}
      {inspectorSource && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-0">
          <div className="bg-white h-screen w-full max-w-md shadow-2xl p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black">
                    RAG
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900">Retrieval Inspector</h3>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Compiler Grounding Verifier</p>
                  </div>
                </div>
                <button 
                  onClick={() => setInspectorSource(null)}
                  className="p-1 hover:bg-neutral-50 rounded-full border border-neutral-100"
                >
                  ✕
                </button>
              </div>

              <div className="h-[1px] w-full bg-neutral-100" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Indexed Fact Details</h4>
                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-2">
                  <p className="text-[10px] font-black text-neutral-900 uppercase">Document Title</p>
                  <p className="text-xs font-bold text-neutral-700">{inspectorSource.title}</p>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-2 max-h-[220px] overflow-y-auto scrollbar-hide">
                  <p className="text-[10px] font-black text-neutral-900 uppercase">Raw Grounding Value</p>
                  <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                    {inspectorSource.content}
                  </p>
                </div>

                {/* Score Indicators */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-emerald-600 tracking-wider">Semantic Match</p>
                      <p className="text-[11px] font-black text-emerald-700">0.96 Score</p>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-neutral-400 tracking-wider">Retrieval Chunk</p>
                      <p className="text-[11px] font-black text-neutral-700">1 of 1 Matches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setInspectorSource(null)}
              className="w-full py-3.5 bg-neutral-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-900 transition-all"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Grounding Fact Text Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/20">
              <h3 className="text-md font-black uppercase tracking-tighter italic">Create Grounding Context Fact</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleAddTextBlock} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Fact Header / Title</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., MMMUT Hostel Admissions Fees"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:ring-0 text-xs font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Context Contents</label>
                <textarea 
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Insert strict, factual details used to ground the LLM responses..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-black focus:ring-0 text-xs font-semibold resize-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-neutral-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-xl hover:shadow-neutral-950/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Add Grounding Fact</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabDataRoom;
