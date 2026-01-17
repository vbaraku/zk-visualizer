import { ReactNode } from 'react'

interface CanvasPanelProps {
  children: ReactNode
  className?: string
}

/**
 * CanvasPanel - Right side wrapper for visualizations
 * Provides dark canvas background with dot grid pattern
 */
export default function CanvasPanel({ children, className = '' }: CanvasPanelProps) {
  return (
    <section className={`flex-1 flex flex-col bg-background-dark-canvas relative dark-canvas-grid ${className}`}>
      {children}
    </section>
  )
}
