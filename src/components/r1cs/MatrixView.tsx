/**
 * MatrixView - Display a single R1CS matrix (A, B, or C)
 *
 * Shows the matrix vector, witness labels, and optional dot product computation
 * 
 * Mobile: Smaller text, compact padding
 * Desktop: Full size
 */

import { motion } from 'framer-motion'
import { DotProductResult } from '../../types/r1cs'

interface MatrixViewProps {
  label: string // "A", "B", or "C"
  values: number[] // [0, 1, 0]
  witnessLabels: string[] // ["1", "x", "out"]
  witnessValues?: number[] // [1, 3, 9]
  highlighted?: number // Which index to highlight
  showDotProduct?: boolean
  dotProductResult?: DotProductResult
  color: 'purple' | 'blue' | 'green'
  visible?: boolean
}

const COLOR_SCHEMES = {
  purple: {
    border: 'border-accent-secondary',
    bg: 'bg-accent-secondary/10',
    text: 'text-accent-secondary',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  blue: {
    border: 'border-signal-processing',
    bg: 'bg-signal-processing/10',
    text: 'text-signal-processing',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  green: {
    border: 'border-signal-success',
    bg: 'bg-signal-success/10',
    text: 'text-signal-success',
    glow: 'rgba(34, 197, 94, 0.4)',
  },
}

export default function MatrixView({
  label,
  values,
  witnessLabels,
  witnessValues: _witnessValues,
  highlighted,
  showDotProduct = false,
  dotProductResult,
  color,
  visible = true,
}: MatrixViewProps) {
  const colorScheme = COLOR_SCHEMES[color]

  if (!visible) {
    return (
      <div className="bg-surface/50 border-2 border-border-subtle rounded-lg p-4 md:p-6 opacity-40">
        <div className="text-center text-text-secondary">
          <div className="text-base md:text-lg font-semibold mb-2">{label}</div>
          <div className="text-xs md:text-sm">Not yet defined</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`bg-surface border-2 ${colorScheme.border} rounded-lg p-3 md:p-6`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <div className={`text-base md:text-lg font-semibold ${colorScheme.text} mb-2 md:mb-3 text-center`}>
        {label}
      </div>

      {/* Matrix values */}
      <div className="flex justify-center gap-0.5 md:gap-1 mb-1 md:mb-2">
        <span className="text-text-secondary text-sm md:text-base">[</span>
        {values.map((value, index) => (
          <motion.div
            key={index}
            className={`px-2 md:px-3 py-1 md:py-2 rounded font-mono text-base md:text-lg font-bold transition-colors ${
              highlighted === index
                ? `${colorScheme.bg} ${colorScheme.text}`
                : 'text-text-primary'
            }`}
            animate={
              highlighted === index
                ? {
                    boxShadow: [
                      `0 0 0 0 ${colorScheme.glow}`,
                      `0 0 0 8px ${colorScheme.glow.replace('0.4', '0')}`,
                      `0 0 0 0 ${colorScheme.glow}`,
                    ],
                  }
                : {}
            }
            transition={
              highlighted === index
                ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {}
            }
          >
            {value}
            {index < values.length - 1 && <span className="text-text-secondary">,</span>}
          </motion.div>
        ))}
        <span className="text-text-secondary text-sm md:text-base">]</span>
      </div>

      {/* Witness labels */}
      <div className="flex justify-center gap-0.5 md:gap-1 mb-2 md:mb-4">
        <span className="invisible text-sm md:text-base">[</span>
        {witnessLabels.map((label, index) => (
          <div
            key={index}
            className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm text-text-secondary font-mono text-center min-w-[2rem] md:min-w-[3rem]"
          >
            {label}
          </div>
        ))}
        <span className="invisible text-sm md:text-base">]</span>
      </div>

      {/* Dot product computation */}
      {showDotProduct && dotProductResult && (
        <motion.div
          className={`mt-2 md:mt-4 pt-2 md:pt-4 border-t ${colorScheme.border}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-[10px] md:text-xs text-text-secondary mb-1 md:mb-2 text-center">Dot Product:</div>
          <div className="font-mono text-xs md:text-sm text-center">
            {dotProductResult.steps.map((step, i) => (
              <span key={i} className="text-text-primary">
                {step}
                {i < dotProductResult.steps.length - 1 && (
                  <span className="text-text-secondary"> + </span>
                )}
              </span>
            ))}
          </div>
          <div className="text-center mt-1 md:mt-2">
            <span className="text-text-secondary">= </span>
            <span className={`text-lg md:text-xl font-bold font-mono ${colorScheme.text}`}>
              {dotProductResult.result}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}