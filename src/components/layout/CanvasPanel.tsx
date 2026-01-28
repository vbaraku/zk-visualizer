import { ReactNode } from 'react'

interface CanvasPanelProps {
  children: ReactNode
  className?: string
}

/**
 * CanvasPanel - Right side wrapper for visualizations
 * Provides dark canvas background with dot grid pattern
 * 
 * Mobile: Full width with minimum height
 * Desktop: Flex to fill remaining space
 * 
 * Structure: flex container that doesn't scroll itself.
 * Children should handle their own scrolling if needed.
 */
export default function CanvasPanel({ children, className = '' }: CanvasPanelProps) {
  return (
    <section className={`flex-1 flex flex-col min-h-[60vh] md:min-h-0 bg-background-dark-canvas relative dark-canvas-grid overflow-hidden ${className}`}>
      {children}
    </section>
  )
}