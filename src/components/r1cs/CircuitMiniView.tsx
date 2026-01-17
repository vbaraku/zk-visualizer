/**
 * CircuitMiniView - Simplified static circuit view for side-by-side display
 *
 * Shows a simplified representation of the circuit: [x] --→ [×] --→ [out]
 * Highlights nodes based on current computation step
 */

import { motion } from 'framer-motion'

interface CircuitMiniViewProps {
  highlightedNodes?: string[]
}

export default function CircuitMiniView({ highlightedNodes = [] }: CircuitMiniViewProps) {
  const isHighlighted = (nodeName: string) => highlightedNodes.includes(nodeName)

  // Color schemes for different node types
  const getNodeStyle = (nodeName: string) => {
    const highlighted = isHighlighted(nodeName)

    switch (nodeName) {
      case 'x':
        return {
          border: highlighted ? 'border-signal-private' : 'border-border-subtle',
          bg: highlighted ? 'bg-signal-private/20' : 'bg-surface',
          text: highlighted ? 'text-signal-private' : 'text-text-secondary',
          glow: highlighted ? 'rgba(251, 191, 36, 0.4)' : undefined,
        }
      case 'gate':
        return {
          border: highlighted ? 'border-signal-processing' : 'border-border-subtle',
          bg: highlighted ? 'bg-signal-processing/20' : 'bg-surface',
          text: highlighted ? 'text-signal-processing' : 'text-text-secondary',
          glow: highlighted ? 'rgba(59, 130, 246, 0.4)' : undefined,
        }
      case 'out':
        return {
          border: highlighted ? 'border-signal-success' : 'border-border-subtle',
          bg: highlighted ? 'bg-signal-success/20' : 'bg-surface',
          text: highlighted ? 'text-signal-success' : 'text-text-secondary',
          glow: highlighted ? 'rgba(34, 197, 94, 0.4)' : undefined,
        }
      default:
        return {
          border: 'border-border-subtle',
          bg: 'bg-surface',
          text: 'text-text-secondary',
        }
    }
  }

  const renderNode = (nodeName: string, label: string) => {
    const style = getNodeStyle(nodeName)

    return (
      <motion.div
        className={`${style.bg} border-2 ${style.border} rounded-lg px-6 py-4 min-w-[80px] flex items-center justify-center`}
        animate={
          style.glow
            ? {
                boxShadow: [
                  `0 0 0 0 ${style.glow}`,
                  `0 0 0 8px ${style.glow.replace('0.4', '0')}`,
                  `0 0 0 0 ${style.glow}`,
                ],
              }
            : {}
        }
        transition={
          style.glow
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        <span className={`text-xl font-bold font-mono ${style.text}`}>{label}</span>
      </motion.div>
    )
  }

  const renderArrow = () => (
    <div className="flex items-center px-3">
      <svg
        width="40"
        height="20"
        viewBox="0 0 40 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 10 L30 10 M30 10 L25 5 M30 10 L25 15"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )

  return (
    <motion.div
      className="bg-surface border-2 border-border-subtle rounded-lg p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-lg font-semibold text-text-primary">Circuit View</span>
      </div>

      {/* Circuit flow */}
      <div className="flex items-center justify-center">
        {/* Input: x */}
        {renderNode('x', 'x')}

        {/* Arrow */}
        {renderArrow()}

        {/* Gate: × */}
        {renderNode('gate', '×')}

        {/* Arrow */}
        {renderArrow()}

        {/* Output: out */}
        {renderNode('out', 'out')}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-center gap-6 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-private/20 border border-signal-private rounded" />
            <span>Input</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-processing/20 border border-signal-processing rounded" />
            <span>Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-success/20 border border-signal-success rounded" />
            <span>Output</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
