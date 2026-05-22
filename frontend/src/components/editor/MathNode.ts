import { Node, mergeAttributes, nodeInputRule, nodePasteRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MathNodeView from './MathNodeView'

export interface MathNodeOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    math: {
      insertMath: (latex: string) => ReturnType
    }
  }
}

// Bắt $...$ hoặc $$...$$
const MATH_INPUT_REGEX = /\$\$?([^$]*)\$\$?$/
const MATH_PASTE_REGEX = /\$\$?([^$]*)\$\$?/g

export const MathNode = Node.create<MathNodeOptions>({
  name: 'math',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math"]',
        getAttrs: element => {
          return {
            latex: element.getAttribute('data-latex') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'math', 'data-latex': HTMLAttributes.latex })]
  },

  renderText({ node }) {
    return `$${node.attrs.latex}$`
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView)
  },

  addCommands() {
    return {
      insertMath: (latex: string) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { latex },
        })
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: MATH_INPUT_REGEX,
        type: this.type,
        getAttributes: match => {
          return {
            latex: match[1],
          }
        },
      }),
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: MATH_PASTE_REGEX,
        type: this.type,
        getAttributes: match => {
          return {
            latex: match[1],
          }
        },
      }),
    ]
  },
})
