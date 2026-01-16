import { useMemo, useState } from 'react'
import CircuitCanvas from '../circuit/CircuitCanvas'
import AnimationControls from '../circuit/AnimationControls'
import ComputationLog from '../circuit/ComputationLog'
import { getDefaultCircuit } from '../../circuits'
import { generateComputationSteps, getNodeStatesAtStep, getEdgeStatesAtStep, getWitnessAtStep } from '../../core/witness'
import { useWitnessAnimation } from '../../hooks/useWitnessAnimation'

interface StepCircuitProps {
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

export default function StepCircuit({
  onNext,
  onPrevious,
  targetOutput,
  xValue,
}: StepCircuitProps) {
  const circuit = getDefaultCircuit()
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  // Input control state
  const [inputValue, setInputValue] = useState(xValue)
  const [showAnimation, setShowAnimation] = useState(false)

  // Generate computation steps based on current input
  const computationSteps = useMemo(
    () => generateComputationSteps(circuit, { x: inputValue }),
    [circuit, inputValue]
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
      x: inputValue,
      out: inputValue * inputValue,
    }),
    [inputValue]
  )

  // Handle input value change - reset animation
  const handleInputChange = (newValue: number) => {
    setInputValue(newValue)
    animation.reset()
    setShowAnimation(false)
  }

  // Start animation
  const handleStartAnimation = () => {
    setShowAnimation(true)
    animation.reset()
    animation.play()
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 2: The Circuit
      </h2>

      {/* Info Panel */}
      <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 mb-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Arithmetic Circuit Visualization
        </h3>
        <p className="text-text-secondary">
          Watch how your value flows through the circuit! The circuit takes your
          secret input, processes it, and produces a public output.
        </p>
      </div>

      {/* Circuit Canvas and Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left/Top: Circuit Canvas (takes 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <div style={{ height: '400px' }} className="mb-4">
            <CircuitCanvas
              circuit={circuit}
              witnessValues={showAnimation ? witnessValues : completeWitnessValues}
              targetOutput={targetOutput}
              nodeStates={showAnimation ? nodeStates : undefined}
              edgeStates={showAnimation ? edgeStates : undefined}
            />
          </div>

          {/* Animation Controls */}
          {showAnimation && (
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
          )}
        </div>

        {/* Right: Computation Log and Input Controls */}
        <div className="space-y-4">
          {/* Input Controls */}
          <div className="bg-surface border-2 border-border-subtle rounded-lg p-4">
            <h4 className="font-semibold text-text-primary mb-3">Input Value</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">
                  x (private input):
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => handleInputChange(Number(e.target.value))}
                  className="w-full bg-background border-2 border-border-subtle rounded-lg px-3 py-2 text-text-primary font-mono text-lg focus:outline-none focus:border-accent-primary transition-colors"
                />
              </div>
              <div className="text-sm text-text-secondary">
                <div className="flex justify-between mb-1">
                  <span>Output (x²):</span>
                  <span className="font-mono font-bold text-text-primary">
                    {inputValue * inputValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {targetOutput}
                  </span>
                </div>
              </div>
              {!showAnimation && (
                <button
                  onClick={handleStartAnimation}
                  className="w-full bg-accent-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
                >
                  ▶ Animate Computation
                </button>
              )}
            </div>
          </div>

          {/* Computation Log */}
          {showAnimation && (
            <ComputationLog
              steps={computationSteps}
              currentStep={animation.currentStep}
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-surface border border-border-subtle rounded-lg">
        <div className="flex items-center justify-center gap-8 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-signal-private rounded"></div>
            <span className="text-text-secondary">Private (secret)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-signal-processing rounded"></div>
            <span className="text-text-secondary">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-signal-success rounded"></div>
            <span className="text-text-secondary">Public (correct)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-signal-error rounded"></div>
            <span className="text-text-secondary">Public (wrong)</span>
          </div>
        </div>
      </div>

      {/* Explanation Sections */}
      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            What is a Circuit?
          </h4>
          <p className="text-text-secondary">
            A circuit is a way to represent a computation using basic operations
            (addition, multiplication). Think of it like a flowchart for math
            operations. The animated diagram above shows exactly how values flow
            through the circuit.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Our Circuit</h4>
          <p className="text-text-secondary">
            Our circuit is simple: it takes a private input{' '}
            <code className="bg-background px-2 py-1 rounded text-signal-private font-mono border border-border-subtle">
              x = {xValue}
            </code>
            , multiplies it by itself in the gate, and outputs{' '}
            <code className="bg-background px-2 py-1 rounded text-text-primary font-mono border border-border-subtle">
              {userOutput}
            </code>
            .
            {isCorrect ? (
              <span className="text-signal-success font-semibold">
                {' '}
                ✓ This matches our target of {targetOutput}!
              </span>
            ) : (
              <span className="text-signal-error font-semibold">
                {' '}
                ✗ This doesn't match our target of {targetOutput}.
              </span>
            )}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            Privacy in the Circuit
          </h4>
          <p className="text-text-secondary">
            Notice how the input{' '}
            <code className="bg-background px-2 py-1 rounded text-signal-private font-mono border border-border-subtle">
              x
            </code>{' '}
            is marked as private (🔒) while the output{' '}
            <code
              className={`bg-background px-2 py-1 rounded ${
                isCorrect ? 'text-signal-success' : 'text-signal-error'
              } font-mono border border-border-subtle`}
            >
              out
            </code>{' '}
            is public. The zero-knowledge proof will convince verifiers that you
            know an x that produces the correct output, without revealing what x
            is!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            Circuit Code (Circom)
          </h4>
          <pre className="bg-slate-950 text-text-primary p-4 rounded-lg overflow-x-auto text-sm border border-border-subtle">
            {`template Square() {
    signal private input x;  // Your secret: ${xValue}
    signal output out;       // Public result: ${userOutput}

    out <== x * x;           // Constraint: out must equal x²
}`}
          </pre>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-surface text-text-primary border-2 border-border-subtle px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="bg-accent-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Next: Constraints →
        </button>
      </div>
    </div>
  )
}
