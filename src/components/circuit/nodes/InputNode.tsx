import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { NodeState } from '../../../types/animation'

/**
 * InputNode - Represents an input signal (private or public)
 *
 * Visual characteristics:
 * - Yellow/amber border for private signals
 * - Dark background matching design system
 * - Shows signal name and current value
 * - Animated states: idle (dimmed), active (pulsing glow), complete (solid)
 */

interface InputNodeData {
  label: string
  value: number | string
  description?: string
  isPrivate?: boolean
  nodeState?: NodeState
}

interface InputNodeProps {
  data: InputNodeData
}

function InputNode({ data }: InputNodeProps) {
  const isPrivate = data.isPrivate ?? true
  const nodeState = data.nodeState || 'complete'

  // Determine styling based on node state
  const isIdle = nodeState === 'idle'
  const isActive = nodeState === 'active'
  const isComplete = nodeState === 'complete'

  // Border and text colors
  const borderColor = isPrivate ? 'border-signal-private' : 'border-signal-public'
  const textColor = isPrivate ? 'text-signal-private' : 'text-signal-public'

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
        className={`bg-surface border-2 ${borderColor} rounded-lg px-6 py-4 min-w-[140px] shadow-lg relative`}
        style={{ opacity }}
        animate={
          isActive
            ? {
                boxShadow: [
                  '0 0 0 0 rgba(251, 191, 36, 0.4)',
                  '0 0 0 10px rgba(251, 191, 36, 0)',
                  '0 0 0 0 rgba(251, 191, 36, 0.4)',
                ],
              }
            : {}
        }
        transition={
          isActive
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        {/* Label */}
        <div className={`text-xs font-semibold mb-1 ${textColor}`}>
          {data.label}
        </div>

        {/* Value */}
        <motion.div
          className="text-2xl font-mono font-bold text-text-primary"
          initial={false}
          animate={isActive || isComplete ? { scale: [0.8, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isIdle ? '?' : data.value}
        </motion.div>

        {/* Description */}
        {data.description && (
          <div className="text-xs text-text-secondary mt-1">{data.description}</div>
        )}
      </motion.div>

      {/* Badge */}
      {isPrivate && (
        <div className="absolute -top-2 -right-2 bg-signal-private text-background text-xs px-2 py-1 rounded-full font-bold">
          🔒 Private
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-signal-private !border-2 !border-signal-private !w-3 !h-3"
      />
    </motion.div>
  )
}

export default memo(InputNode)
