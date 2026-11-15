'use client';

import { useEffect, useState, useRef } from 'react';
import { deflate } from 'pako';
import { fromUint8Array } from 'js-base64';

interface MermaidRendererProps {
  code: string;
  diagramId: string;
  className?: string;
}

/**
 * Generate a valid, compressed URL for the Mermaid Live Editor.
 * Mermaid Live expects state in the hash: `#pako:<url-safe-base64-deflated-json>`.
 */
export function getMermaidLiveUrl(code: string): string {
  try {
    const state = {
      code,
      mermaid: JSON.stringify({ theme: 'default' }),
      autoSync: true,
      updateDiagram: true,
    };
    const jsonStr = JSON.stringify(state);
    const data = new TextEncoder().encode(jsonStr);
    const compressed = deflate(data, { level: 9 });
    const serialized = fromUint8Array(compressed, true);
    return `https://mermaid.live/edit#pako:${serialized}`;
  } catch (err) {
    console.error('Failed to encode diagram for mermaid.live:', err);
    return 'https://mermaid.live';
  }
}

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    };
  }
}

export default function MermaidRenderer({
  code,
  diagramId,
  className = '',
}: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadAndRender() {
      try {
        if (!window.mermaid) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById('mermaid-cdn-script');
            if (existingScript) {
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', () =>
                reject(new Error('Failed to load Mermaid from CDN'))
              );
              return;
            }

            const script = document.createElement('script');
            script.id = 'mermaid-cdn-script';
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Mermaid CDN script'));
            document.head.appendChild(script);
          });
        }

        if (!window.mermaid) {
          throw new Error('Mermaid is not available in window');
        }

        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
        });

        // Clean unique ID without special chars
        const renderId = `mermaid_${diagramId}_${Date.now()}`;
        const { svg: renderedSvg } = await window.mermaid.render(renderId, code);

        if (isMounted) {
          setSvg(renderedSvg);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Mermaid rendering fallback:', err);
          setError(err instanceof Error ? err.message : 'Rendering error');
          setLoading(false);
        }
      }
    }

    loadAndRender();

    return () => {
      isMounted = false;
    };
  }, [code, diagramId]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInMermaidLive = () => {
    const url = getMermaidLiveUrl(code);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative flex flex-col rounded-xl border border-pink-200/80 bg-white/70 shadow-inner dark:border-white/10 dark:bg-black/30 ${className}`}>
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-200/60 bg-paper/90 px-3 py-1.5 font-mono text-[11px] dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-1.5 text-cocoa dark:text-pink-200">
          <span className="font-bold">[ Vector Diagram ]</span>
          <span className="opacity-60">·</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="flex h-5 w-5 items-center justify-center rounded border border-pink-200 bg-white font-bold text-ink hover:bg-pink-100 active:scale-95 dark:border-white/20 dark:bg-white/10 dark:text-white"
            title="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="rounded border border-pink-200 bg-white px-1.5 py-0.2 text-[10px] font-bold text-ink hover:bg-pink-100 active:scale-95 dark:border-white/20 dark:bg-white/10 dark:text-white"
            title="Reset Zoom"
          >
            100%
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="flex h-5 w-5 items-center justify-center rounded border border-pink-200 bg-white font-bold text-ink hover:bg-pink-100 active:scale-95 dark:border-white/20 dark:bg-white/10 dark:text-white"
            title="Zoom in"
          >
            +
          </button>

          <span className="opacity-40">|</span>

          {/* Copy Button */}
          <button
            type="button"
            onClick={copyCode}
            className="rounded border border-pink-200 bg-white px-2 py-0.5 text-[10px] font-bold text-accent transition-colors hover:bg-rose hover:text-white active:scale-95 dark:border-white/20 dark:bg-white/10 dark:text-pink-200"
          >
            {copied ? '[ Copied! ]' : '[ Copy Code ]'}
          </button>

          {/* External mermaid.live */}
          <a
            href={getMermaidLiveUrl(code)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded border border-pink-200 bg-white px-2 py-0.5 text-[10px] font-bold text-ink-soft transition-colors hover:bg-pink-100 sm:inline active:scale-95 dark:border-white/20 dark:bg-white/10 dark:text-white/80"
          >
            [ mermaid.live ↗ ]
          </a>
        </div>
      </div>

      {/* Diagram Canvas Body */}
      <div
        ref={containerRef}
        className="retro-scroll relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-x-auto p-4 sm:p-6 transition-all"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2 font-mono text-xs text-ink-soft dark:text-pink-200">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span>Compiling Mermaid Vector Diagram...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 p-4 text-center font-mono text-xs">
            <span className="text-rose font-bold">Vector preview unavailable</span>
            <p className="max-w-md text-[11px] text-ink-soft dark:text-white/70">
              CDN compilation fallback active. You can copy the raw Mermaid block or open directly in mermaid.live:
            </p>
            <pre className="max-h-48 max-w-full overflow-auto rounded bg-black/5 p-3 text-left text-[10px] text-cocoa dark:bg-black/40 dark:text-pink-200">
              {code}
            </pre>
            <a
              href={getMermaidLiveUrl(code)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-4 py-1.5 font-bold text-white hover:bg-rose active:scale-95"
            >
              [ Open in mermaid.live ↗ ]
            </a>
          </div>
        )}

        {!loading && !error && svg && (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="flex w-full min-w-full justify-center py-2 [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </div>
  );
}
