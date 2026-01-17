/**
 * R1CSVisualization - Main container for R1CS transformation animation
 *
 * Shows side-by-side circuit and matrices, with step-by-step construction
 */

import { useMemo } from 'react'
import MatrixView from './MatrixView'
import WitnessVector from './WitnessVector'
import ConstraintEquation from './ConstraintEquation'
import CircuitMiniView from './CircuitMiniView'
import AnimationControls from '../circuit/AnimationControls'
import { useR1CSAnimation } from '../../hooks/useR1CSAnimation'
import {
  generateR1CSAnimationSteps,
  getSquareCircuitR1CS,
  computeDotProduct,
} from '../../core/r1cs'

interface R1CSVisualizationProps {
  xValue: number
  targetOutput: number
}

export default function R1CSVisualization({ xValue, targetOutput: _targetOutput }: R1CSVisualizationProps) {
  const constraint = getSquareCircuitR1CS()
  const witness = [1, xValue, xValue * xValue]
  const witnessLabels = ['1', 'x', 'out']

  // Generate animation steps
  const animationSteps = useMemo(() => generateR1CSAnimationSteps(xValue), [xValue])

  // Animation controller
  const animation = useR1CSAnimation({
    steps: animationSteps,
  })

  // Current step data
  const currentStepData = animationSteps[animation.currentStep]

  // Compute dot products when needed
  const aDotW = useMemo(
    () => computeDotProduct(constraint.a, witness, witnessLabels),
    [constraint.a, witness, witnessLabels]
  )
  const bDotW = useMemo(
    () => computeDotProduct(constraint.b, witness, witnessLabels),
    [constraint.b, witness, witnessLabels]
  )
  const cDotW = useMemo(
    () => computeDotProduct(constraint.c, witness, witnessLabels),
    [constraint.c, witness, witnessLabels]
  )

  return (
    <div className="space-y-6">
      {/* Animation Controls - at the top */}
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

      {/* Step Title and Description */}
      <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-text-secondary">{currentStepData.description}</p>
      </div>

      {/* Main Content: Circuit + Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Circuit Mini View */}
        <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4 text-center">
            Circuit View
          </h4>
          <CircuitMiniView highlightedNodes={currentStepData.circuitHighlight} />
          <div className="mt-4 text-sm text-text-secondary text-center">
            x × x = out
          </div>
        </div>

        {/* Right: Matrices */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-text-primary text-center">
            R1CS Matrices
          </h4>

          {/* Witness Vector */}
          <WitnessVector
            labels={witnessLabels}
            values={witness}
            highlighted={
              currentStepData.matrixAHighlight !== undefined
                ? currentStepData.matrixAHighlight
                : currentStepData.matrixCHighlight
            }
          />

          {/* Three Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MatrixView
              label="A (Left)"
              values={constraint.a}
              witnessLabels={witnessLabels}
              witnessValues={witness}
              highlighted={currentStepData.matrixAHighlight}
              showDotProduct={currentStepData.showDotProducts}
              dotProductResult={currentStepData.showDotProducts ? aDotW : undefined}
              color="purple"
              visible={currentStepData.matrixAVisible}
            />

            <MatrixView
              label="B (Right)"
              values={constraint.b}
              witnessLabels={witnessLabels}
              witnessValues={witness}
              highlighted={currentStepData.matrixBHighlight}
              showDotProduct={currentStepData.showDotProducts}
              dotProductResult={currentStepData.showDotProducts ? bDotW : undefined}
              color="blue"
              visible={currentStepData.matrixBVisible}
            />

            <MatrixView
              label="C (Output)"
              values={constraint.c}
              witnessLabels={witnessLabels}
              witnessValues={witness}
              highlighted={currentStepData.matrixCHighlight}
              showDotProduct={currentStepData.showDotProducts}
              dotProductResult={currentStepData.showDotProducts ? cDotW : undefined}
              color="green"
              visible={currentStepData.matrixCVisible}
            />
          </div>
        </div>
      </div>

      {/* Constraint Equation */}
      <ConstraintEquation
        aResult={currentStepData.showDotProducts ? aDotW.result : undefined}
        bResult={currentStepData.showDotProducts ? bDotW.result : undefined}
        cResult={currentStepData.showDotProducts ? cDotW.result : undefined}
        showCheck={currentStepData.showFinalCheck}
      />
    </div>
  )
}
