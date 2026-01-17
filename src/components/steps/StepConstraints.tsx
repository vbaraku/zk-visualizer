import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'
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
  currentStepIndex,
  totalSteps,
  stepName,
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
        <h2 className="text-xl font-bold mb-4">3. R1CS Constraints</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The circuit transforms into R1CS (Rank-1 Constraint System) matrices.
          This is crucial because proof systems like Groth16 work with R1CS, not circuits directly.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            From Circuit to Math
          </span>
          <div className="text-md space-y-2">
            <p>• Each gate becomes a mathematical equation</p>
            <p>• The witness must make ALL constraints true</p>
            <p>• Represented as matrix multiplication: A × B = C</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Your Values</h3>
        <div className="space-y-2 text-sm mb-6">
          <p>Input (x): <span className="font-mono text-primary font-bold">{xValue}</span></p>
          <p>Computed (x²): <span className="font-mono font-bold">{userOutput}</span></p>
          <p>Target: <span className="font-mono font-bold">{targetOutput}</span></p>
          <p>Valid? <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{isCorrect ? '✓ Yes' : '✗ No'}</span></p>
        </div>

        {!isCorrect && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">
              <strong>Note:</strong> Your witness doesn't satisfy the constraint! With x = {xValue},
              you get {userOutput} but the target is {targetOutput}.
            </p>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-3">Understanding R1CS</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          R1CS (Rank-1 Constraint System) is a mathematical representation where each constraint
          is expressed as a product of two linear combinations equaling a third. This form is
          essential for zero-knowledge proof systems to work efficiently.
        </p>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2 text-text-light-secondary">"The witness contains both public and private values that must satisfy all constraints."</p>
          </div>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 p-6">
          <R1CSVisualization xValue={xValue} targetOutput={targetOutput} />
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
