import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'

interface StepProblemProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  xValue: number
  setXValue: (value: number) => void
  targetOutput: number
}

export default function StepProblem({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  xValue,
  setXValue,
  targetOutput,
}: StepProblemProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">1. The Problem Statement</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Zero-knowledge proofs allow you to prove you know something <span className="font-bold text-text-light-primary">without revealing what that something is</span>.
          In this example, we'll prove we know a value x such that x² = {targetOutput}.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            Challenge
          </span>
          <div className="text-lg space-y-2">
            <p>Prove you know <span className="text-primary font-semibold">x</span> where</p>
            <p className="text-2xl text-center my-4">x × x = {targetOutput}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">What is a Zero-Knowledge Proof?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          A zero-knowledge proof lets you prove you know something without revealing what that something is.
          In our case, we can prove we know a number that squares to {targetOutput}, without telling anyone what that number is.
        </p>

        <h3 className="text-lg font-semibold mb-3">The Key Concept</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          You can only create a valid zero-knowledge proof if you actually know a correct answer!
          This is what makes ZK proofs secure - you can't fake knowledge you don't have.
        </p>

        <h3 className="text-lg font-semibold mb-3">What Stays Secret, What's Public</h3>
        <div className="text-text-light-secondary text-md leading-relaxed mb-6">
          <p><strong className="text-text-light-primary">Public:</strong> The challenge (x² = {targetOutput})</p>
          <p><strong className="text-text-light-primary">Secret:</strong> Your answer (x = {xValue}) - this will never be revealed in the proof!</p>
        </div>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2 text-text-light-secondary">"This is the foundation of zero-knowledge: proving knowledge without revealing the knowledge itself."</p>
          </div>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex items-center justify-center p-12 pb-24">
          <div className="w-full max-w-2xl">
            <div className={`bg-surface rounded-xl shadow-2xl border border-dark-border p-8 ${isCorrect ? 'glow-cyan' : ''}`}>
              <h3 className="text-xl font-bold text-text-dark-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-cyan">target</span>
                Your Challenge: Find x where x² = {targetOutput}
              </h3>

              <p className="text-text-dark-secondary mb-6">
                Try to guess the secret number! Only if you know a correct answer can you generate a valid proof.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="font-semibold text-text-dark-primary">Your guess for x:</label>
                  <input
                    type="number"
                    value={xValue}
                    onChange={(e) => setXValue(Number(e.target.value))}
                    className={`bg-slate-900/80 border-2 rounded-lg px-4 py-2 font-mono text-lg w-32 text-text-dark-primary focus:outline-none transition-colors ${isCorrect ? 'border-accent-cyan focus:border-accent-cyan' : 'border-dark-border focus:border-accent-cyan'}`}
                  />
                  <span className="text-text-dark-secondary">
                    → {xValue}² = <span className={`font-mono font-bold text-xl ${isCorrect ? 'text-accent-cyan' : 'text-signal-error'}`}>{userOutput}</span>
                    {isCorrect ? ' ✓' : ' ✗'}
                  </span>
                </div>
              </div>

              {isCorrect ? (
                <div className="mt-4 p-4 bg-accent-cyan/10 border border-accent-cyan rounded-lg">
                  <p className="text-accent-cyan font-semibold">✓ Correct! You know a valid answer!</p>
                  <p className="text-sm text-text-dark-secondary mt-2">
                    You can now generate a zero-knowledge proof that you know x where x² = {targetOutput}, without revealing that x = {xValue}.
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-signal-error/10 border border-signal-error rounded-lg">
                  <p className="text-signal-error font-semibold">✗ Incorrect: {xValue}² = {userOutput}, not {targetOutput}</p>
                  <p className="text-sm text-text-dark-secondary mt-2">
                    You can proceed, but proof generation will fail because you don't know a valid answer. Try 3, -3, or think about what other numbers square to {targetOutput}!
                  </p>
                </div>
              )}
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
