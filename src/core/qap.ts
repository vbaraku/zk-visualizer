/**
 * QAP (Quadratic Arithmetic Program) Transformation
 *
 * Converts R1CS constraints to polynomial form
 */

import {
  Polynomial,
  QAPData,
  PolynomialAnimationStep,
  Point,
} from '../types/polynomial'
import {
  lagrangeInterpolate,
  vanishingPolynomial,
  multiply,
  subtract,
  divide,
} from './polynomial'

/**
 * Generate QAP for square circuit: x * x = out
 * For our simple circuit with one constraint, we have:
 * - Witness: w = [1, x, out]
 * - Constraint at evaluation point 1: w[1] * w[1] = w[2]
 */
export function generateSquareCircuitQAP(xValue: number): QAPData {
  const witness = [1, xValue, xValue * xValue]

  // For our single constraint (x * x = out), we need polynomials that:
  // - A selects the left input (x at index 1)
  // - B selects the right input (x at index 1)
  // - C selects the output (out at index 2)

  // At evaluation point x=1, we want:
  // A(1) to select witness[1], so A(1) should be [0, 1, 0] · witness
  // B(1) to select witness[1], so B(1) should be [0, 1, 0] · witness
  // C(1) to select witness[2], so C(1) should be [0, 0, 1] · witness

  // For simplicity, we'll create polynomials directly
  // In a real system, each witness variable gets a polynomial

  // A(x): polynomial for left operand selector
  // We want A(1) = 1 for selecting witness[1]
  // Simple constant polynomial: A(x) = 0 (not selecting constant 1) + 1 (selecting x) + 0 (not selecting out)
  // But we need to think of this differently...

  // Actually, for QAP, we have polynomials for each witness variable
  // A_i(x) for each witness variable i, evaluated at each constraint point

  // Simplified approach for visualization:
  // We have 1 constraint at evaluation point x = 1
  // A(x), B(x), C(x) are polynomials that when evaluated at x=1 give the selectors

  // For constraint "witness[1] * witness[1] = witness[2]" at point 1:
  // We want: (A·w) * (B·w) = (C·w) at x=1
  // Where A, B, C are coefficient vectors for linear combinations

  // Let's use polynomials that interpolate through the right values
  // At x=1: A should pick witness[1], so we want (0, 1, 0) coefficients
  // But A, B, C are actually collections of polynomials per witness variable

  // Simplified for single constraint visualization:
  // A(x) = polynomial for left input = constant that evaluates to the left value
  // B(x) = polynomial for right input = constant that evaluates to the right value
  // C(x) = polynomial for output = constant that evaluates to output

  const evaluationPoint = 1

  // Create simple polynomials for visualization
  // These represent the selector behavior at evaluation point 1
  const A: Polynomial = lagrangeInterpolate([{ x: evaluationPoint, y: witness[1] }]) // Selects x
  const B: Polynomial = lagrangeInterpolate([{ x: evaluationPoint, y: witness[1] }]) // Selects x
  const C: Polynomial = lagrangeInterpolate([{ x: evaluationPoint, y: witness[2] }]) // Selects out

  // Vanishing polynomial: zero at evaluation point 1
  const Z: Polynomial = vanishingPolynomial([evaluationPoint])

  // Compute H(x) such that A(x) * B(x) - C(x) = H(x) * Z(x)
  const AB = multiply(A, B)
  const ABC = subtract(AB, C)

  const divResult = divide(ABC, Z)
  const H: Polynomial = divResult ? divResult.quotient : [0]

  return {
    A,
    B,
    C,
    Z,
    H,
    evaluationPoints: [evaluationPoint],
  }
}

/**
 * Generate animation steps for polynomial visualization
 */
export function generatePolynomialAnimationSteps(_xValue: number): PolynomialAnimationStep[] {
  const steps: PolynomialAnimationStep[] = []

  // Step 1: The Scaling Problem
  steps.push({
    id: 'scaling-intro',
    phase: 'scaling-problem',
    title: 'Why Polynomials?',
    description:
      "Checking each constraint individually doesn't scale. Polynomials let us encode ALL constraints and verify with a SINGLE random evaluation. This is the key insight behind succinct proofs.",
    polynomials: [],
  })

  // Step 2: Catch the cheater demo
  steps.push({
    id: 'catch-cheater',
    phase: 'random-check',
    title: 'The Power of Random Checks',
    description:
      "If a prover tries to cheat with a different polynomial, we catch them by checking at a random point. Two different polynomials almost never agree at a random point — this is the Schwartz-Zippel lemma.",
    polynomials: [],
  })

  return steps
}

/**
 * Get points for polynomial interpolation visualization
 */
export function getInterpolationPoints(
  values: number[],
  evaluationPoints: number[]
): Point[] {
  if (values.length !== evaluationPoints.length) {
    throw new Error('Values and evaluation points must have same length')
  }

  return evaluationPoints.map((x, i) => ({
    x,
    y: values[i],
    label: `(${x}, ${values[i]})`,
  }))
}
