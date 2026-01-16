import { CircuitDefinition } from '../types/circuit'
import { squareCircuit } from './definitions/square'

/**
 * Circuit Registry
 *
 * Central registry of all available circuits for the visualizer.
 */

// All available circuits
export const circuits: CircuitDefinition[] = [squareCircuit]

// Circuit lookup by ID
export const getCircuitById = (id: string): CircuitDefinition | undefined => {
  return circuits.find((circuit) => circuit.id === id)
}

// Get the default circuit (square)
export const getDefaultCircuit = (): CircuitDefinition => {
  return squareCircuit
}

// Re-export for convenience
export { squareCircuit }
