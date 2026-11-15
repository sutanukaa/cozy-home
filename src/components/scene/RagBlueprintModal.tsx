'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ragDiagrams, ragConstants, type ArchitectureDiagram } from '@/data/ragArchitecture';
import MermaidRenderer from '@/components/ui/MermaidRenderer';

interface RagBlueprintModalProps {
  onClose: () => void;
}

export default function RagBlueprintModal({ onClose }: RagBlueprintModalProps) {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showConstants, setShowConstants] = useState<boolean>(false);

  const currentDiagram: ArchitectureDiagram =
    ragDiagrams.find((d) => d.id === activeTab) || ragDiagrams[0];

  return (
    <motion.div
      initial={{ scale: 0.95, y: 15, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.95, y: 15, opacity: 0 }}
      className="relative z-35 mx-auto mt-2 flex h-full max-h-[76vh] w-full max-w-6xl flex-col rounded-2xl border-2 border-pink-300/90 bg-paper/98 shadow-2xl backdrop-blur-md dark:border-white/20 dark:bg-[#25182E]/98"
    >
      {/* Retro Window Titlebar */}
      <div className="flex shrink-0 items-center justify-between border-b-2 border-pink-200/80 bg-gradient-to-r from-blush via-paper to-blush px-4 py-2 dark:border-white/10 dark:from-[#3D2947] dark:to-[#2B1B3A]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-rose/80 bg-rose" />
          <span className="h-3 w-3 rounded-full border border-butter/80 bg-butter" />
          <span className="h-3 w-3 rounded-full border border-sage/80 bg-sage" />
          <span className="ml-2 font-mono text-xs font-bold text-cocoa dark:text-pink-100">
            rag-document-qa.app - Architecture Blueprints (6 Diagrams)
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close Blueprints Window"
          className="flex h-5 w-5 items-center justify-center rounded-full border border-pink-300 bg-white font-mono text-xs font-bold text-ink hover:bg-rose hover:text-white dark:border-white/20 dark:bg-black/40 dark:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="retro-scroll flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-pink-200/60 bg-[#FFF7F9] px-3 py-2 dark:border-white/10 dark:bg-[#1E1226]">
        {ragDiagrams.map((d) => {
          const isActive = !showConstants && activeTab === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setShowConstants(false);
                setActiveTab(d.id);
              }}
              className={`shrink-0 rounded-lg px-3 py-1 font-mono text-xs font-bold transition-all ${
                isActive
                  ? 'border border-pink-300/80 bg-accent text-white shadow-xs'
                  : 'border border-pink-200/60 bg-white/70 text-cocoa hover:bg-pink-100/60 dark:border-white/10 dark:bg-white/5 dark:text-pink-200'
              }`}
            >
              {d.tabLabel}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowConstants(true)}
          className={`shrink-0 rounded-lg px-3 py-1 font-mono text-xs font-bold transition-all ${
            showConstants
              ? 'border border-pink-300/80 bg-accent text-white shadow-xs'
              : 'border border-pink-200/60 bg-white/70 text-cocoa hover:bg-pink-100/60 dark:border-white/10 dark:bg-white/5 dark:text-pink-200'
          }`}
        >
          [ Constants &amp; Contracts ]
        </button>
      </div>

      {/* Main Scrollable Content Pane */}
      <div className="retro-scroll flex flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 text-ink dark:text-white">
        {showConstants ? (
          /* System Constants & Contracts View */
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                RAG Pipeline Constants &amp; API Contracts
              </h3>
              <p className="mt-1 font-mono text-xs text-ink-soft dark:text-pink-200">
                Ground-truth constants enforced across the zero-LangChain FastAPI backend.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-pink-200/80 bg-white/60 dark:border-white/10 dark:bg-black/25">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-pink-200/80 bg-pink-100/60 text-cocoa dark:border-white/10 dark:bg-white/5 dark:text-pink-200">
                  <tr>
                    <th className="p-3 font-bold">Parameter / System Constant</th>
                    <th className="p-3 font-bold">Configured Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-200/50 dark:divide-white/10">
                  {ragConstants.map((c, i) => (
                    <tr key={i} className="hover:bg-white/40 dark:hover:bg-white/5">
                      <td className="p-3 font-semibold text-accent dark:text-pink-300">{c.name}</td>
                      <td className="p-3 text-ink/90 dark:text-white/80">{c.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* API Contracts JSON Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-bold text-accent">[ POST /ask Contract ]</span>
                <pre className="overflow-x-auto rounded-xl border border-pink-200/70 bg-white/70 p-3.5 font-mono text-[11px] text-ink dark:border-white/10 dark:bg-black/30 dark:text-pink-200">
{`// POST /ask -> 200 OK
{
  "answer": "string",
  "sources": [
    { "source": "quarterly-report.pdf", "chunk": 7 }
  ]
}`}
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-xs font-bold text-accent">[ POST /ask/stream SSE Contract ]</span>
                <pre className="overflow-x-auto rounded-xl border border-pink-200/70 bg-white/70 p-3.5 font-mono text-[11px] text-ink dark:border-white/10 dark:bg-black/30 dark:text-pink-200">
{`// POST /ask/stream -> text/event-stream
data: {"type": "sources", "sources": [{"source": "file.pdf", "chunk": 7}]}
data: {"type": "token", "text": "The"}
data: {"type": "token", "text": " net revenue..."}
data: {"type": "done"}`}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Active Diagram & Technical Deep Dive View */
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-200/60 pb-4 dark:border-white/10">
              <div>
                <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold text-accent dark:text-pink-300">
                  {currentDiagram.badge}
                </span>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
                  {currentDiagram.title}
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-ink-soft dark:text-pink-200">
                Diagram {currentDiagram.id} of 6
              </span>
            </div>

            {/* Mermaid SVG Diagram Canvas */}
            <MermaidRenderer
              code={currentDiagram.mermaid}
              diagramId={`diagram_${currentDiagram.id}`}
            />

            {/* Technical Deep Dive Breakdown */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-accent dark:text-pink-300">
                Technical Specification &amp; Engineering Analysis
              </h4>

              {/* 1. Component Interactions & Handshakes */}
              <div className="space-y-1.5 rounded-xl border border-pink-200/70 bg-white/60 p-4 font-sans text-xs sm:text-sm leading-relaxed dark:border-white/10 dark:bg-black/25">
                <span className="font-mono text-xs font-bold text-accent dark:text-pink-300">
                  01 | Component Interactions &amp; Protocol Handshakes
                </span>
                <p className="mt-1 text-ink/90 dark:text-white/85">
                  {currentDiagram.interactions}
                </p>
              </div>

              {/* 2. Failure Modes & Invariant Protections */}
              <div className="space-y-1.5 rounded-xl border border-pink-200/70 bg-white/60 p-4 font-sans text-xs sm:text-sm leading-relaxed dark:border-white/10 dark:bg-black/25">
                <span className="font-mono text-xs font-bold text-accent dark:text-pink-300">
                  02 | Failure Modes, Timeouts &amp; Invariant Protections
                </span>
                <p className="mt-1 text-ink/90 dark:text-white/85">
                  {currentDiagram.failureModes}
                </p>
              </div>

              {/* 3. Production Architectural Trade-Offs */}
              <div className="space-y-1.5 rounded-xl border border-pink-200/70 bg-white/60 p-4 font-sans text-xs sm:text-sm leading-relaxed dark:border-white/10 dark:bg-black/25">
                <span className="font-mono text-xs font-bold text-accent dark:text-pink-300">
                  03 | Production Architectural Trade-Offs &amp; Scaling Path
                </span>
                <p className="mt-1 text-ink/90 dark:text-white/85">
                  {currentDiagram.tradeOffs}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
