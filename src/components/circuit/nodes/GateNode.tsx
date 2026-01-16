import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

/**
 * GateNode - Represents a computation gate (multiply, add, etc.)
 *
 * Visual characteristics:
 * - Blue border for processing/intermediate operations
 * - Dark background matching design system
 * - Shows operation symbol and result
 */

interface GateNodeData {
  label: string
  operation?: string
  value?: number | string
  description?: string
}

interface GateNodeProps {
  data: GateNodeData
}

function GateNode({ data }: GateNodeProps) {
  return (
    <div className="relative">
      <div className="bg-surface border-2 border-signal-processing rounded-lg px-6 py-4 min-w-[140px] shadow-lg">
        {/* Label */}
        <div className="text-xs font-semibold text-signal-processing mb-1">
          {data.label}
        </div>

        {/* Operation Symbol */}
        <div className="text-3xl font-bold text-signal-processing text-center">
          {data.operation || '×'}
        </div>

        {/* Value (if computed) */}
        {data.value !== undefined && (
          <div className="text-lg font-mono font-bold text-text-primary text-center mt-1">
            = {data.value}
          </div>
        )}

        {/* Description */}
        {data.description && (
          <div className="text-xs text-text-secondary mt-1 text-center">
            {data.description}
          </div>
        )}
      </div>

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
    </div>
  )
}

export default memo(GateNode)
