import { ReactNode } from 'react'

interface NotebookPanelProps {
  children: ReactNode
  className?: string
}

/**
 * NotebookPanel - Left side wrapper for educational content
 * Provides light background with notebook styling (dot grid pattern)
 * 
 * Mobile: Full width, scrollable
 * Desktop: Fixed width sidebar
 */
export default function NotebookPanel({ children, className = '' }: NotebookPanelProps) {
  return (
    <aside className={`w-full md:w-[450px] lg:w-[520px] flex-shrink-0 bg-white md:border-r border-[#e7edf3] overflow-y-auto p-6 md:p-8 custom-scrollbar ${className}`}>
      <div className="max-w-prose mx-auto md:mx-0">
        {children}
      </div>
    </aside>
  )
}