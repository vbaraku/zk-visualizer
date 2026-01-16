import { CircuitDefinition } from '../../types/circuit'

/**
 * Square Circuit Definition
 *
 * This circuit proves knowledge of x where x² = out
 * It's the simplest ZK circuit for educational purposes.
 *
 * Circuit structure:
 * - Input: x (private)
 * - Gate: x * x
 * - Output: out (public)
 *
 * Constraint: x * x = out
 */
export const squareCircuit: CircuitDefinition = {
  id: 'square',
  name: 'Square Circuit',
  description: 'Proves knowledge of x where x² = out',
  difficulty: 'beginner',

  signals: [
    {
      id: 'one',
      name: '1',
      type: 'constant',
      value: 1,
      description: 'Constant value 1',
    },
    {
      id: 'x',
      name: 'x',
      type: 'private',
      description: 'Secret input - the number you know',
    },
    {
      id: 'out',
      name: 'out',
      type: 'public',
      description: 'Public output (x²)',
    },
  ],

  gates: [
    {
      id: 'mul1',
      type: 'mul',
      inputs: ['x', 'x'],
      output: 'out',
      label: '×',
    },
  ],

  // R1CS constraint: x * x = out
  // Signal order: [one, x, out]
  // Constraint: [0,1,0] * [0,1,0] = [0,0,1]
  // Which means: x * x = out
  constraints: [
    {
      a: [0, 1, 0], // x
      b: [0, 1, 0], // x
      c: [0, 0, 1], // out
    },
  ],

  // Layout for React Flow visualization
  layout: {
    nodes: [
      { id: 'x', position: { x: 100, y: 150 } },
      { id: 'mul1', position: { x: 350, y: 150 } },
      { id: 'out', position: { x: 600, y: 150 } },
    ],
  },

  // Paths to compiled circuit artifacts (relative to /public)
  artifacts: {
    wasm: '/circuits/square/square.wasm',
    zkey: '/circuits/square/square_final.zkey',
    vkey: '/circuits/square/verification_key.json',
  },
}
