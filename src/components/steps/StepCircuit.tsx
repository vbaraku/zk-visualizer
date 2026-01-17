import { useMemo, useState } from 'react'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import CircuitCanvas from '../circuit/CircuitCanvas'
import AnimationControls from '../circuit/AnimationControls'
import ComputationLog from '../circuit/ComputationLog'
import { getDefaultCircuit } from '../../circuits'
import { generateComputationSteps, getNodeStatesAtStep, getEdgeStatesAtStep, getWitnessAtStep } from '../../core/witness'
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
  currentStepIndex: _currentStepIndex,
  totalSteps: _totalSteps,
  stepName: _stepName,
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
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4 font-serif-edu">2. The Arithmetic Circuit</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          A circuit is a way to represent a computation using basic operations (addition, multiplication).
          Think of it like a flowchart for math operations. The visualization shows exactly how values flow through the circuit.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 handwritten bg-white px-2 border rounded-md shadow-sm text-sm">
            Our Circuit
          </span>
          <div className="text-md space-y-2 font-serif-edu">
            <p>Input: <span className="text-primary font-mono">x = {xValue}</span> (private 🔒)</p>
            <p>Operation: <span className="text-primary">x × x</span></p>
            <p>Output: <span className="text-primary font-mono">out = {userOutput}</span> (public)</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">Privacy in the Circuit</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          Notice how the input <code className="px-2 py-1 bg-amber-100 rounded text-amber-800 font-mono text-sm">x</code> is marked as private (🔒)
          while the output <code className={`px-2 py-1 rounded font-mono text-sm ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>out</code> is public.
          The zero-knowledge proof will convince verifiers that you know an x that produces the correct output,
          without revealing what x is!
        </p>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">Circuit Code (Circom)</h3>
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm border border-slate-700 mb-6">
{`template Square() {
    signal private input x;  // Secret: ${xValue}
    signal output out;       // Public: ${userOutput}

    out <== x * x;           // Constraint
}`}
        </pre>

        <div className="handwritten text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2">"The circuit defines <em>what</em> computation is performed, while keeping the inputs private."</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-text-light-primary hover:bg-gray-100 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Previous</span>
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
          >
            <span>Next Step</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex flex-col p-6">
          {/* Circuit Visualization */}
          <div className="flex-1 mb-4">
            <CircuitCanvas
              circuit={circuit}
              witnessValues={showAnimation ? witnessValues : completeWitnessValues}
              targetOutput={targetOutput}
              nodeStates={showAnimation ? nodeStates : undefined}
              edgeStates={showAnimation ? edgeStates : undefined}
            />
          </div>

          {/* Animation Controls (when animated) */}
          {showAnimation && (
            <div className="mb-4">
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
          )}
        </div>

        {/* Right Side Panel - Controls */}
        <div className="absolute top-6 right-6 w-80 space-y-4">
          {/* Input Controls */}
          <div className="bg-surface border border-dark-border rounded-xl p-4 shadow-xl">
            <h4 className="font-semibold text-text-dark-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-cyan text-sm">tune</span>
              Input Controls
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-dark-secondary mb-1 block uppercase font-bold">
                  x (private input):
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => handleInputChange(Number(e.target.value))}
                  className="w-full bg-slate-900/80 border-2 border-dark-border rounded-lg px-3 py-2 text-text-dark-primary font-mono text-lg focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              <div className="text-sm text-text-dark-secondary">
                <div className="flex justify-between mb-1">
                  <span>Output (x²):</span>
                  <span className="font-mono font-bold text-text-dark-primary">
                    {inputValue * inputValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-mono font-bold text-text-dark-primary">
                    {targetOutput}
                  </span>
                </div>
              </div>
              {!showAnimation && (
                <button
                  onClick={handleStartAnimation}
                  className="w-full bg-accent-cyan text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-accent-cyan/90 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  Animate Computation
                </button>
              )}
            </div>
          </div>

          {/* Computation Log */}
          {showAnimation && (
            <div className="bg-surface border border-dark-border rounded-xl p-4 shadow-xl max-h-96 overflow-y-auto custom-scrollbar-dark">
              <ComputationLog
                steps={computationSteps}
                currentStep={animation.currentStep}
              />
            </div>
          )}

          {/* Legend */}
          <div className="bg-surface border border-dark-border rounded-xl p-4 shadow-xl">
            <h5 className="text-xs font-bold text-text-dark-secondary uppercase mb-3">Legend</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-signal-private rounded"></div>
                <span className="text-text-dark-secondary">Private (secret)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-signal-processing rounded"></div>
                <span className="text-text-dark-secondary">Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-signal-success rounded"></div>
                <span className="text-text-dark-secondary">Public (correct)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-signal-error rounded"></div>
                <span className="text-text-dark-secondary">Public (wrong)</span>
              </div>
            </div>
          </div>
        </div>
      </CanvasPanel>
    </>
  )
}
