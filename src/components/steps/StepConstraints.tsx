import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import R1CSVisualization from '../r1cs/R1CSVisualization'

interface StepConstraintsProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

export default function StepConstraints({
  currentStepIndex: _currentStepIndex,
  totalSteps: _totalSteps,
  stepName: _stepName,
  onNext,
  onPrevious,
  targetOutput,
  xValue,
}: StepConstraintsProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4 font-serif-edu">3. R1CS Constraints</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          The circuit transforms into R1CS (Rank-1 Constraint System) matrices.
          This is crucial because proof systems like Groth16 work with R1CS, not circuits directly.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 handwritten bg-white px-2 border rounded-md shadow-sm text-sm">
            From Circuit to Math
          </span>
          <div className="text-md space-y-2 font-serif-edu">
            <p>• Each gate becomes a mathematical equation</p>
            <p>• The witness must make ALL constraints true</p>
            <p>• Represented as matrix multiplication: A × B = C</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">Your Values</h3>
        <div className="space-y-2 text-sm font-serif-edu mb-6">
          <p>Input (x): <span className="font-mono text-primary font-bold">{xValue}</span></p>
          <p>Computed (x²): <span className="font-mono font-bold">{userOutput}</span></p>
          <p>Target: <span className="font-mono font-bold">{targetOutput}</span></p>
          <p>Valid? <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{isCorrect ? '✓ Yes' : '✗ No'}</span></p>
        </div>

        {!isCorrect && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm font-serif-edu">
              <strong>Note:</strong> Your witness doesn't satisfy the constraint! With x = {xValue},
              you get {userOutput} but the target is {targetOutput}.
            </p>
          </div>
        )}

        <div className="handwritten text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2">"The witness contains both public and private values that must satisfy all constraints."</p>
          </div>
        </div>

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
        <div className="flex-1 p-6">
          <R1CSVisualization xValue={xValue} targetOutput={targetOutput} />
        </div>
      </CanvasPanel>
    </>
  )
}
