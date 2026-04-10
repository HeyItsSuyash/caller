import React from 'react';
import { Upload, FileText, Plus, Search, BookOpen } from 'lucide-react';

const TabDataRoom = () => {
  return (
    <div className="flex h-full divide-x divide-border">
      {/* Left Panel: Upload */}
      <div className="w-1/3 p-8 bg-sidebar/30 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-6">Upload Context</h2>
        
        <div className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-black/20 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors text-secondary">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1">Upload PDF or DOCX</p>
            <p className="text-xs text-secondary">Context for your voice agent</p>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Text Block</span>
          </button>
          
          <div className="pt-6 border-t border-border">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">Source Documents</h3>
            <div className="space-y-2">
              {[
                { name: 'Knowledge_Base_v1.pdf', type: 'PDF' },
                { name: 'FAQ_Data.docx', type: 'DOCX' },
                { name: 'Product_Catalog.pdf', type: 'PDF' },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-white hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{doc.name}</p>
                    <p className="text-[10px] text-secondary">{doc.type}</p>
                  </div>
                </div>
              ))}
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
             <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 transition-all shadow-lg hover:shadow-black/20">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
             </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px:32px]">
          <div className="max-w-3xl mx-auto space-y-12 bg-white/40 backdrop-blur-sm p-12 rounded-[2.5rem] border border-white shadow-2xl">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Main Knowledge Base</h1>
                <button className="p-2 hover:bg-accent rounded-lg text-secondary"><FileText className="w-5 h-5" /></button>
              </div>
              <p className="text-lg font-medium leading-relaxed text-secondary italic">
                "This document serves as the primary source of truth for the Admission Bot agent. 
                It contains details about admission procedures, fee structures, and campus life."
              </p>
            </section>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <section className="space-y-8">
              <div className="flex items-center gap-3">
                 <BookOpen className="w-5 h-5 text-secondary" />
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Core Concepts</h2>
              </div>
              <div className="grid gap-6">
                {[
                  { title: "Eligibility Criteria", content: "Minimum 60% in high school (10+2) or equivalent. Valid score in relevant entrance examination. Personal interview performance." },
                  { title: "Fee Structure", content: "Annual tuition for B.Tech CS is ₹2.5L. Scholarship available for 90%+ scores (up to 50% waiver)." }
                ].map((item, idx) => (
                  <div key={idx} className="group p-8 border border-border rounded-[2rem] hover:border-black transition-all bg-white relative">
                     <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                     <p className="text-sm text-secondary leading-relaxed">{item.content}</p>
                     <button className="absolute top-8 right-8 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent rounded text-[10px] font-bold uppercase tracking-widest">Edit</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabDataRoom;
