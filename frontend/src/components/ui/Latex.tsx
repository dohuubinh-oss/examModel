'use client';

import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProps {
  text?: string;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({ text = '', className = '' }) => {
  if (!text) return null;

  // Process text to render LaTeX math formulas offline
  const renderMath = (rawText: string): string => {
    // 1. Process block math $$ ... $$
    let processed = rawText.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch (e) {
        console.error('KaTeX block error:', e);
        return match;
      }
    });

    // 2. Process inline math $ ... $
    processed = processed.replace(/\$(.*?)\$/g, (match, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch (e) {
        console.error('KaTeX inline error:', e);
        return match;
      }
    });

    return processed;
  };

  const renderedContent = renderMath(text);

  return (
    <span 
      className={`latex-container inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};
