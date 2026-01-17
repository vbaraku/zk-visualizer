import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { NodeState } from '../../../types/animation'

/**
 * OutputNode - Represents an output signal (public)
 *
 * Visual characteristics:
 * - Green border for correct/public outputs
 * - Red border if validation fails
 * - Dark background matching design system
 * - Shows output value and expected value
 * - Animated states: idle (dimmed with "?"), receiving (pulsing glow), complete (solid)
 */

interface OutputNodeData {
  label: string
  value: number | string
  expectedValue?: number | string
  description?: string
  nodeState?: NodeState
}

interface OutputNodeProps {
  data: OutputNodeData
}

function OutputNode({ data }: OutputNodeProps) {
  const isCorrect =
    data.expectedValue === undefined || data.value === data.expectedValue
  const nodeState = data.nodeState || 'complete'

  // Determine styling based on node state
  const isIdle = nodeState === 'idle'
  const isReceiving = nodeState === 'receiving'
  const isComplete = nodeState === 'complete'

  // Opacity based on state
  const opacity = isIdle ? 0.4 : 1

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`bg-surface border-2 ${
          isCorrect ? 'border-signal-success' : 'border-signal-error'
        } rounded-lg px-6 py-4 min-w-[140px] shadow-lg`}
        style={{ opacity }}
        animate={
          isReceiving && isCorrect
            ? {
                boxShadow: [
                  '0 0 0 0 rgba(34, 197, 94, 0.4)',
                  '0 0 0 10px rgba(34, 197, 94, 0)',
                  '0 0 0 0 rgba(34, 197, 94, 0.4)',
                ],
              }
            : {}
        }
        transition={
          isReceiving && isCorrect
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        {/* Label */}
        <div
          className={`text-xs font-semibold mb-1 ${
            isCorrect ? 'text-signal-success' : 'text-signal-error'
          }`}
        >
          {data.label}
        </div>

        {/* Value */}
        <motion.div
          className="text-2xl font-mono font-bold text-text-primary"
          initial={false}
          animate={isReceiving || isComplete ? { scale: [0.8, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isIdle ? '?' : data.value}
        </motion.div>

        {/* Expected value */}
        {data.expectedValue !== undefined && (
          <div className="text-xs text-text-secondary mt-1">
            Target: {data.expectedValue}
          </div>
        )}

        {/* Description */}
        {data.description && (
          <div className="text-xs text-text-secondary mt-1">{data.description}</div>
        )}
      </motion.div>

      {/* Badge */}
      <div
        className={`absolute -top-2 -right-2 ${
          isCorrect ? 'bg-signal-success' : 'bg-signal-error'
        } text-white text-xs px-2 py-1 rounded-full font-bold`}
      >
        {isCorrect ? '✓ Public' : '✗ Wrong'}
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className={`${
          isCorrect ? '!bg-signal-success' : '!bg-signal-error'
        } !border-2 ${
          isCorrect ? '!border-signal-success' : '!border-signal-error'
        } !w-3 !h-3`}
      />
    </motion.div>
  )
}

export default memo(OutputNode)
