import { useMemo, useState } from 'react'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'
import CircuitCanvas from '../circuit/CircuitCanvas'
import AnimationControls from '../circuit/AnimationControls'
import ComputationLog from '../circuit/ComputationLog'
import { getDefaultCircuit } from '../../circuits'
import {
  generateComputationSteps,
  getNodeStatesAtStep,
  getEdgeStatesAtStep,
  getWitnessAtStep,
} from '../../core/witness'
import { useWitnessAnimation } from '../../hooks/useWitnessAnimation'

interface StepCircuitProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

export default function StepCircuit({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  targetOutput,
  xValue,
}: StepCircuitProps) {
  const circuit = getDefaultCircuit()
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  // Animation state
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false)

  // Generate computation steps based on xValue from props (not editable here)
  const computationSteps = useMemo(
    () => generateComputationSteps(circuit, { x: xValue }),
    [circuit, xValue]
  )

  // Animation controller
  const animation = useWitnessAnimation({
    steps: computationSteps,
  })

  // Get all node IDs and edge IDs for state calculation
  const allNodeIds = useMemo(() => ['x', 'mul1', 'out'], [])
  const allEdgeIds = useMemo(() => ['x-mul1-0', 'x-mul1-1', 'mul1-out'], [])

  // Calculate node and edge states based on current animation step
  const nodeStates = useMemo(
    () => getNodeStatesAtStep(computationSteps, animation.currentStep, allNodeIds),
    [computationSteps, animation.currentStep, allNodeIds]
  )

  const edgeStates = useMemo(
    () => getEdgeStatesAtStep(computationSteps, animation.currentStep, allEdgeIds),
    [computationSteps, animation.currentStep, allEdgeIds]
  )

  // Get witness values at current step
  const witnessValues = useMemo(
    () => getWitnessAtStep(computationSteps, animation.currentStep),
    [computationSteps, animation.currentStep]
  )

  // Complete witness values (for final state)
  const completeWitnessValues = useMemo(
    () => ({
      x: xValue,
      out: xValue * xValue,
    }),
    [xValue]
  )

  // Initial state: show "?" for values that haven't been computed
  const initialWitnessValues = useMemo(
    () => ({
      x: xValue, // Input is known
    }),
    [xValue]
  )

  // Handle play - track that animation has started
  const handlePlay = () => {
    setHasStartedAnimation(true)
    animation.play()
  }

  // Handle reset
  const handleReset = () => {
    setHasStartedAnimation(false)
    animation.reset()
  }

  // Determine which witness values to show
  const displayWitnessValues = useMemo(() => {
    if (!hasStartedAnimation) {
      // Before animation: show input, output as "?"
      return initialWitnessValues
    }
    if (animation.currentStep >= computationSteps.length - 1) {
      // Animation complete: show final values
      return completeWitnessValues
    }
    // During animation: show current step values
    return witnessValues
  }, [
    hasStartedAnimation,
    animation.currentStep,
    computationSteps.length,
    initialWitnessValues,
    completeWitnessValues,
    witnessValues,
  ])

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">2. The Circuit</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          A circuit is a way to represent a computation using basic operations (addition,
          multiplication). Think of it like a flowchart for math operations.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            Our Circuit
          </span>
          <div className="text-md space-y-2 font-mono">
            <p>
              Input: <span className="text-amber-600">x = {xValue}</span> (private 🔒)
            </p>
            <p>
              Operation: <span className="text-primary">x × x</span>
            </p>
            <p>
              Output: <span className="text-green-600">out = {userOutput}</span> (public)
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">How Circuits Work</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Values flow through the circuit from inputs to outputs. Each gate performs an operation.
          Press <strong>Play</strong> to watch the computation happen step by step.
        </p>

        <h3 className="text-lg font-semibold mb-3">Circuit Code (Circom)</h3>
        <div className="bg-slate-900 p-4 rounded-lg mb-6 overflow-x-auto">
          <pre className="text-sm text-slate-300 font-mono">
            <code>
              <span className="text-purple-400">template</span>{' '}
              <span className="text-yellow-300">Square</span>() {'{'}
              {'\n'}
              {'    '}
              <span className="text-purple-400">signal</span>{' '}
              <span className="text-blue-400">private</span>{' '}
              <span className="text-purple-400">input</span> x;
              <span className="text-slate-500"> // Your secret</span>
              {'\n'}
              {'    '}
              <span className="text-purple-400">signal</span>{' '}
              <span className="text-purple-400">output</span> out;
              <span className="text-slate-500"> // Public result</span>
              {'\n'}
              {'    '}out <span className="text-cyan-400">{'<==='}</span> x * x;
              <span className="text-slate-500"> // Constraint + assignment</span>
              {'\n'}
              {'}'}
            </code>
          </pre>
        </div>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <p className="text-text-light-secondary">
            "The circuit defines <em>what</em> computation is performed, while keeping the inputs
            private."
          </p>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex flex-col p-6 pb-24">
          {/* Animation Controls */}
          <div className="mb-4">
            <AnimationControls
              currentStep={animation.currentStep}
              totalSteps={animation.totalSteps}
              isPlaying={animation.isPlaying}
              speed={animation.speed}
              onPlay={handlePlay}
              onPause={animation.pause}
              onReset={handleReset}
              onStepForward={() => {
                setHasStartedAnimation(true)
                animation.stepForward()
              }}
              onStepBack={animation.stepBack}
              onSpeedChange={animation.setSpeed}
            />
          </div>

          {/* Context Bar - shows current values (read-only) */}
          <div className="bg-surface border-2 border-border-subtle rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">🔒</span>
                  <span className="text-text-dark-secondary">Private input:</span>
                  <span className="font-mono font-bold text-amber-400">x = {xValue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">👁️</span>
                  <span className="text-text-dark-secondary">Target output:</span>
                  <span className="font-mono font-bold text-green-400">out = {targetOutput}</span>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isCorrect
                    ? 'bg-accent-cyan/20 text-accent-cyan'
                    : 'bg-signal-error/20 text-signal-error'
                }`}
              >
                {isCorrect ? '✓ Valid' : '✗ Invalid'}
              </div>
            </div>
          </div>

          {/* Circuit Visualization - main hero */}
          <div className="flex-1 overflow-y-auto custom-scrollbar-dark min-h-[300px]">
            <CircuitCanvas
              circuit={circuit}
              witnessValues={displayWitnessValues}
              targetOutput={targetOutput}
              nodeStates={hasStartedAnimation ? nodeStates : undefined}
              edgeStates={hasStartedAnimation ? edgeStates : undefined}
            />
          </div>

          {/* Computation Log - always visible */}
          <div className="mt-4 bg-surface border-2 border-border-subtle rounded-lg p-4">
            {!hasStartedAnimation ? (
              <p className="text-text-dark-secondary text-sm">
                Press <strong>Play</strong> to watch values flow through the circuit...
              </p>
            ) : (
              <ComputationLog steps={computationSteps} currentStep={animation.currentStep} />
            )}
          </div>
        </div>

        <BottomControlBar
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          stepName={stepName}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </CanvasPanel>
    </>
  )
}