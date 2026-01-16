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
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 4: The Witness
      </h2>

      <div className="bg-accent-secondary/10 border-l-4 border-accent-secondary p-6 mb-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Assignment of Values
        </h3>
        <p className="text-text-secondary">
          The witness is the complete assignment of all values (public and
          private) that satisfy the constraints.
        </p>
      </div>

      <div className="bg-surface border-2 border-border-subtle rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-text-primary mb-4">Your Witness:</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-signal-private/10 border-2 border-signal-private p-4 rounded-lg">
            <p className="text-sm text-signal-private font-semibold mb-2">
              🔒 PRIVATE
            </p>
            <p className="font-mono text-xl text-text-primary mb-1">
              x = {xValue}
            </p>
            <p className="text-sm text-text-secondary">
              This value is secret and will never be revealed
            </p>
          </div>

          <div className="bg-signal-public/10 border-2 border-signal-public p-4 rounded-lg">
            <p className="text-sm text-signal-public font-semibold mb-2">
              🔓 PUBLIC (Target)
            </p>
            <p className="font-mono text-xl text-text-primary mb-1">
              out = {targetOutput}
            </p>
            <p className="text-sm text-text-secondary">
              This is the challenge value everyone knows
            </p>
          </div>
        </div>

        <div
          className={`mt-6 p-4 rounded-lg ${
            isCorrect ? 'bg-signal-success/10' : 'bg-signal-error/10'
          }`}
        >
          <p
            className={`font-semibold mb-2 ${
              isCorrect ? 'text-signal-success' : 'text-signal-error'
            }`}
          >
            {isCorrect ? '✓ Witness Check:' : '✗ Witness Check:'}
          </p>
          <p
            className={`font-mono ${
              isCorrect ? 'text-signal-success' : 'text-signal-error'
            }`}
          >
            {xValue} × {xValue} = {userOutput}{' '}
            {isCorrect ? '=' : '≠'} {targetOutput}
          </p>
          <p
            className={`text-sm mt-2 ${
              isCorrect ? 'text-text-secondary' : 'text-signal-error'
            }`}
          >
            {isCorrect
              ? 'The witness satisfies all constraints! You can generate a valid proof.'
              : `The witness does NOT satisfy the constraints (${userOutput} ≠ ${targetOutput}). Proof generation will fail.`}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            What is a Witness?
          </h4>
          <p className="text-text-secondary">
            The witness is the prover's secret knowledge. It includes all the
            private inputs and intermediate values needed to satisfy the
            constraints. Think of it as the "solution" to the puzzle that the
            constraints define.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            Why "Witness"?
          </h4>
          <p className="text-text-secondary">
            It's called a witness because it "witnesses" or testifies that a
            valid solution exists. The prover uses the witness to generate the
            proof, but the witness itself is never shared with the verifier.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            The Magic of Zero-Knowledge
          </h4>
          <p className="text-text-secondary">
            Here's the magic: we're about to generate a proof using this witness,
            but the proof won't contain the value "3". The verifier will be
            convinced we know x, without ever learning what x is!
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-surface text-text-primary border-2 border-border-subtle px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
        >
          ← Previous: Polynomials
        </button>
        <button
          onClick={onNext}
          className="bg-accent-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Next: Generate Proof →
        </button>
      </div>
    </div>
  )
}
