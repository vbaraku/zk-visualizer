/**
 * R1CS (Rank-1 Constraint System) Types
 *
 * Types for visualizing and animating R1CS transformation
 */

/**
 * A single R1CS constraint: (A·w) × (B·w) = (C·w)
 */
export interface R1CSConstraint {
  a: number[]
  b: number[]
  c: number[]
  description: string // Human-readable like "x × x = out"
}

/**
 * Animation phase types
 */
export type R1CSPhase =
  | 'setup'
  | 'identify'
  | 'build-a'
  | 'build-b'
  | 'build-c'
  | 'equation'
  | 'verify'

/**
 * Single step in R1CS construction animation
 */
export interface R1CSAnimationStep {
  id: string
  phase: R1CSPhase
  title: string
  description: string

  // Visual state - which matrices are visible
  matrixAVisible: boolean
  matrixAHighlight?: number // Index to highlight
  matrixBVisible: boolean
  matrixBHighlight?: number
  matrixCVisible: boolean
  matrixCHighlight?: number

  // Circuit highlighting
  circuitHighlight?: string[] // Node IDs to highlight in circuit

  // Computation display
  showDotProducts: boolean
  showFinalCheck: boolean
}

/**
 * Complete R1CS animation state
 */
export interface R1CSState {
  constraints: R1CSConstraint[]
  witness: number[]
  witnessLabels: string[]
  currentStep: number
  steps: R1CSAnimationStep[]
}

/**
 * Result of computing A·w, B·w, or C·w
 */
export interface DotProductResult {
  vector: number[]
  witness: number[]
  result: number
  steps: string[] // ["0×1", "1×3", "0×9"]
}
