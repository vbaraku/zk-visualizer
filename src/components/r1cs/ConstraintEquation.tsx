/**
 * ConstraintEquation - Display the full R1CS equation
 *
 * Shows: (A·w) × (B·w) = (C·w)
 * With optional result values and final verification check
 */

import { motion } from 'framer-motion'

interface ConstraintEquationProps {
  aResult?: number
  bResult?: number
  cResult?: number
  showCheck?: boolean
}

export default function ConstraintEquation({
  aResult,
  bResult,
  cResult,
  showCheck = false,
}: ConstraintEquationProps) {
  // Calculate left side and check if equation holds
  const leftSide = aResult !== undefined && bResult !== undefined ? aResult * bResult : undefined
  const isValid = leftSide !== undefined && cResult !== undefined && leftSide === cResult

  return (
    <motion.div
      className="bg-surface border-2 border-border-subtle rounded-lg p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-lg font-semibold text-text-primary">
          R1CS Constraint Equation
        </span>
      </div>

      {/* Main equation */}
      <div className="flex items-center justify-center gap-4 text-2xl font-mono flex-wrap">
        {/* (A·w) */}
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">(</span>
          <span className="text-accent-secondary font-bold">A</span>
          <span className="text-text-secondary">·</span>
          <span className="text-accent-primary font-bold">w</span>
          <span className="text-text-secondary">)</span>
        </div>

        {/* × */}
        <span className="text-text-primary font-bold">×</span>

        {/* (B·w) */}
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">(</span>
          <span className="text-signal-processing font-bold">B</span>
          <span className="text-text-secondary">·</span>
          <span className="text-accent-primary font-bold">w</span>
          <span className="text-text-secondary">)</span>
        </div>

        {/* = */}
        <span className="text-text-primary font-bold">=</span>

        {/* (C·w) */}
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">(</span>
          <span className="text-signal-success font-bold">C</span>
          <span className="text-text-secondary">·</span>
          <span className="text-accent-primary font-bold">w</span>
          <span className="text-text-secondary">)</span>
        </div>
      </div>

      {/* Results with actual values */}
      {(aResult !== undefined || bResult !== undefined || cResult !== undefined) && (
        <motion.div
          className="mt-6 pt-6 border-t border-border-subtle"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-4 text-xl font-mono flex-wrap">
            {/* A·w result */}
            <motion.div
              className="px-4 py-2 rounded bg-accent-secondary/10 border-2 border-accent-secondary/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-accent-secondary font-bold">
                {aResult !== undefined ? aResult : '?'}
              </span>
            </motion.div>

            <span className="text-text-primary font-bold">×</span>

            {/* B·w result */}
            <motion.div
              className="px-4 py-2 rounded bg-signal-processing/10 border-2 border-signal-processing/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-signal-processing font-bold">
                {bResult !== undefined ? bResult : '?'}
              </span>
            </motion.div>

            <span className="text-text-primary font-bold">=</span>

            {/* C·w result */}
            <motion.div
              className="px-4 py-2 rounded bg-signal-success/10 border-2 border-signal-success/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-signal-success font-bold">
                {cResult !== undefined ? cResult : '?'}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Final check */}
      {showCheck && leftSide !== undefined && cResult !== undefined && (
        <motion.div
          className="mt-6 pt-6 border-t border-border-subtle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3 text-lg font-mono">
            <span className="text-text-secondary">Check:</span>
            <span className="text-text-primary font-bold">{leftSide}</span>
            <span className="text-text-secondary">=</span>
            <span className="text-text-primary font-bold">{cResult}</span>

            {/* Check mark or X */}
            <motion.div
              className={`ml-4 px-4 py-2 rounded-full font-bold text-xl ${
                isValid
                  ? 'bg-signal-success/20 text-signal-success border-2 border-signal-success'
                  : 'bg-signal-error/20 text-signal-error border-2 border-signal-error'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.5,
              }}
            >
              {isValid ? '✓' : '✗'}
            </motion.div>
          </div>

          {isValid ? (
            <div className="text-center mt-3 text-signal-success font-semibold">
              Constraint satisfied!
            </div>
          ) : (
            <div className="text-center mt-3 text-signal-error font-semibold">
              Constraint violated!
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
