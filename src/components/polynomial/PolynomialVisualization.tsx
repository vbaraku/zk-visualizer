/**
 * PolynomialVisualization - Main container for polynomial/QAP visualization
 */

import { useMemo } from 'react'
import { usePolynomialAnimation } from '../../hooks/usePolynomialAnimation'
import { generatePolynomialAnimationSteps } from '../../core/qap'
import AnimationControls from '../circuit/AnimationControls'
import ScalingProblemDemo from './ScalingProblemDemo'
import RandomCheckDemo from './RandomCheckDemo'

interface PolynomialVisualizationProps {
  xValue: number
}

export default function PolynomialVisualization({ xValue }: PolynomialVisualizationProps) {
  // Generate animation steps
  const animationSteps = useMemo(() => generatePolynomialAnimationSteps(xValue), [xValue])

  // Animation controller
  const animation = usePolynomialAnimation({ steps: animationSteps })

  // Current step data
  const currentStep = animationSteps[animation.currentStep]

  // Render content based on current phase
  const renderPhaseContent = () => {
    switch (currentStep.phase) {
      case 'scaling-problem':
        return <ScalingProblemDemo />

      case 'random-check':
        return <RandomCheckDemo />

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Animation controls */}
      <AnimationControls
        currentStep={animation.currentStep}
        totalSteps={animation.totalSteps}
        isPlaying={animation.isPlaying}
        speed={animation.speed}
        onPlay={animation.play}
        onPause={animation.pause}
        onReset={animation.reset}
        onStepForward={animation.stepForward}
        onStepBack={animation.stepBack}
        onSpeedChange={animation.setSpeed}
      />

      {/* Step title and description */}
      <div className="bg-accent-cyan/10 border-l-4 border-accent-cyan p-4 rounded">
        <h3 className="text-lg font-semibold text-text-dark-primary mb-1">
          {currentStep.title}
        </h3>
        <p className="text-text-dark-secondary text-sm">{currentStep.description}</p>
      </div>

      {/* Phase-specific content */}
      {renderPhaseContent()}
    </div>
  )
}