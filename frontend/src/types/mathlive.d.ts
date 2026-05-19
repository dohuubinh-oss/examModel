import * as React from 'react';
import type { MathfieldElement } from 'mathlive';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          value?: string;
          onInput?: (e: React.FormEvent<MathfieldElement>) => void;
          class?: string;
          style?: React.CSSProperties;
        },
        MathfieldElement
      >;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          value?: string;
          onInput?: (e: React.FormEvent<MathfieldElement>) => void;
          class?: string;
          style?: React.CSSProperties;
        },
        MathfieldElement
      >;
    }
  }
}
