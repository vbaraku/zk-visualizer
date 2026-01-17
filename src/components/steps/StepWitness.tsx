import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'

interface StepWitnessProps {
  onNext: () => void
  onPrevious: () => void
  xValue: number
  targetOutput: number
}

export default function StepWitness({
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
        <h2 className="text-xl font-bold mb-4 font-serif-edu">4. The Witness</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          The witness is the complete assignment of all values (public and private) that satisfy the constraints.
          It's the prover's secret knowledge.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 handwritten bg-white px-2 border rounded-md shadow-sm text-sm">
            Assignment
          </span>
          <div className="text-md space-y-2 font-serif-edu">
            <p>Private: <span className="font-mono text-amber-600 font-bold">x = {xValue}</span> 🔒</p>
            <p>Public: <span className="font-mono text-green-600 font-bold">out = {targetOutput}</span> 🔓</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">What is a Witness?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          The witness is the prover's secret knowledge. It includes all the private inputs and
          intermediate values needed to satisfy the constraints. Think of it as the "solution"
          to the puzzle that the constraints define.
        </p>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">Why "Witness"?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          It's called a witness because it "witnesses" or testifies that a valid solution exists.
          The prover uses the witness to generate the proof, but the witness itself is never
          shared with the verifier.
        </p>

        <div className="handwritten text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2">"We're about to generate a proof using this witness, but the proof won't contain the value of x!"</p>
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
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-2xl space-y-6">
            {/* Private Witness */}
            <div className="bg-amber-400/10 border-2 border-amber-400 p-6 rounded-xl shadow-xl">
              <p className="text-sm text-amber-400 font-bold mb-3 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span>
                Private
              </p>
              <p className="font-mono text-3xl text-text-dark-primary mb-2">x = {xValue}</p>
              <p className="text-sm text-text-dark-secondary">This value is secret and will never be revealed</p>
            </div>

            {/* Public Output */}
            <div className="bg-green-500/10 border-2 border-green-500 p-6 rounded-xl shadow-xl">
              <p className="text-sm text-green-500 font-bold mb-3 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined">lock_open</span>
                Public (Target)
              </p>
              <p className="font-mono text-3xl text-text-dark-primary mb-2">out = {targetOutput}</p>
              <p className="text-sm text-text-dark-secondary">This is the challenge value everyone knows</p>
            </div>

            {/* Verification Result */}
            <div className={`p-6 rounded-xl border-2 ${
              isCorrect ? 'bg-accent-cyan/10 border-accent-cyan' : 'bg-signal-error/10 border-signal-error'
            }`}>
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
      </CanvasPanel>
    </>
  )
}
