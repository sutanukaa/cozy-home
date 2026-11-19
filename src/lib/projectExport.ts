import type { Project } from '@/data/projects';
import { clarityAiDiagrams } from '@/data/clarityAiArchitecture';
import { syntactiqDiagrams } from '@/data/syntactiqArchitecture';
import { ragDiagrams } from '@/data/ragArchitecture';
import { githubEtlDiagrams } from '@/data/githubEtlArchitecture';
import { tickeaseDiagrams } from '@/data/tickeaseArchitecture';
import { bloomDiagrams } from '@/data/bloomArchitecture';
import { scrapbookDiagrams } from '@/data/scrapbookArchitecture';
import { httpServerDiagrams } from '@/data/httpServerArchitecture';

interface BlueprintSummary {
  id: number;
  title: string;
  badge: string;
  status?: string;
  interactions: string;
  failureModes: string;
  tradeOffs: string;
  mermaid: string;
}

/**
 * Resolves the architecture blueprints for a given project slug.
 */
export function getProjectBlueprints(slug: string): BlueprintSummary[] {
  switch (slug) {
    case 'clarity-ai':
      return clarityAiDiagrams;
    case 'syntactiq':
      return syntactiqDiagrams;
    case 'rag-document-qa':
      return ragDiagrams;
    case 'github-etl':
      return githubEtlDiagrams;
    case 'tickease':
      return tickeaseDiagrams;
    case 'bloom-for-youu':
      return bloomDiagrams;
    case 'a-little-scrapbook':
      return scrapbookDiagrams;
    case 'http-server':
      return httpServerDiagrams;
    default:
      return [];
  }
}

/**
 * Generates a comprehensive technical Markdown document for the project.
 */
export function generateProjectMarkdown(project: Project): string {
  const blueprints = getProjectBlueprints(project.slug);
  const now = new Date().toISOString().split('T')[0];

  const lines: string[] = [];

  // Title and metadata
  lines.push(`# ${project.title}`);
  lines.push(`> ${project.tagline}`);
  lines.push('');
  lines.push(`- **Status:** ${project.status}`);
  lines.push(`- **Exported Date:** ${now}`);
  if (project.links.code) {
    lines.push(`- **Source Code Repository:** [${project.links.code}](${project.links.code})`);
  }
  if (project.links.live) {
    lines.push(`- **Live Deployment:** [${project.links.live}](${project.links.live})`);
  }
  lines.push(`- **Core Stack:** ${project.tags.join(', ')}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // 1. Overview
  lines.push('## 1. System Overview');
  lines.push('');
  lines.push(project.overview);
  lines.push('');
  lines.push('---');
  lines.push('');

  // 2. Architecture & Pipeline
  if (project.architecture && project.architecture.length > 0) {
    lines.push('## 2. System Architecture & Pipeline');
    lines.push('');
    project.architecture.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item}`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // 3. Technical Highlights
  if (project.technicalHighlights && project.technicalHighlights.length > 0) {
    lines.push('## 3. Key Engineering Decisions & Highlights');
    lines.push('');
    project.technicalHighlights.forEach((hl) => {
      lines.push(`- ${hl}`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // 4. Core Capabilities
  if (project.keyFeatures && project.keyFeatures.length > 0) {
    lines.push('## 4. Core Capabilities');
    lines.push('');
    project.keyFeatures.forEach((feat) => {
      lines.push(`- [x] ${feat}`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // 5. Technologies
  lines.push('## 5. Technology Stack');
  lines.push('');
  project.tags.forEach((tag) => {
    lines.push(`- \`${tag}\``);
  });
  lines.push('');

  // 6. Architectural Blueprints (if any)
  if (blueprints.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## 6. Architectural Blueprints & System Specifications');
    lines.push('');
    lines.push(`This project includes ${blueprints.length} verified architectural diagrams and specification handshakes.`);
    lines.push('');

    blueprints.forEach((d) => {
      lines.push(`### Diagram 0${d.id}: ${d.title}`);
      lines.push(`- **Badge:** ${d.badge}`);
      if (d.status) {
        lines.push(`- **Status:** ${d.status}`);
      }
      lines.push('');
      lines.push('```mermaid');
      lines.push(d.mermaid);
      lines.push('```');
      lines.push('');
      lines.push('#### Interactions & Handshakes');
      lines.push(d.interactions);
      lines.push('');
      lines.push('#### Failure Modes & Resilience');
      lines.push(d.failureModes);
      lines.push('');
      lines.push('#### Production Trade-Offs');
      lines.push(d.tradeOffs);
      lines.push('');
    });
  }

  lines.push('---');
  lines.push('');
  lines.push('*Specification exported from Sutanuka Chakraborty\'s Engineering Portfolio — https://sutanukaa.is-a.dev*');

  return lines.join('\n');
}

/**
 * Generates structured JSON export including all metadata and blueprints.
 */
export function generateProjectJson(project: Project): string {
  const blueprints = getProjectBlueprints(project.slug);
  const data = {
    ...project,
    blueprints: blueprints.map((b) => ({
      id: b.id,
      title: b.title,
      badge: b.badge,
      status: b.status,
      interactions: b.interactions,
      failureModes: b.failureModes,
      tradeOffs: b.tradeOffs,
      mermaid: b.mermaid,
    })),
    exportedAt: new Date().toISOString(),
    author: {
      name: 'Sutanuka Chakraborty',
      role: 'Software Development Engineer',
      portfolio: 'https://sutanukaa.is-a.dev',
      github: 'https://github.com/sutanukaa',
    },
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Triggers a browser file download for a string payload.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies the Markdown project specification to the visitor's clipboard.
 */
export async function copyProjectMarkdown(project: Project): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  try {
    const md = generateProjectMarkdown(project);
    await navigator.clipboard.writeText(md);
    return true;
  } catch {
    return false;
  }
}
