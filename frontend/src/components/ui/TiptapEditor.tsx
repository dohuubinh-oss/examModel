import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { MathNode } from '../editor/MathNode'
import { cn } from '@/lib/utils'

function textToHtmlWithMath(text: string) {
  if (!text) return ''
  const html = text.replace(/\$\$?([^$]+)\$\$?/g, (match, latex) => {
    const encoded = latex.replace(/"/g, '&quot;')
    return `<span data-type="math" data-latex="${encoded}"></span>`
  })
  
  return html.split('\n').map(line => `<p>${line}</p>`).join('')
}

interface TiptapEditorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({ value, onValueChange, placeholder = "Nhập nội dung...", className }: TiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      MathNode,
    ],
    content: textToHtmlWithMath(value || ''),
    onUpdate: ({ editor }) => {
      if (onValueChange) {
        onValueChange(editor.getText({ blockSeparator: '\n' }))
      }
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[100px] text-sm leading-relaxed custom-scrollbar"
      }
    }
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentText = editor.getText({ blockSeparator: '\n' })
      if (currentText !== value) {
        // Prevent cursor jump by preserving selection if we are focused
        const { from, to } = editor.state.selection
        editor.commands.setContent(textToHtmlWithMath(value))
        try {
          editor.commands.setTextSelection({ from, to })
        } catch (e) {
          // ignore if out of bounds
        }
      }
    }
  }, [value, editor])

  if (!isMounted) return null

  return (
    <div className={cn(
      "relative w-full flex flex-col bg-slate-50/30 p-5 rounded-xl border border-slate-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-200",
      className
    )}>
      <EditorContent editor={editor} className="flex-grow" />
    </div>
  )
}
