/**
 * QAP (Quadratic Arithmetic Program) Transformation
 *
 * Converts R1CS constraints to polynomial form
 */

import {
  Polynomial,
  QAPData,
  PolynomialAnimationStep,
  PolynomialCurve,
  Point,
} from '../types/polynomial'
import {
  lagrangeInterpolate,
  vanishingPolynomial,
  multiply,
  subtract,
  divide,
  evaluate,
  formatPolynomial,
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
export function generatePolynomialAnimationSteps(xValue: number): PolynomialAnimationStep[] {
  const qap = generateSquareCircuitQAP(xValue)
  const witness = [1, xValue, xValue * xValue]

  const steps: PolynomialAnimationStep[] = []

  // Step 1: The Scaling Problem
  steps.push({
    id: 'scaling-intro',
    phase: 'scaling-problem',
    title: 'Why Polynomials?',
    description:
      "We've converted our circuit into R1CS constraints. But checking each constraint individually doesn't scale. What if we had millions of constraints? Polynomials give us a magical property: we can encode ALL constraints into polynomial equations, then check everything with a SINGLE evaluation at a random point.",
    polynomials: [],
  })

  // Step 2: From R1CS to Evaluation Points
  steps.push({
    id: 'r1cs-to-points',
    phase: 'r1cs-to-points',
    title: 'From Constraints to Points',
    description:
      'Each R1CS constraint gives us evaluation points for our polynomials. For our circuit with one constraint (x × x = out), we have one evaluation point where the polynomials must encode the constraint. We use Lagrange interpolation to find polynomials passing through these points.',
    polynomials: [],
    evaluationPoints: [
      {
        x: 1,
        label: 'Constraint 1',
        values: {
          A: evaluate(qap.A, 1),
          B: evaluate(qap.B, 1),
          C: evaluate(qap.C, 1),
        },
      },
    ],
  })

  // Step 3: Interpolation - Show A(x)
  const aCurve: PolynomialCurve = {
    id: 'A',
    label: 'A(x) - Left Input',
    coefficients: qap.A,
    color: '#8B5CF6', // Purple
    description: formatPolynomial(qap.A),
  }

  steps.push({
    id: 'interpolation-a',
    phase: 'interpolation',
    title: 'Building A(x) - Left Input Polynomial',
    description: `A(x) selects the left operand from the witness. At evaluation point x=1, A(1) = ${witness[1]} (selecting x). The polynomial A(x) = ${formatPolynomial(qap.A)}.`,
    polynomials: [aCurve],
    evaluationPoints: [{ x: 1, label: 'x=1', values: { A: evaluate(qap.A, 1) } }],
    showInterpolation: true,
  })

  // Step 4: Show B(x)
  const bCurve: PolynomialCurve = {
    id: 'B',
    label: 'B(x) - Right Input',
    coefficients: qap.B,
    color: '#3B82F6', // Blue
    description: formatPolynomial(qap.B),
  }

  steps.push({
    id: 'interpolation-b',
    phase: 'interpolation',
    title: 'Building B(x) - Right Input Polynomial',
    description: `B(x) selects the right operand from the witness. At evaluation point x=1, B(1) = ${witness[1]} (selecting x). The polynomial B(x) = ${formatPolynomial(qap.B)}.`,
    polynomials: [aCurve, bCurve],
    evaluationPoints: [
      { x: 1, label: 'x=1', values: { A: evaluate(qap.A, 1), B: evaluate(qap.B, 1) } },
    ],
    showInterpolation: true,
  })

  // Step 5: Show C(x)
  const cCurve: PolynomialCurve = {
    id: 'C',
    label: 'C(x) - Output',
    coefficients: qap.C,
    color: '#22C55E', // Green
    description: formatPolynomial(qap.C),
  }

  steps.push({
    id: 'interpolation-c',
    phase: 'interpolation',
    title: 'Building C(x) - Output Polynomial',
    description: `C(x) selects the output from the witness. At evaluation point x=1, C(1) = ${witness[2]} (selecting out = x²). The polynomial C(x) = ${formatPolynomial(qap.C)}.`,
    polynomials: [aCurve, bCurve, cCurve],
    evaluationPoints: [
      {
        x: 1,
        label: 'x=1',
        values: { A: evaluate(qap.A, 1), B: evaluate(qap.B, 1), C: evaluate(qap.C, 1) },
      },
    ],
    showInterpolation: true,
  })

  // Step 6: The QAP Identity
  const AB = multiply(qap.A, qap.B)
  const ABC = subtract(AB, qap.C)
  const HZ = multiply(qap.H, qap.Z)

  const qapLeftCurve: PolynomialCurve = {
    id: 'AB-C',
    label: 'A(x)·B(x) - C(x)',
    coefficients: ABC,
    color: '#06B6D4', // Cyan
    description: formatPolynomial(ABC),
  }

  const qapRightCurve: PolynomialCurve = {
    id: 'HZ',
    label: 'H(x)·Z(x)',
    coefficients: HZ,
    color: '#F97316', // Orange
    description: formatPolynomial(HZ),
  }

  steps.push({
    id: 'qap-identity',
    phase: 'qap-identity',
    title: 'The QAP Identity',
    description:
      'The key equation of ZK proofs: A(x)·B(x) - C(x) = H(x)·Z(x). Where Z(x) is the vanishing polynomial (zero at evaluation points), and H(x) is the quotient. If H(x) exists, all constraints are satisfied!',
    polynomials: [qapLeftCurve, qapRightCurve],
    evaluationPoints: [{ x: 1, label: 'Zero point', values: {} }],
    showEquation: true,
    equationParts: {
      left: evaluate(ABC, 1),
      right: evaluate(HZ, 1),
      passed: Math.abs(evaluate(ABC, 1) - evaluate(HZ, 1)) < 1e-10,
    },
  })

  // Step 7: Random Evaluation
  const randomPoint = 5.7 // Arbitrary point for demonstration

  steps.push({
    id: 'random-check',
    phase: 'random-check',
    title: 'The Power of Random Evaluation',
    description:
      "Here's the magic: instead of checking the polynomial identity everywhere, we check at ONE random point τ. If the prover cheated, different polynomials would almost never agree at a random point. This is why ZK proofs are SUCCINCT!",
    polynomials: [qapLeftCurve, qapRightCurve],
    highlightPoint: randomPoint,
    showEquation: true,
    equationParts: {
      left: evaluate(ABC, randomPoint),
      right: evaluate(HZ, randomPoint),
      passed: Math.abs(evaluate(ABC, randomPoint) - evaluate(HZ, randomPoint)) < 1e-10,
    },
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
