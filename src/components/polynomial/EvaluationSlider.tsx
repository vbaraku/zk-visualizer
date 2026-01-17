/**
 * EvaluationSlider - Interactive slider for evaluating polynomials
 *
 * Lets user pick x value to evaluate polynomials at
 */

import { useState } from 'react'
import { PolynomialCurve } from '../../types/polynomial'
import { evaluate } from '../../core/polynomial'

interface EvaluationSliderProps {
  polynomials: PolynomialCurve[]
  min?: number
  max?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

export default function EvaluationSlider({
  polynomials,
  min = -2,
  max = 10,
  defaultValue = 1,
  onChange,
}: EvaluationSliderProps) {
  const [xValue, setXValue] = useState(defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setXValue(value)
    onChange?.(value)
  }

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
      <h4 className="text-lg font-semibold text-text-primary mb-4">
        Evaluate at x = {xValue.toFixed(2)}
      </h4>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={xValue}
          onChange={handleChange}
          className="w-full h-2 bg-surface-subtle rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
              ((xValue - min) / (max - min)) * 100
            }%, #334155 ${((xValue - min) / (max - min)) * 100}%, #334155 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Evaluation results */}
      <div className="space-y-3">
        {polynomials.map((poly) => {
          const result = evaluate(poly.coefficients, xValue)
          return (
            <div
              key={poly.id}
              className="flex items-center justify-between p-3 bg-surface-subtle rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: poly.color }} />
                <span className="text-text-primary font-medium">{poly.label}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold" style={{ color: poly.color }}>
                  {result.toFixed(4)}
                </div>
                <div className="text-xs text-text-secondary font-mono">
                  {poly.id}({xValue.toFixed(2)})
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
