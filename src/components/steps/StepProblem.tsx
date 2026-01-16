interface StepProblemProps {
  onNext: () => void
  xValue: number
  setXValue: (value: number) => void
  targetOutput: number
}

export default function StepProblem({
  onNext,
  xValue,
  setXValue,
  targetOutput,
}: StepProblemProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 1: The Problem
      </h2>

      <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 mb-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Challenge: Prove you know x where x × x = {targetOutput}
        </h3>
        <p className="text-text-secondary">
          We want to prove that we know a secret number that, when squared,
          equals {targetOutput}.
          <strong className="text-text-primary">
            {' '}
            But we won't reveal what that number is!
          </strong>
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            What is a Zero-Knowledge Proof?
          </h4>
          <p className="text-text-secondary">
            A zero-knowledge proof lets you prove you know something without
            revealing what that something is. In our case, we can prove we know a
            number that squares to {targetOutput}, without telling anyone what
            that number is.
          </p>
        </div>

        <div
          className={`border-2 rounded-lg p-6 ${
            isCorrect
              ? 'bg-signal-private/10 border-signal-private'
              : 'bg-surface border-border-subtle'
          }`}
        >
          <h4 className="font-semibold text-text-primary mb-3">
            🎯 Your Challenge: Find x where x² = {targetOutput}
          </h4>
          <p className="text-text-secondary mb-4">
            Try to guess the secret number! Only if you know a correct answer can
            you generate a valid proof.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold text-text-primary">
              Your guess for x:
            </label>
            <input
              type="number"
              value={xValue}
              onChange={(e) => setXValue(Number(e.target.value))}
              className={`bg-surface border-2 rounded-lg px-4 py-2 font-mono text-lg w-32 text-text-primary focus:outline-none transition-colors ${
                isCorrect
                  ? 'border-signal-success focus:border-signal-success'
                  : 'border-border-subtle focus:border-accent-primary'
              }`}
            />
            <span className="text-text-secondary">
              → {xValue}² ={' '}
              <span
                className={`font-mono font-bold text-xl ${
                  isCorrect ? 'text-signal-success' : 'text-signal-error'
                }`}
              >
                {userOutput}
              </span>
              {isCorrect ? ' ✓' : ' ✗'}
            </span>
          </div>

          {isCorrect ? (
            <div className="mt-4 p-3 bg-signal-success/10 border border-signal-success rounded">
              <p className="text-signal-success font-semibold">
                ✓ Correct! You know a valid answer!
              </p>
              <p className="text-sm text-text-secondary mt-1">
                You can now generate a zero-knowledge proof that you know x where
                x² = {targetOutput}, without revealing that x = {xValue}.
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-signal-error/10 border border-signal-error rounded">
              <p className="text-signal-error font-semibold">
                ✗ Incorrect: {xValue}² = {userOutput}, not {targetOutput}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                You can proceed, but proof generation will fail because you don't
                know a valid answer. Try 3, -3, or think about what other numbers
                square to {targetOutput}!
              </p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            The Key Concept
          </h4>
          <p className="text-text-secondary">
            You can only create a valid zero-knowledge proof if you actually know
            a correct answer! This is what makes ZK proofs secure - you can't fake
            knowledge you don't have.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            What Stays Secret, What's Public
          </h4>
          <p className="text-text-secondary">
            <strong className="text-text-primary">Public:</strong> The challenge
            (x² = {targetOutput})
            <br />
            <strong className="text-text-primary">Secret:</strong> Your answer (x
            = {xValue}) - this will never be revealed in the proof!
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-accent-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Next: The Circuit →
        </button>
      </div>
    </div>
  )
}
