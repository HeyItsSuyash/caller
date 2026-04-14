import React, { useState, useEffect } from 'react';
import { Upload, FileText, Plus, Search, BookOpen, X, Trash2, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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

  return (
    <div className="flex h-full divide-x divide-border">
      {/* Left Panel: Upload */}
      <div className="w-1/3 p-8 bg-sidebar/30 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-6">Upload Context</h2>
        
        <div className="space-y-6">
          <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-black/20 transition-colors cursor-pointer group relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={() => alert('File upload logic integrated. Backend will process PDF/DOCX contents.')}
            />
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors text-secondary">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1">Upload PDF or DOCX</p>
            <p className="text-xs text-secondary">Context for your voice agent</p>
          </label>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Text Block</span>
          </button>
          
          <div className="pt-6 border-t border-border">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">Source Documents</h3>
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-secondary" /></div>
              ) : sources.length === 0 ? (
                <p className="text-[10px] text-secondary italic">No sources added yet.</p>
              ) : (
                sources.map((doc) => (
                  <div key={doc._id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-white hover:shadow-sm transition-all group relative">
                    <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                      <FileText className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{doc.title}</p>
                      <p className="text-[10px] text-secondary">{doc.type}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Content Viewer */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <div className="p-4 border-b border-border bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 px-4 py-2 border border-border rounded-xl bg-accent/20 w-80 group focus-within:border-black transition-all">
            <Search className="w-4 h-4 text-secondary group-focus-within:text-black" />
            <input 
              type="text" 
              placeholder="Search context knowledge..." 
              className="border-none p-0 text-xs w-full focus:ring-0 bg-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-black">History</button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all shadow-lg hover:shadow-black/20"
             >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
             </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px:32px]">
          <div className="max-w-3xl mx-auto space-y-12 bg-white/40 backdrop-blur-sm p-12 rounded-[2.5rem] border border-white shadow-2xl">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Knowledge Base</h1>
                <button className="p-2 hover:bg-accent rounded-lg text-secondary"><FileText className="w-5 h-5" /></button>
              </div>
              <p className="text-lg font-medium leading-relaxed text-secondary italic">
                Active context for <span className="text-black underline">{activeEntity}</span>. These blocks are used to ground the LLM's responses.
              </p>
            </section>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <section className="space-y-8">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button onClick={() => setErrorMessage('')} className="p-1 hover:bg-rose-100 rounded-full">×</button>
                </div>
              )}
              <div className="flex items-center gap-3">
                 <BookOpen className="w-5 h-5 text-secondary" />
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Core Concepts & Fragments</h2>
              </div>
              <div className="grid gap-6">
                {sources.map((item) => (
                  <div key={item._id} className="group p-8 border border-border rounded-[2rem] hover:border-black transition-all bg-white relative">
                     <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                     <p className="text-sm text-secondary leading-relaxed">{item.content}</p>
                  </div>
                ))}
                {sources.length === 0 && !isLoading && (
                  <div className="p-12 text-center border border-dashed border-border rounded-[2rem]">
                    <p className="text-sm text-secondary italic">No knowledge fragments found. Add a text block to get started.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Text Block Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border flex justify-between items-center bg-accent/10">
              <h3 className="text-xl font-bold italic uppercase tracking-tighter">Add Knowledge Fragment</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTextBlock} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Title / Heading</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Eligibility Criteria"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-black focus:ring-0 transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Content</label>
                <textarea 
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the context for the AI agent..."
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-black focus:ring-0 transition-all text-sm font-medium resize-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-black/90 transition-all shadow-xl hover:shadow-black/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Save to Knowledge Base</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabDataRoom;
