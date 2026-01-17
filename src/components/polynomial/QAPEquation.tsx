/**
 * QAPEquation - Displays the QAP identity equation
 *
 * Shows A(x)·B(x) - C(x) = H(x)·Z(x) with evaluation results
 */

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface QAPEquationProps {
  aValue?: number
  bValue?: number
  cValue?: number
  hValue?: number
  zValue?: number
  xPoint?: number
  showCheck?: boolean
}

export default function QAPEquation({
  aValue,
  bValue,
  cValue,
  hValue,
  zValue,
  xPoint,
  showCheck = false,
}: QAPEquationProps) {
  // Calculate left and right sides
  const leftSide = aValue !== undefined && bValue !== undefined && cValue !== undefined
    ? aValue * bValue - cValue
    : undefined

  const rightSide = hValue !== undefined && zValue !== undefined
    ? hValue * zValue
    : undefined

  const passed = leftSide !== undefined && rightSide !== undefined
    ? Math.abs(leftSide - rightSide) < 1e-6
    : undefined

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">
        The QAP Identity
      </h3>

      {/* Main equation */}
      <div className="flex items-center justify-center gap-4 text-2xl font-mono mb-6">
        <span className="text-accent-secondary">A(x)</span>
        <span className="text-text-secondary">·</span>
        <span className="text-signal-processing">B(x)</span>
        <span className="text-text-secondary">−</span>
        <span className="text-signal-success">C(x)</span>
        <span className="text-text-primary">=</span>
        <span className="text-amber-500">H(x)</span>
        <span className="text-text-secondary">·</span>
        <span className="text-slate-400">Z(x)</span>
      </div>

      {/* Evaluation at specific point */}
      {xPoint !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="text-center text-text-secondary text-sm mb-4">
            Evaluation at x = {xPoint.toFixed(2)}:
          </div>

          {/* Individual values */}
          <div className="grid grid-cols-5 gap-2 text-center text-sm mb-4">
            {aValue !== undefined && (
              <div>
                <div className="text-accent-secondary font-semibold">A({xPoint.toFixed(1)})</div>
                <div className="text-text-primary">{aValue.toFixed(2)}</div>
              </div>
            )}
            {bValue !== undefined && (
              <div>
                <div className="text-signal-processing font-semibold">B({xPoint.toFixed(1)})</div>
                <div className="text-text-primary">{bValue.toFixed(2)}</div>
              </div>
            )}
            {cValue !== undefined && (
              <div>
                <div className="text-signal-success font-semibold">C({xPoint.toFixed(1)})</div>
                <div className="text-text-primary">{cValue.toFixed(2)}</div>
              </div>
            )}
            {hValue !== undefined && (
              <div>
                <div className="text-amber-500 font-semibold">H({xPoint.toFixed(1)})</div>
                <div className="text-text-primary">{hValue.toFixed(2)}</div>
              </div>
            )}
            {zValue !== undefined && (
              <div>
                <div className="text-slate-400 font-semibold">Z({xPoint.toFixed(1)})</div>
                <div className="text-text-primary">{zValue.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Computed sides */}
          {leftSide !== undefined && rightSide !== undefined && (
            <div className="flex items-center justify-center gap-6 p-4 bg-surface-subtle rounded">
              <div className="text-center">
                <div className="text-text-secondary text-xs mb-1">Left Side</div>
                <div className="text-lg font-semibold text-text-primary">
                  {leftSide.toFixed(4)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  ({aValue?.toFixed(2)} · {bValue?.toFixed(2)} − {cValue?.toFixed(2)})
                </div>
              </div>

              <div className="text-2xl text-text-secondary">=</div>

              <div className="text-center">
                <div className="text-text-secondary text-xs mb-1">Right Side</div>
                <div className="text-lg font-semibold text-text-primary">
                  {rightSide.toFixed(4)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  ({hValue?.toFixed(2)} · {zValue?.toFixed(2)})
                </div>
              </div>

              {showCheck && passed !== undefined && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${
                    passed
                      ? 'bg-signal-success/20 text-signal-success'
                      : 'bg-signal-error/20 text-signal-error'
                  }`}
                >
                  {passed ? (
                    <>
                      <Check size={20} />
                      <span className="text-sm font-semibold">Valid!</span>
                    </>
                  ) : (
                    <>
                      <X size={20} />
                      <span className="text-sm font-semibold">Invalid</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Explanation */}
      <div className="mt-6 space-y-2 text-sm text-text-secondary">
        <p>
          <strong className="text-text-primary">A(x), B(x), C(x):</strong> Polynomials encoding
          constraint selectors
        </p>
        <p>
          <strong className="text-text-primary">Z(x):</strong> Vanishing polynomial (zero at
          constraint evaluation points)
        </p>
        <p>
          <strong className="text-text-primary">H(x):</strong> Quotient polynomial — if it exists,
          all constraints are satisfied!
        </p>
      </div>
    </div>
  )
}
