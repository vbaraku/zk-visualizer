/**
 * WitnessVector - Display witness vector with labels and values
 *
 * Shows the witness vector in horizontal layout with labels above values
 * Supports highlighting specific indices with animation
 */

import { motion } from 'framer-motion'

interface WitnessVectorProps {
  labels: string[]
  values: number[]
  highlighted?: number
}

export default function WitnessVector({
  labels,
  values,
  highlighted,
}: WitnessVectorProps) {
  return (
    <motion.div
      className="bg-surface border-2 border-border-subtle rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-text-primary">
          Witness Vector
        </span>
      </div>

      {/* Vector display: w = [...] */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl font-semibold text-accent-primary font-mono">
          w =
        </span>

        {/* Opening bracket */}
        <span className="text-3xl text-text-secondary font-mono">[</span>

        {/* Labels row */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            {labels.map((label, index) => (
              <motion.div
                key={`label-${index}`}
                className={`px-4 py-1 text-sm font-mono text-center min-w-[4rem] transition-colors ${
                  highlighted === index
                    ? 'text-accent-primary font-bold'
                    : 'text-text-secondary'
                }`}
              >
                {label}
              </motion.div>
            ))}
          </div>

          {/* Values row */}
          <div className="flex gap-3">
            {values.map((value, index) => (
              <motion.div
                key={`value-${index}`}
                className={`px-4 py-2 rounded font-mono text-lg font-bold text-center min-w-[4rem] transition-colors ${
                  highlighted === index
                    ? 'bg-accent-primary/20 text-accent-primary border-2 border-accent-primary'
                    : 'text-text-primary border-2 border-transparent'
                }`}
                animate={
                  highlighted === index
                    ? {
                        boxShadow: [
                          '0 0 0 0 rgba(99, 102, 241, 0.4)',
                          '0 0 0 8px rgba(99, 102, 241, 0)',
                          '0 0 0 0 rgba(99, 102, 241, 0.4)',
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing bracket */}
        <span className="text-3xl text-text-secondary font-mono">]</span>
      </div>
    </motion.div>
  )
}
