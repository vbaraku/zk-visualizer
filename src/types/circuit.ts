/**
 * Circuit Definition Types
 *
 * These types define the structure of a ZK circuit for visualization
 */

export type SignalType = 'constant' | 'private' | 'public' | 'intermediate'
export type GateType = 'mul' | 'add' | 'const'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Represents a signal in the circuit (input, output, or intermediate value)
 */
export interface Signal {
  id: string
  name: string
  type: SignalType
  value?: number
  description?: string
}

/**
 * Represents a gate (operation) in the circuit
 */
export interface Gate {
  id: string
  type: GateType
  inputs: string[]  // Signal IDs
  output: string    // Signal ID
  label?: string    // Display label (e.g., '×', '+')
}

/**
 * R1CS constraint: A · B = C
 * Each constraint is represented as three vectors (a, b, c)
 * where each element corresponds to a signal coefficient
 */
export interface Constraint {
  a: number[]  // Left side coefficients
  b: number[]  // Right side coefficients
  c: number[]  // Output coefficients
}

/**
 * Layout information for React Flow visualization
 */
export interface NodeLayout {
  id: string
  position: { x: number; y: number }
}

export interface CircuitLayout {
  nodes: NodeLayout[]
}

/**
 * Paths to compiled circuit artifacts
 */
export interface CircuitArtifacts {
  wasm: string  // Path to compiled WASM file
  zkey: string  // Path to proving key
  vkey: string  // Path to verification key
}

/**
 * Complete circuit definition
 */
export interface CircuitDefinition {
  id: string
  name: string
  description: string
  difficulty: Difficulty

  signals: Signal[]
  gates: Gate[]
  constraints: Constraint[]
  layout: CircuitLayout
  artifacts: CircuitArtifacts
}

/**
 * Witness represents the complete assignment of values to all signals
 */
export interface Witness {
  [signalId: string]: number
}
