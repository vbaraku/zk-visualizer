/**
 * PolynomialPlot - Interactive polynomial curve visualization
 *
 * Uses Recharts to plot polynomial curves with evaluation points
 */

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from 'recharts'
import { PolynomialCurve, EvaluationPoint } from '../../types/polynomial'
import { evaluate } from '../../core/polynomial'

interface PolynomialPlotProps {
  polynomials: PolynomialCurve[]
  evaluationPoints?: EvaluationPoint[]
  highlightPoint?: number
  xRange?: [number, number]
  yRange?: [number, number]
  showGrid?: boolean
  height?: number
}

export default function PolynomialPlot({
  polynomials,
  evaluationPoints = [],
  highlightPoint,
  xRange = [-2, 10],
  yRange,
  showGrid = true,
  height = 400,
}: PolynomialPlotProps) {
  // Generate plot data
  const plotData = useMemo(() => {
    const [xMin, xMax] = xRange
    const steps = 100
    const points = []

    for (let i = 0; i < steps; i++) {
      const x = xMin + (i * (xMax - xMin)) / (steps - 1)
      const point: Record<string, number> = { x }

      for (const poly of polynomials) {
        point[poly.id] = evaluate(poly.coefficients, x)
      }

      // Add highlight point if it matches
      if (highlightPoint !== undefined && Math.abs(x - highlightPoint) < 0.1) {
        point.highlighted = 1
      }

      points.push(point)
    }

    return points
  }, [polynomials, xRange, highlightPoint])

  // Calculate y-range if not provided
  const calculatedYRange = useMemo(() => {
    if (yRange) return yRange

    let min = Infinity
    let max = -Infinity

    for (const point of plotData) {
      for (const poly of polynomials) {
        const val = point[poly.id]
        if (typeof val === 'number' && isFinite(val)) {
          min = Math.min(min, val)
          max = Math.max(max, val)
        }
      }
    }

    // Add padding
    const padding = Math.max(Math.abs(max - min) * 0.2, 1)
    return [min - padding, max + padding] as [number, number]
  }, [plotData, polynomials, yRange])

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={plotData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}

          <XAxis
            dataKey="x"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'x', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={calculatedYRange}
            label={{
              value: 'y',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: '#94a3b8',
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              color: '#e2e8f0',
            }}
            formatter={(value: number | undefined) => value?.toFixed(3) ?? 'N/A'}
          />

          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value: string) => {
              const poly = polynomials.find((p) => p.id === value)
              return poly ? poly.label : value
            }}
          />

          {/* Reference line at y=0 */}
          <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />

          {/* Plot each polynomial */}
          {polynomials.map((poly) => (
            <Line
              key={poly.id}
              type="monotone"
              dataKey={poly.id}
              stroke={poly.color}
              strokeWidth={2}
              dot={false}
              name={poly.label}
              isAnimationActive={true}
              animationDuration={800}
            />
          ))}

          {/* Mark evaluation points */}
          {evaluationPoints.map((point, idx) => (
            <ReferenceDot
              key={`eval-${idx}`}
              x={point.x}
              y={0}
              r={6}
              fill="#f59e0b"
              stroke="#fbbf24"
              strokeWidth={2}
              label={{
                value: point.label,
                position: 'top',
                fill: '#fbbf24',
                fontSize: 11,
              }}
            />
          ))}

          {/* Highlight specific point if provided */}
          {highlightPoint !== undefined && (
            <>
              <ReferenceLine
                x={highlightPoint}
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `x = ${highlightPoint.toFixed(2)}`,
                  position: 'top',
                  fill: '#f97316',
                  fontSize: 12,
                }}
              />
              {polynomials.map((poly) => {
                const y = evaluate(poly.coefficients, highlightPoint)
                if (!isFinite(y)) return null
                return (
                  <ReferenceDot
                    key={`highlight-${poly.id}`}
                    x={highlightPoint}
                    y={y}
                    r={5}
                    fill={poly.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )
              })}
            </>
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Polynomial equations */}
      {polynomials.length > 0 && (
        <div className="mt-4 space-y-2">
          {polynomials.map((poly) => (
            <div key={poly.id} className="text-sm">
              <span className="font-semibold" style={{ color: poly.color }}>
                {poly.label}:
              </span>
              <span className="ml-2 text-text-secondary font-mono">{poly.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
