/**
 * Polynomial Math Utilities
 *
 * Core polynomial operations for QAP visualization
 * Polynomials represented as coefficient arrays: [a₀, a₁, a₂, ...] = a₀ + a₁x + a₂x² + ...
 */

import { Polynomial, Point } from '../types/polynomial'

/**
 * Evaluate polynomial at point x
 */
export function evaluate(poly: Polynomial, x: number): number {
  let result = 0
  let xPower = 1

  for (const coeff of poly) {
    result += coeff * xPower
    xPower *= x
  }

  return result
}

/**
 * Multiply two polynomials
 * (a + bx)(c + dx) = ac + (ad + bc)x + bdx²
 */
export function multiply(p1: Polynomial, p2: Polynomial): Polynomial {
  if (p1.length === 0 || p2.length === 0) return [0]

  const result: number[] = new Array(p1.length + p2.length - 1).fill(0)

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] += p1[i] * p2[j]
    }
  }

  return result
}

/**
 * Add two polynomials
 */
export function add(p1: Polynomial, p2: Polynomial): Polynomial {
  const maxLen = Math.max(p1.length, p2.length)
  const result: number[] = new Array(maxLen).fill(0)

  for (let i = 0; i < maxLen; i++) {
    result[i] = (p1[i] || 0) + (p2[i] || 0)
  }

  return trimZeros(result)
}

/**
 * Subtract polynomials (p1 - p2)
 */
export function subtract(p1: Polynomial, p2: Polynomial): Polynomial {
  const maxLen = Math.max(p1.length, p2.length)
  const result: number[] = new Array(maxLen).fill(0)

  for (let i = 0; i < maxLen; i++) {
    result[i] = (p1[i] || 0) - (p2[i] || 0)
  }

  return trimZeros(result)
}

/**
 * Multiply polynomial by scalar
 */
export function scale(poly: Polynomial, scalar: number): Polynomial {
  return poly.map((c) => c * scalar)
}

/**
 * Remove leading zeros from polynomial
 */
function trimZeros(poly: Polynomial): Polynomial {
  let lastNonZero = poly.length - 1
  while (lastNonZero > 0 && Math.abs(poly[lastNonZero]) < 1e-10) {
    lastNonZero--
  }
  return poly.slice(0, lastNonZero + 1)
}

/**
 * Lagrange interpolation: find polynomial passing through given points
 * For points (x₀, y₀), (x₁, y₁), ..., (xₙ, yₙ)
 */
export function lagrangeInterpolate(points: Point[]): Polynomial {
  if (points.length === 0) return [0]
  if (points.length === 1) return [points[0].y]

  // Start with zero polynomial
  let result: Polynomial = [0]

  // For each point, compute its Lagrange basis polynomial and add to result
  for (let i = 0; i < points.length; i++) {
    const basis = lagrangeBasis(points, i)
    const scaled = scale(basis, points[i].y)
    result = add(result, scaled)
  }

  return result
}

/**
 * Compute i-th Lagrange basis polynomial
 * L_i(x) = ∏(j≠i) (x - xⱼ) / (xᵢ - xⱼ)
 */
function lagrangeBasis(points: Point[], i: number): Polynomial {
  const xi = points[i].x
  let numerator: Polynomial = [1] // Start with constant 1

  let denominator = 1

  for (let j = 0; j < points.length; j++) {
    if (j === i) continue

    const xj = points[j].x
    // Multiply numerator by (x - xⱼ)
    numerator = multiply(numerator, [-xj, 1]) // -xⱼ + 1·x
    // Multiply denominator by (xᵢ - xⱼ)
    denominator *= xi - xj
  }

  // Divide by denominator
  return scale(numerator, 1 / denominator)
}

/**
 * Vanishing polynomial: Z(x) = (x - r₁)(x - r₂)...(x - rₙ)
 * Equals zero at all roots
 */
export function vanishingPolynomial(roots: number[]): Polynomial {
  if (roots.length === 0) return [1]

  let result: Polynomial = [1]

  for (const root of roots) {
    // Multiply by (x - root) = -root + x
    result = multiply(result, [-root, 1])
  }

  return result
}

/**
 * Polynomial division (returns quotient if evenly divisible, null otherwise)
 * Divides numerator by denominator using long division
 */
export function divide(
  numerator: Polynomial,
  denominator: Polynomial
): { quotient: Polynomial; remainder: Polynomial } | null {
  if (denominator.length === 0 || (denominator.length === 1 && denominator[0] === 0)) {
    return null // Division by zero
  }

  let remainder = [...numerator]
  const quotient: number[] = []

  // Degree of polynomials
  const numDeg = numerator.length - 1
  const denDeg = denominator.length - 1

  if (numDeg < denDeg) {
    return { quotient: [0], remainder: numerator }
  }

  // Long division
  for (let i = numDeg - denDeg; i >= 0; i--) {
    const coeff = remainder[i + denDeg] / denominator[denDeg]
    quotient[i] = coeff

    // Subtract coeff * denominator * x^i from remainder
    for (let j = 0; j <= denDeg; j++) {
      remainder[i + j] -= coeff * denominator[j]
    }
  }

  // Clean up quotient and remainder
  const cleanQuotient = trimZeros(quotient.length > 0 ? quotient : [0])
  const cleanRemainder = trimZeros(remainder)

  return { quotient: cleanQuotient, remainder: cleanRemainder }
}

/**
 * Check if polynomial is zero (all coefficients near zero)
 */
export function isZero(poly: Polynomial, tolerance = 1e-10): boolean {
  return poly.every((c) => Math.abs(c) < tolerance)
}

/**
 * Format polynomial for display: "3x² + 2x + 1"
 */
export function formatPolynomial(poly: Polynomial, variable = 'x'): string {
  if (poly.length === 0 || (poly.length === 1 && poly[0] === 0)) {
    return '0'
  }

  const terms: string[] = []

  for (let i = poly.length - 1; i >= 0; i--) {
    const coeff = poly[i]
    if (Math.abs(coeff) < 1e-10) continue // Skip near-zero coefficients

    const absCoeff = Math.abs(coeff)
    const sign = coeff < 0 ? '-' : '+'
    const coeffStr = absCoeff === 1 && i > 0 ? '' : absCoeff.toFixed(2).replace(/\.?0+$/, '')

    let term = ''
    if (i === 0) {
      term = coeffStr || '1'
    } else if (i === 1) {
      term = coeffStr ? `${coeffStr}${variable}` : variable
    } else {
      const superscript = i.toString().replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[parseInt(d)])
      term = coeffStr ? `${coeffStr}${variable}${superscript}` : `${variable}${superscript}`
    }

    if (terms.length === 0) {
      terms.push(sign === '-' ? `-${term}` : term)
    } else {
      terms.push(`${sign} ${term}`)
    }
  }

  return terms.join(' ')
}

/**
 * Generate points for plotting polynomial over range
 */
export function plotPoints(
  poly: Polynomial,
  xMin: number,
  xMax: number,
  steps: number
): Point[] {
  const points: Point[] = []
  const dx = (xMax - xMin) / (steps - 1)

  for (let i = 0; i < steps; i++) {
    const x = xMin + i * dx
    const y = evaluate(poly, x)
    points.push({ x, y })
  }

  return points
}

/**
 * Get degree of polynomial
 */
export function degree(poly: Polynomial): number {
  const trimmed = trimZeros(poly)
  return trimmed.length - 1
}
