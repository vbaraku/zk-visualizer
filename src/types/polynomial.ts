/**
 * Polynomial Types
 *
 * Types for polynomial visualization and QAP transformation
 */

// Polynomial represented as array of coefficients [a₀, a₁, a₂, ...] for a₀ + a₁x + a₂x² + ...
export type Polynomial = number[]

export interface Point {
  x: number
  y: number
  label?: string
}

export interface PolynomialCurve {
  id: string
  label: string
  coefficients: Polynomial
  color: string
  description?: string
}

export interface EvaluationPoint {
  x: number
  label: string
  values?: Record<string, number> // polyId → value at this point
}

export type PolynomialAnimationPhase =
  | 'scaling-problem' // Why polynomials?
  | 'r1cs-to-points' // Show R1CS → evaluation points
  | 'interpolation' // Points → polynomial curves
  | 'qap-identity' // Show A·B - C = H·Z
  | 'random-check' // Demonstrate random evaluation

export interface PolynomialAnimationStep {
  id: string
  phase: PolynomialAnimationPhase
  title: string
  description: string
  polynomials: PolynomialCurve[] // Which polynomials to show
  evaluationPoints?: EvaluationPoint[] // Points to highlight
  highlightPoint?: number // x value to emphasize
  showInterpolation?: boolean
  showEquation?: boolean
  equationParts?: {
    left?: number // A(x) · B(x) result
    right?: number // H(x) · Z(x) result
    passed?: boolean
  }
}

export interface QAPData {
  // Polynomials from R1CS transformation
  A: Polynomial
  B: Polynomial
  C: Polynomial
  // Vanishing polynomial (zero at constraint evaluation points)
  Z: Polynomial
  // Quotient polynomial (exists iff constraints satisfied)
  H: Polynomial
  // Evaluation points (where constraints are checked)
  evaluationPoints: number[]
}

export interface LagrangeInterpolationState {
  points: Point[]
  basisPolynomials?: Polynomial[] // Individual Lagrange basis polynomials
  resultPolynomial?: Polynomial // Combined result
  currentBasisIndex?: number // For step-by-step animation
}
