/**
 * R1CS (Rank-1 Constraint System) Core Utilities
 *
 * Functions for computing and animating R1CS transformations
 */

import { R1CSConstraint, R1CSAnimationStep, DotProductResult } from '../types/r1cs'

/**
 * Get the R1CS constraint for the square circuit
 * For x² = out, the constraint is:
 * A = [0, 1, 0]  (selects x)
 * B = [0, 1, 0]  (selects x)
 * C = [0, 0, 1]  (selects out)
 * Witness: w = [1, x, out]
 */
export function getSquareCircuitR1CS(): R1CSConstraint {
  return {
    a: [0, 1, 0],
    b: [0, 1, 0],
    c: [0, 0, 1],
    description: 'x × x = out',
  }
}

/**
 * Compute dot product of vector and witness
 */
export function computeDotProduct(
  vector: number[],
  witness: number[],
  witnessLabels: string[]
): DotProductResult {
  const steps: string[] = []
  let result = 0

  for (let i = 0; i < vector.length; i++) {
    const product = vector[i] * witness[i]
    result += product
    steps.push(`${vector[i]}×${witnessLabels[i]}`)
  }

  return {
    vector,
    witness,
    result,
    steps,
  }
}

/**
 * Check if R1CS constraint is satisfied
 */
export function checkConstraint(
  constraint: R1CSConstraint,
  witness: number[]
): { passed: boolean; leftSide: number; rightSide: number } {
  const aDotW = constraint.a.reduce((sum, val, i) => sum + val * witness[i], 0)
  const bDotW = constraint.b.reduce((sum, val, i) => sum + val * witness[i], 0)
  const cDotW = constraint.c.reduce((sum, val, i) => sum + val * witness[i], 0)

  const leftSide = aDotW * bDotW
  const rightSide = cDotW

  return {
    passed: leftSide === rightSide,
    leftSide,
    rightSide,
  }
}

/**
 * Generate animation steps for R1CS construction
 * Shows how the circuit transforms into constraint matrices
 */
export function generateR1CSAnimationSteps(
  xValue: number
): R1CSAnimationStep[] {
  const steps: R1CSAnimationStep[] = []

  // Step 0: Setup
  steps.push({
    id: 'step-0',
    phase: 'setup',
    title: 'Setup: R1CS Format',
    description:
      'We need to express our circuit as matrices A, B, C such that (A·w) × (B·w) = (C·w). ' +
      'The witness w = [1, x, out] contains all signal values.',
    matrixAVisible: false,
    matrixBVisible: false,
    matrixCVisible: false,
    showDotProducts: false,
    showFinalCheck: false,
  })

  // Step 1: Identify constraint
  steps.push({
    id: 'step-1',
    phase: 'identify',
    title: 'Identify the Constraint',
    description:
      'Our circuit has ONE gate: a multiplication. This gate creates the constraint "x × x = out". ' +
      'This will become one row in our matrices.',
    circuitHighlight: ['mul1', 'x', 'out'],
    matrixAVisible: false,
    matrixBVisible: false,
    matrixCVisible: false,
    showDotProducts: false,
    showFinalCheck: false,
  })

  // Step 2: Build A (left input)
  steps.push({
    id: 'step-2',
    phase: 'build-a',
    title: 'Matrix A: Select Left Input',
    description:
      'What is the LEFT side of x × x? It\'s x! Matrix A = [0, 1, 0] selects the second element (x) from witness [1, x, out]. ' +
      'When we compute A·w, we get x.',
    circuitHighlight: ['x', 'mul1'],
    matrixAVisible: true,
    matrixAHighlight: 1, // Highlight the "1" in position 1
    matrixBVisible: false,
    matrixCVisible: false,
    showDotProducts: false,
    showFinalCheck: false,
  })

  // Step 3: Build B (right input)
  steps.push({
    id: 'step-3',
    phase: 'build-b',
    title: 'Matrix B: Select Right Input',
    description:
      'What is the RIGHT side of x × x? Also x! Matrix B = [0, 1, 0] also selects x. ' +
      'In this circuit, both inputs to the multiply gate are the same signal.',
    circuitHighlight: ['x', 'mul1'],
    matrixAVisible: true,
    matrixBVisible: true,
    matrixBHighlight: 1, // Highlight the "1" in position 1
    matrixCVisible: false,
    showDotProducts: false,
    showFinalCheck: false,
  })

  // Step 4: Build C (output)
  steps.push({
    id: 'step-4',
    phase: 'build-c',
    title: 'Matrix C: Select Output',
    description:
      'What should x × x EQUAL? It should equal out! Matrix C = [0, 0, 1] selects the third element (out) from the witness. ' +
      'When we compute C·w, we get out.',
    circuitHighlight: ['mul1', 'out'],
    matrixAVisible: true,
    matrixBVisible: true,
    matrixCVisible: true,
    matrixCHighlight: 2, // Highlight the "1" in position 2
    showDotProducts: false,
    showFinalCheck: false,
  })

  // Step 5: Show equation
  steps.push({
    id: 'step-5',
    phase: 'equation',
    title: 'Complete Equation',
    description:
      'Now we have: (A·w) × (B·w) = (C·w). Substituting our vectors: ' +
      '([0,1,0]·w) × ([0,1,0]·w) = ([0,0,1]·w). This simplifies to x × x = out, exactly our circuit!',
    matrixAVisible: true,
    matrixBVisible: true,
    matrixCVisible: true,
    showDotProducts: true,
    showFinalCheck: false,
  })

  // Step 6: Verify with actual values
  steps.push({
    id: 'step-6',
    phase: 'verify',
    title: 'Verify with Witness Values',
    description:
      `Let's plug in the actual witness values [1, ${xValue}, ${xValue * xValue}] and verify the constraint is satisfied. ` +
      `If the math checks out, our witness is valid!`,
    matrixAVisible: true,
    matrixBVisible: true,
    matrixCVisible: true,
    showDotProducts: true,
    showFinalCheck: true,
  })

  return steps
}
