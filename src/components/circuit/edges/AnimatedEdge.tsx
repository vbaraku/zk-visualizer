/**
 * AnimatedEdge - Custom edge component with particle animation
 *
 * Shows data flow with an animated particle traveling along the edge
 */

import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react'

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Extract custom data properties with safe defaults
  const edgeState = (data as any)?.edgeState || 'idle'
  const showParticle = (data as any)?.showParticle || false

  // Determine edge styling based on state
  const strokeColor =
    edgeState === 'active'
      ? '#FBBF24' // signal-private (amber)
      : edgeState === 'complete'
      ? '#22C55E' // signal-success (green)
      : '#475569' // slate-600 (idle)

  const strokeWidth = edgeState === 'idle' ? 2 : 3
  const strokeDasharray = edgeState === 'idle' ? '5,5' : '0'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...(style || {}),
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
        }}
      />

      {/* Animated particle */}
      {showParticle && (
        <g>
          <circle
            r="4"
            fill={strokeColor}
            className="animate-edge-particle"
          >
            <animateMotion
              dur="0.6s"
              repeatCount="1"
              path={edgePath}
            />
            {/* Pulse effect */}
            <animate
              attributeName="r"
              values="4;6;4"
              dur="0.6s"
              repeatCount="1"
            />
          </circle>
        </g>
      )}
    </>
  )
}
