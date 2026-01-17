import { ReactNode } from 'react'

interface NotebookPanelProps {
  children: ReactNode
  className?: string
}

/**
 * NotebookPanel - Left side wrapper for educational content
 * Provides light background with notebook styling (dot grid pattern)
 */
export default function NotebookPanel({ children, className = '' }: NotebookPanelProps) {
  return (
    <aside className={`w-[450px] lg:w-[520px] bg-white border-r border-[#e7edf3] overflow-y-auto p-8 custom-scrollbar ${className}`}>
      <div className="max-w-prose">
        {children}
      </div>
    </aside>
  )
}
