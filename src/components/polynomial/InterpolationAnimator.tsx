/**
 * InterpolationAnimator - Shows points transforming into polynomial curve
 *
 * Visualizes Lagrange interpolation process
 */

import { motion } from 'framer-motion'
import { Point } from '../../types/polynomial'
import { Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart } from 'recharts'
import { lagrangeInterpolate, plotPoints } from '../../core/polynomial'
import { useMemo } from 'react'

interface InterpolationAnimatorProps {
  points: Point[]
  showCurve?: boolean
  color?: string
}

export default function InterpolationAnimator({
  points,
  showCurve = false,
  color = '#8B5CF6',
}: InterpolationAnimatorProps) {
  // Interpolate polynomial from points
  const polynomial = useMemo(() => {
    if (points.length === 0) return []
    return lagrangeInterpolate(points)
  }, [points])

  // Generate curve points for visualization
  const curveData = useMemo(() => {
    if (!showCurve || polynomial.length === 0) return []

    const xValues = points.map(p => p.x)
    const xMin = Math.min(...xValues) - 1
    const xMax = Math.max(...xValues) + 1

    return plotPoints(polynomial, xMin, xMax, 50)
  }, [polynomial, points, showCurve])

  // Calculate ranges for axes
  const xRange = useMemo(() => {
    if (points.length === 0) return [-1, 1]
    const xValues = points.map(p => p.x)
    const min = Math.min(...xValues)
    const max = Math.max(...xValues)
    return [min - 1, max + 1]
  }, [points])

  const yRange = useMemo(() => {
    const allYs = [...points.map(p => p.y), ...curveData.map(p => p.y)]
    if (allYs.length === 0) return [-1, 1]
    const min = Math.min(...allYs)
    const max = Math.max(...allYs)
    const padding = Math.max(Math.abs(max - min) * 0.2, 1)
    return [min - padding, max + padding]
  }, [points, curveData])

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-4">
      <h4 className="text-lg font-semibold text-text-primary mb-4">
        Lagrange Interpolation
      </h4>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />

          <XAxis
            dataKey="x"
            type="number"
            domain={xRange}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value: number) => Number.isInteger(value) ? value.toString() : value.toFixed(1)}
          />

          <YAxis
            dataKey="y"
            type="number"
            domain={yRange}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />

          {/* Show interpolated curve if enabled */}
          {showCurve && curveData.length > 0 && (
            <Line
              data={curveData}
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
            />
          )}

          {/* Show data points */}
          <Scatter
            data={points}
            fill={color}
            isAnimationActive={true}
            animationDuration={500}
            shape={(props: any) => {
              const { cx, cy } = props
              return (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Points list */}
      <div className="mt-4">
        <div className="text-sm text-text-secondary mb-2">Evaluation Points:</div>
        <div className="flex flex-wrap gap-2">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="px-3 py-1 bg-surface-subtle border border-border-subtle rounded text-xs font-mono"
            >
              ({point.x.toFixed(1)}, {point.y.toFixed(2)})
              {point.label && <span className="ml-1 text-text-secondary">- {point.label}</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {showCurve && polynomial.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-accent-primary/10 border-l-4 border-accent-primary rounded"
        >
          <div className="text-sm">
            <span className="text-text-primary font-semibold">Interpolated Polynomial:</span>
            <span className="ml-2 text-text-secondary">
              Degree {polynomial.length - 1} curve passing through all points
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
