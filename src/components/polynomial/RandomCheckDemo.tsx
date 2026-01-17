/**
 * RandomCheckDemo - Interactive demo of Schwartz-Zippel lemma
 *
 * Shows why random evaluation catches cheaters
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Check, X } from 'lucide-react'
import PolynomialPlot from './PolynomialPlot'
import { PolynomialCurve } from '../../types/polynomial'
import { evaluate } from '../../core/polynomial'

export default function RandomCheckDemo() {
  const [attemptCount, setAttemptCount] = useState(0)
  const [randomX, setRandomX] = useState<number | null>(null)
  const [caught, setCaught] = useState<boolean | null>(null)

  // Two different polynomials
  const honestPoly: PolynomialCurve = {
    id: 'honest',
    label: "Honest Prover's Polynomial",
    coefficients: [1, 2, -1], // 1 + 2x - x²
    color: '#22C55E',
    description: '1 + 2x − x²',
  }

  const cheaterPoly: PolynomialCurve = {
    id: 'cheater',
    label: "Cheater's Polynomial",
    coefficients: [1, 1, 0.5], // 1 + x + 0.5x²
    color: '#EF4444',
    description: '1 + x + 0.5x²',
  }

  const handleRandomCheck = () => {
    // Pick random x between 0 and 10
    const x = Math.random() * 10
    setRandomX(x)

    // Evaluate both polynomials at this point
    const honestValue = evaluate(honestPoly.coefficients, x)
    const cheaterValue = evaluate(cheaterPoly.coefficients, x)

    // Check if they match (with small tolerance for floating point)
    const match = Math.abs(honestValue - cheaterValue) < 0.01
    setCaught(!match)
    setAttemptCount((c) => c + 1)
  }

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-4">
        Demo: Catch the Cheater
      </h3>

      <div className="mb-4 p-4 bg-accent-primary/10 border-l-4 border-accent-primary rounded">
        <p className="text-text-secondary text-sm">
          These two polynomials are different, but a cheater claims they're the same. Pick a random
          x value to check. If they give different results, we caught the cheater!
        </p>
      </div>

      {/* Polynomial plot */}
      <PolynomialPlot
        polynomials={[honestPoly, cheaterPoly]}
        highlightPoint={randomX ?? undefined}
        xRange={[0, 10]}
        height={300}
      />

      {/* Random check button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleRandomCheck}
          className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-lg font-semibold transition-colors"
        >
          <RefreshCw size={20} />
          Pick Random Point to Check
        </button>
      </div>

      {/* Result */}
      {randomX !== null && caught !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div
            className={`p-4 rounded-lg border-2 ${
              caught
                ? 'bg-signal-success/10 border-signal-success'
                : 'bg-signal-error/10 border-signal-error'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {caught ? (
                <>
                  <Check className="text-signal-success" size={24} />
                  <span className="text-signal-success font-semibold text-lg">
                    Cheater Caught!
                  </span>
                </>
              ) : (
                <>
                  <X className="text-signal-error" size={24} />
                  <span className="text-signal-error font-semibold text-lg">
                    Same Value (Rare!)
                  </span>
                </>
              )}
            </div>

            <div className="text-sm space-y-1">
              <div className="text-text-secondary">
                At x = {randomX.toFixed(3)}:
              </div>
              <div className="flex items-center justify-between">
                <span className="text-signal-success">Honest polynomial:</span>
                <span className="font-mono text-text-primary">
                  {evaluate(honestPoly.coefficients, randomX).toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-signal-error">Cheater's polynomial:</span>
                <span className="font-mono text-text-primary">
                  {evaluate(cheaterPoly.coefficients, randomX).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      {attemptCount > 0 && (
        <div className="mt-4 text-center text-sm text-text-secondary">
          Attempts: {attemptCount} | Caught:{' '}
          {attemptCount > 0 && caught !== null ? (caught ? 'Yes ✓' : 'No (lucky!)') : '—'}
        </div>
      )}

      {/* Explanation */}
      <div className="mt-6 p-4 bg-surface-subtle rounded">
        <div className="text-sm text-text-secondary space-y-2">
          <p>
            <strong className="text-text-primary">The Insight:</strong> Two different polynomials
            of degree n can agree at most n points.
          </p>
          <p>
            If we pick a random point from a huge set (like a 256-bit number), the chance of
            hitting one of those agreement points is negligibly small.
          </p>
          <p>
            <strong className="text-text-primary">This is why ZK proofs work:</strong> One random
            check is enough to catch cheaters with overwhelming probability!
          </p>
        </div>
      </div>
    </div>
  )
}
