import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'

interface StepWitnessProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  xValue: number
  targetOutput: number
}

export default function StepWitness({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  xValue,
  targetOutput,
}: StepWitnessProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">5. The Witness</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The witness is the complete assignment of all values (public and private) that satisfy the constraints.
          It's the prover's secret knowledge.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            Assignment
          </span>
          <div className="text-md space-y-2">
            <p>Private: <span className="font-mono text-amber-600 font-bold">x = {xValue}</span> 🔒</p>
            <p>Public: <span className="font-mono text-green-600 font-bold">out = {targetOutput}</span> 🔓</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">What is a Witness?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The witness is the prover's secret knowledge. It includes all the private inputs and
          intermediate values needed to satisfy the constraints. Think of it as the "solution"
          to the puzzle that the constraints define.
        </p>

        <h3 className="text-lg font-semibold mb-3">Why "Witness"?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          It's called a witness because it "witnesses" or testifies that a valid solution exists.
          The prover uses the witness to generate the proof, but the witness itself is never
          shared with the verifier.
        </p>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2 text-text-light-secondary">"We're about to generate a proof using this witness, but the proof won't contain the value of x!"</p>
          </div>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex items-center justify-center p-12 pb-24">
          <div className="w-full max-w-2xl space-y-6">
            <div className="bg-amber-400/10 border-2 border-amber-400 p-6 rounded-xl shadow-xl">
              <p className="text-sm text-amber-400 font-bold mb-3 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span>
                Private
              </p>
              <p className="font-mono text-3xl text-text-dark-primary mb-2">x = {xValue}</p>
              <p className="text-sm text-text-dark-secondary">This value is secret and will never be revealed</p>
            </div>

            <div className="bg-green-500/10 border-2 border-green-500 p-6 rounded-xl shadow-xl">
              <p className="text-sm text-green-500 font-bold mb-3 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">lock_open</span>
                Public (Target)
              </p>
              <p className="font-mono text-3xl text-text-dark-primary mb-2">out = {targetOutput}</p>
              <p className="text-sm text-text-dark-secondary">This is the challenge value everyone knows</p>
            </div>

            <div className={`p-6 rounded-xl border-2 ${isCorrect ? 'bg-accent-cyan/10 border-accent-cyan' : 'bg-signal-error/10 border-signal-error'}`}>
              <p className={`font-bold mb-3 text-lg ${isCorrect ? 'text-accent-cyan' : 'text-signal-error'}`}>
                {isCorrect ? '✓ Witness Check:' : '✗ Witness Check:'}
              </p>
              <p className={`font-mono text-xl ${isCorrect ? 'text-accent-cyan' : 'text-signal-error'}`}>
                {xValue} × {xValue} = {userOutput} {isCorrect ? '=' : '≠'} {targetOutput}
              </p>
              <p className="text-sm mt-3 text-text-dark-secondary">
                {isCorrect
                  ? 'The witness satisfies all constraints! You can generate a valid proof.'
                  : `The witness does NOT satisfy the constraints (${userOutput} ≠ ${targetOutput}). Proof generation will fail.`}
              </p>
            </div>
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
