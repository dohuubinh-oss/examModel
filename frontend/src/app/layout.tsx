import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ExamModel | Professional Assessment Engine',
  description: 'Editorial Scholarship focused examination management system.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
