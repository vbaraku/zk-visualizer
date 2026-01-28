/**
 * R1CSVisualization - Main container for R1CS transformation animation
 * 
 * Mobile: Matrices stack vertically
 * Desktop: 3-column grid
 */

import { useMemo } from 'react'
import MatrixView from './MatrixView'
import WitnessVector from './WitnessVector'
import ConstraintEquation from './ConstraintEquation'
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

  const animationSteps = useMemo(() => generateR1CSAnimationSteps(xValue), [xValue])
  const animation = useR1CSAnimation({ steps: animationSteps })
  const currentStepData = animationSteps[animation.currentStep]

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
    <div className="space-y-4 md:space-y-6">
      {/* Animation Controls - compact on mobile */}
      <div className="scale-90 origin-top-left md:scale-100">
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
      </div>

      {/* Step Title and Description */}
      <div className="bg-accent-cyan/10 border-l-4 border-accent-cyan p-3 md:p-4 rounded">
        <h3 className="text-base md:text-lg font-semibold text-text-dark-primary mb-1">
          {currentStepData.title}
        </h3>
        <p className="text-text-dark-secondary text-xs md:text-sm">{currentStepData.description}</p>
      </div>

      {/* Circuit Reminder */}
      <div className="text-center text-text-dark-secondary text-xs md:text-sm">
        Our constraint: <span className="font-mono text-text-dark-primary">x × x = out</span>
      </div>

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

      {/* Three Matrices - Stack on mobile, grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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