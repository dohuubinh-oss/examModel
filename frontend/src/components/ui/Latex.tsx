'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    katex?: any;
    renderMathInElement?: any;
  }
}

interface LatexProps {
  text?: string;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({ text = '', className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (window.katex && window.renderMathInElement) {
      setIsLoaded(true);
      return;
    }

    const cssId = 'katex-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);
    }

    const scriptId = 'katex-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      script.async = true;
      script.onload = () => {
        checkAndLoadAutoRender();
      };
      document.head.appendChild(script);
    } else {
      checkAndLoadAutoRender();
    }

    function checkAndLoadAutoRender() {
      const interval = setInterval(() => {
        if (window.katex) {
          clearInterval(interval);
          
          const autoId = 'katex-auto-render';
          if (!document.getElementById(autoId)) {
            const autoScript = document.createElement('script');
            autoScript.id = autoId;
            autoScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
            autoScript.async = true;
            autoScript.onload = () => {
              setIsLoaded(true);
            };
            document.head.appendChild(autoScript);
          } else {
            const autoInterval = setInterval(() => {
              if (window.renderMathInElement) {
                clearInterval(autoInterval);
                setIsLoaded(true);
              }
            }, 50);
          }
        }
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.renderMathInElement) {
      try {
        window.renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }
    }
  }, [isLoaded, text]);

  return (
    <span 
      ref={containerRef} 
      className={`latex-container inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
