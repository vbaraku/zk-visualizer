import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { NodeState } from '../../../types/animation'

/**
 * GateNode - Represents a computation gate (multiply, add, etc.)
 *
 * Visual characteristics:
 * - Blue border for processing/intermediate operations
 * - Dark background matching design system
 * - Shows operation symbol and result
 * - Animated states: idle (dimmed), computing (pulsing glow), complete (solid)
 */

interface GateNodeData {
  label: string
  operation?: string
  value?: number | string
  description?: string
  nodeState?: NodeState
}

interface GateNodeProps {
  data: GateNodeData
}

function GateNode({ data }: GateNodeProps) {
  const nodeState = data.nodeState || 'complete'

  // Determine styling based on node state
  const isIdle = nodeState === 'idle'
  const isComputing = nodeState === 'computing'
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
       className="bg-slate-800 border-2 border-signal-processing rounded-lg px-6 py-4 min-w-[140px] shadow-lg"
        style={{ opacity }}
        animate={
          isComputing
            ? {
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0.4)',
                  '0 0 0 10px rgba(59, 130, 246, 0)',
                  '0 0 0 0 rgba(59, 130, 246, 0.4)',
                ],
              }
            : {}
        }
        transition={
          isComputing
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        {/* Label */}
        <div className="text-xs font-semibold text-signal-processing mb-1">
          {data.label}
        </div>

        {/* Operation Symbol */}
        <div className="text-3xl font-bold text-signal-processing text-center">
          {data.operation || '×'}
        </div>

        {/* Value (if computed) */}
        {!isIdle && data.value !== undefined && (
          <motion.div
            className="text-lg font-mono font-bold text-text-primary text-center mt-1"
            initial={false}
            animate={isComputing || isComplete ? { scale: [0.8, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            = {data.value}
          </motion.div>
        )}

        {/* Description */}
        {data.description && (
          <div className="text-xs text-text-secondary mt-1 text-center">
            {data.description}
          </div>
        )}
      </motion.div>

      {/* Input Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-1"
        className="!bg-signal-processing !border-2 !border-signal-processing !w-3 !h-3"
        style={{ top: '40%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input-2"
        className="!bg-signal-processing !border-2 !border-signal-processing !w-3 !h-3"
        style={{ top: '60%' }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-signal-processing !border-2 !border-signal-processing !w-3 !h-3"
      />
    </motion.div>
  )
}

export default memo(GateNode)
