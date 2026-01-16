import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

/**
 * OutputNode - Represents an output signal (public)
 *
 * Visual characteristics:
 * - Green border for correct/public outputs
 * - Red border if validation fails
 * - Dark background matching design system
 * - Shows output value and expected value
 */

interface OutputNodeData {
  label: string
  value: number | string
  expectedValue?: number | string
  description?: string
}

interface OutputNodeProps {
  data: OutputNodeData
}

function OutputNode({ data }: OutputNodeProps) {
  const isCorrect =
    data.expectedValue === undefined || data.value === data.expectedValue

  return (
    <div className="relative">
      <div
        className={`bg-surface border-2 ${
          isCorrect ? 'border-signal-success' : 'border-signal-error'
        } rounded-lg px-6 py-4 min-w-[140px] shadow-lg`}
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
        <div className="text-2xl font-mono font-bold text-text-primary">
          {data.value}
        </div>

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
      </div>

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
    </div>
  )
}

export default memo(OutputNode)
