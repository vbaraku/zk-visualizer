import { useMemo, useState } from 'react'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'
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

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">2. The Circuit</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          A circuit is a way to represent a computation using basic operations (addition, multiplication).
          Think of it like a flowchart for math operations.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            Our Circuit
          </span>
          <div className="text-md space-y-2">
            <p>Input: <span className="text-primary font-mono">x = {xValue}</span> (private 🔒)</p>
            <p>Operation: <span className="text-primary">x × x</span></p>
            <p>Output: <span className="text-primary font-mono">out = {userOutput}</span> (public)</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Privacy in the Circuit</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Notice how the input <code className="px-2 py-1 bg-amber-100 rounded text-amber-800 font-mono text-sm">x</code> is marked as private (🔒)
          while the output <code className={`px-2 py-1 rounded font-mono text-sm ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>out</code> is public.
        </p>

        <h3 className="text-lg font-semibold mb-3">Circuit Code (Circom)</h3>
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm border border-slate-700 mb-6">
{`template Square() {
    signal private input x;
    signal output out;
    out <== x * x;
}`}
        </pre>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2 text-text-light-secondary">"The circuit defines what computation is performed, while keeping the inputs private."</p>
          </div>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex flex-col p-6 pb-24">
          {/* Animation Controls - always visible at top */}
          <div className="mb-4">
            <AnimationControls
              currentStep={animation.currentStep}
              totalSteps={animation.totalSteps}
              isPlaying={animation.isPlaying}
              speed={animation.speed}
              onPlay={() => {
                if (!showAnimation) {
                  setShowAnimation(true)
                  animation.reset()
                }
                animation.play()
              }}
              onPause={animation.pause}
              onReset={animation.reset}
              onStepForward={animation.stepForward}
              onStepBack={animation.stepBack}
              onSpeedChange={animation.setSpeed}
            />
          </div>

          {/* Input Controls Panel */}
          <div className="bg-surface border-2 border-border-subtle rounded-lg p-5 mb-4">
            <h4 className="text-sm font-semibold text-text-dark-primary mb-4">Input Controls</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-dark-secondary mb-2 block font-semibold">
                  x (private input):
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => handleInputChange(Number(e.target.value))}
                  className="w-full bg-background-dark-canvas border-2 border-border-subtle rounded-lg px-3 py-2 text-text-dark-primary font-mono text-lg focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-text-dark-secondary">
                <div className="flex justify-between">
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
            </div>
          </div>

          {/* Circuit Visualization */}
          <div className="flex-1">
            <CircuitCanvas
              circuit={circuit}
              witnessValues={showAnimation ? witnessValues : completeWitnessValues}
              targetOutput={targetOutput}
              nodeStates={showAnimation ? nodeStates : undefined}
              edgeStates={showAnimation ? edgeStates : undefined}
            />
          </div>

          {/* Computation Log - only show if animating */}
          {showAnimation && (
            <div className="mt-4 max-h-48 overflow-y-auto custom-scrollbar-dark">
              <ComputationLog
                steps={computationSteps}
                currentStep={animation.currentStep}
              />
            </div>
          )}
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
