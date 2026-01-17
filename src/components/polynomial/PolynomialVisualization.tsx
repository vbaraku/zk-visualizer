/**
 * PolynomialVisualization - Main container for polynomial/QAP visualization
 *
 * Orchestrates animation steps showing R1CS → QAP transformation
 */

import { useMemo, useState } from 'react'
import { usePolynomialAnimation } from '../../hooks/usePolynomialAnimation'
import { generatePolynomialAnimationSteps, generateSquareCircuitQAP } from '../../core/qap'
import { evaluate } from '../../core/polynomial'
import AnimationControls from '../circuit/AnimationControls'
import PolynomialPlot from './PolynomialPlot'
import ScalingProblemDemo from './ScalingProblemDemo'
import InterpolationAnimator from './InterpolationAnimator'
import QAPEquation from './QAPEquation'
import EvaluationSlider from './EvaluationSlider'
import RandomCheckDemo from './RandomCheckDemo'

interface PolynomialVisualizationProps {
  xValue: number
}

export default function PolynomialVisualization({ xValue }: PolynomialVisualizationProps) {
  const [evaluationPoint, setEvaluationPoint] = useState(5.7)

  // Generate animation steps
  const animationSteps = useMemo(() => generatePolynomialAnimationSteps(xValue), [xValue])

  // Animation controller
  const animation = usePolynomialAnimation({ steps: animationSteps })

  // Current step data
  const currentStep = animationSteps[animation.currentStep]

  // QAP data
  const qap = useMemo(() => generateSquareCircuitQAP(xValue), [xValue])

  // Render content based on current phase
  const renderPhaseContent = () => {
    switch (currentStep.phase) {
      case 'scaling-problem':
        return <ScalingProblemDemo />

      case 'r1cs-to-points':
        return (
          <div className="space-y-6">
            <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                From R1CS to Evaluation Points
              </h3>
              <p className="text-text-secondary mb-4">
                Our single constraint (x × x = out) becomes an evaluation point where our
                polynomials must encode the constraint.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                {currentStep.evaluationPoints?.map((point) => (
                  <div key={point.x} className="p-4 bg-surface-subtle rounded">
                    <div className="text-text-secondary text-sm mb-2">{point.label}</div>
                    <div className="text-xl font-semibold text-text-primary">
                      x = {point.x}
                    </div>
                    {point.values && (
                      <div className="mt-3 space-y-1 text-xs">
                        {Object.entries(point.values).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-text-secondary">{key}(1):</span>
                            <span className="text-text-primary font-mono">{value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'interpolation':
        return (
          <div className="space-y-6">
            {currentStep.polynomials.length > 0 && (
              <PolynomialPlot
                polynomials={currentStep.polynomials}
                evaluationPoints={currentStep.evaluationPoints}
                xRange={[-1, 5]}
              />
            )}

            {currentStep.showInterpolation && currentStep.evaluationPoints && (
              <InterpolationAnimator
                points={currentStep.evaluationPoints.map((p) => ({
                  x: p.x,
                  y: currentStep.polynomials[0]
                    ? evaluate(currentStep.polynomials[0].coefficients, p.x)
                    : 0,
                  label: p.label,
                }))}
                showCurve={true}
                color={currentStep.polynomials[0]?.color}
              />
            )}
          </div>
        )

      case 'qap-identity':
        return (
          <div className="space-y-6">
            <PolynomialPlot
              polynomials={currentStep.polynomials}
              evaluationPoints={currentStep.evaluationPoints}
              highlightPoint={currentStep.highlightPoint}
              xRange={[-1, 5]}
              yRange={[-5, 5]}
            />

            {currentStep.showEquation && (
              <QAPEquation
                aValue={evaluate(qap.A, 1)}
                bValue={evaluate(qap.B, 1)}
                cValue={evaluate(qap.C, 1)}
                hValue={evaluate(qap.H, 1)}
                zValue={evaluate(qap.Z, 1)}
                xPoint={1}
                showCheck={true}
              />
            )}
          </div>
        )

      case 'random-check':
        return (
          <div className="space-y-6">
            <PolynomialPlot
              polynomials={currentStep.polynomials}
              highlightPoint={evaluationPoint}
              xRange={[-1, 10]}
              yRange={[-10, 10]}
            />

            <EvaluationSlider
              polynomials={currentStep.polynomials}
              min={-1}
              max={10}
              defaultValue={evaluationPoint}
              onChange={setEvaluationPoint}
            />

            {currentStep.showEquation && (
              <QAPEquation
                aValue={evaluate(qap.A, evaluationPoint)}
                bValue={evaluate(qap.B, evaluationPoint)}
                cValue={evaluate(qap.C, evaluationPoint)}
                hValue={evaluate(qap.H, evaluationPoint)}
                zValue={evaluate(qap.Z, evaluationPoint)}
                xPoint={evaluationPoint}
                showCheck={true}
              />
            )}

            <RandomCheckDemo />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Step title and description */}
      <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{currentStep.title}</h3>
        <p className="text-text-secondary">{currentStep.description}</p>
      </div>

      {/* Phase-specific content */}
      {renderPhaseContent()}

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

      {/* Educational notes */}
      <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-3">
          Understanding Polynomial Proofs
        </h4>
        <div className="space-y-3 text-text-secondary text-sm">
          <p>
            <strong className="text-text-primary">Why Polynomials?</strong> They give us a magical
            property called the <em>Schwartz-Zippel lemma</em>: different polynomials rarely agree
            at random points.
          </p>
          <p>
            <strong className="text-text-primary">The Key Insight:</strong> Instead of checking ALL
            constraints individually, we encode them into polynomials and check ONE equation at ONE
            random point.
          </p>
          <p>
            <strong className="text-text-primary">QAP (Quadratic Arithmetic Program):</strong> The
            transformation from R1CS constraints to polynomial form. The equation A(x)·B(x) - C(x) =
            H(x)·Z(x) must hold for all constraint evaluation points.
          </p>
          <p>
            <strong className="text-text-primary">Succinctness:</strong> This is what makes ZK
            proofs SUCCINCT — constant-size proofs regardless of circuit complexity!
          </p>
        </div>
      </div>
    </div>
  )
}
