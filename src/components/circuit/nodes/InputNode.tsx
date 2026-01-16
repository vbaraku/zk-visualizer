import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

/**
 * InputNode - Represents an input signal (private or public)
 *
 * Visual characteristics:
 * - Yellow/amber border for private signals
 * - Dark background matching design system
 * - Shows signal name and current value
 */

interface InputNodeData {
  label: string
  value: number | string
  description?: string
  isPrivate?: boolean
}

interface InputNodeProps {
  data: InputNodeData
}

function InputNode({ data }: InputNodeProps) {
  const isPrivate = data.isPrivate ?? true

  return (
    <div className="relative">
      <div
        className={`bg-surface border-2 ${
          isPrivate ? 'border-signal-private' : 'border-signal-public'
        } rounded-lg px-6 py-4 min-w-[140px] shadow-lg`}
      >
        {/* Label */}
        <div
          className={`text-xs font-semibold mb-1 ${
            isPrivate ? 'text-signal-private' : 'text-signal-public'
          }`}
        >
          {data.label}
        </div>

        {/* Value */}
        <div className="text-2xl font-mono font-bold text-text-primary">
          {data.value}
        </div>

        {/* Description */}
        {data.description && (
          <div className="text-xs text-text-secondary mt-1">{data.description}</div>
        )}
      </div>

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
    </div>
  )
}

export default memo(InputNode)
