/**
 * ScalingProblemDemo - Visualizes why polynomials are needed
 *
 * Shows the scaling problem with individual constraint checking
 */

import { motion } from 'framer-motion'

export default function ScalingProblemDemo() {
  const scenarios = [
    { constraints: 1, description: 'Easy to check', color: 'bg-signal-success' },
    { constraints: 10, description: 'Still manageable', color: 'bg-signal-processing' },
    { constraints: 1000, description: "Doesn't scale!", color: 'bg-signal-error' },
  ]

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-4">The Scaling Problem</h3>

      <div className="space-y-6">
        {scenarios.map((scenario, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-primary font-medium">
                {scenario.constraints} constraint{scenario.constraints > 1 ? 's' : ''}
              </span>
              <span className="text-text-secondary text-sm">{scenario.description}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {Array.from({ length: Math.min(scenario.constraints, 100) }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 ${scenario.color} rounded-sm`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01, duration: 0.2 }}
                />
              ))}
              {scenario.constraints > 100 && (
                <span className="text-text-secondary text-xs ml-2 self-end">
                  ... and {scenario.constraints - 100} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent-primary/10 border-l-4 border-accent-primary rounded">
        <p className="text-text-primary font-semibold mb-2">The Solution: Polynomials</p>
        <p className="text-text-secondary text-sm">
          Instead of checking each constraint individually, we encode ALL constraints into
          polynomial equations. Then we can verify everything with a SINGLE evaluation at a random
          point.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-surface-subtle border border-border-subtle rounded">
          <div className="text-signal-error text-2xl font-bold mb-1">O(n)</div>
          <div className="text-text-secondary text-xs">Individual checking</div>
        </div>
        <div className="p-4 bg-accent-primary/10 border border-accent-primary rounded">
          <div className="text-accent-primary text-2xl font-bold mb-1">O(1)</div>
          <div className="text-text-secondary text-xs">Polynomial checking</div>
        </div>
      </div>
    </div>
  )
}
