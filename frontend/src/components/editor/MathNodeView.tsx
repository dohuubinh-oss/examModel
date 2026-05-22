import React from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function MathNodeView(props: NodeViewProps) {
  const { node, updateAttributes } = props
  const latex = node.attrs.latex || ''
  
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(latex, { 
        throwOnError: false,
        displayMode: false // Always render inline for text flow
      })
    } catch (e) {
      return latex
    }
  }, [latex])

  const handleClick = () => {
    const event = new CustomEvent('open-math-modal', {
      detail: {
        latex,
        onSave: (newLatex: string) => {
          updateAttributes({ latex: newLatex })
        }
      }
    });
    window.dispatchEvent(event);
  }

  React.useEffect(() => {
    if (!latex) {
      setTimeout(() => {
        handleClick();
      }, 50);
    }
  }, []);

  return (
    <NodeViewWrapper 
      as="span" 
      className="inline-block cursor-pointer hover:bg-slate-100 rounded px-1 transition-colors relative group"
      onClick={handleClick}
      title="Click để sửa công thức"
    >
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {/* Tooltip hint */}
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Click để sửa
      </span>
    </NodeViewWrapper>
  )
}
