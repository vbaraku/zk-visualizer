/**
 * Animation Types
 *
 * Types for the witness propagation animation system
 */

export type NodeState = 'idle' | 'active' | 'computing' | 'receiving' | 'complete'
export type EdgeState = 'idle' | 'active' | 'complete'
export type AnimationSpeed = 'slow' | 'normal' | 'fast'
export type StepType = 'input' | 'gate' | 'output' | 'complete'

/**
 * Represents a single step in the computation animation
 */
export interface ComputationStep {
  id: string
  type: StepType
  description: string
  signalUpdates: SignalUpdate[]
  activeNodes: string[] // Node IDs to highlight
  activeEdges: string[] // Edge IDs to animate
}

/**
 * A signal value update during computation
 */
export interface SignalUpdate {
  signalId: string
  value: number
  label?: string
}

/**
 * Animation state for a node
 */
export interface NodeAnimationState {
  nodeId: string
  state: NodeState
  value?: number
}

/**
 * Animation state for an edge
 */
export interface EdgeAnimationState {
  edgeId: string
  state: EdgeState
  showParticle: boolean
}

/**
 * Complete animation state at a given step
 */
export interface AnimationState {
  currentStep: number
  nodes: Record<string, NodeAnimationState>
  edges: Record<string, EdgeAnimationState>
  computedValues: Record<string, number>
}
