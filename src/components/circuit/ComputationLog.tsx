/**
 * ComputationLog - Shows step-by-step computation history
 *
 * Displays what's happening at each step of the circuit execution
 */

import { ComputationStep } from '../../types/animation'

interface ComputationLogProps {
  steps: ComputationStep[]
  currentStep: number
}

export default function ComputationLog({ steps, currentStep }: ComputationLogProps) {
  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Computation Log
      </h3>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isFuture = index > currentStep

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2 rounded transition-all ${
                isCurrent
                  ? 'bg-accent-primary/10 border-l-4 border-accent-primary'
                  : ''
              }`}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-signal-success flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                {isCurrent && (
                  <div className="w-5 h-5 rounded-full bg-accent-primary flex items-center justify-center">
                    <span className="text-white text-xs font-bold">→</span>
                  </div>
                )}
                {isFuture && (
                  <div className="w-5 h-5 rounded-full border-2 border-border-subtle bg-surface"></div>
                )}
              </div>

              {/* Step description */}
              <div className="flex-1">
                <div
                  className={`text-sm ${
                    isCurrent
                      ? 'text-text-primary font-semibold'
                      : isFuture
                      ? 'text-text-secondary opacity-60'
                      : 'text-text-secondary'
                  }`}
                >
                  <span className="font-medium">Step {index + 1}:</span> {step.description}
                </div>

                {/* Show signal updates if any */}
                {step.signalUpdates.length > 0 && !isFuture && (
                  <div className="mt-1 text-xs text-text-secondary">
                    {step.signalUpdates.map((update) => (
                      <span key={update.signalId} className="font-mono">
                        {update.label || update.signalId} = {update.value}
                        {' '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
