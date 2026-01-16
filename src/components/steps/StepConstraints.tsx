import R1CSVisualization from '../r1cs/R1CSVisualization'

interface StepConstraintsProps {
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

export default function StepConstraints({
  onNext,
  onPrevious,
  targetOutput,
  xValue,
}: StepConstraintsProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 3: The Constraints
      </h2>

      {/* Main R1CS Visualization */}
      <R1CSVisualization xValue={xValue} targetOutput={targetOutput} />

      {/* Additional Educational Content */}
      <div className="mt-8 space-y-4">
        <div className="bg-accent-secondary/10 border-l-4 border-accent-secondary p-6 rounded">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            From Circuit to Math
          </h4>
          <p className="text-text-secondary">
            You've just seen how a circuit transforms into R1CS matrices! This transformation is
            crucial because:
          </p>
          <ul className="list-disc list-inside text-text-secondary ml-4 mt-2 space-y-1">
            <li>
              Proof systems like Groth16 work with R1CS, not circuits directly
            </li>
            <li>
              Each constraint becomes a mathematical equation that must be satisfied
            </li>
            <li>
              The witness must make ALL constraints true to create a valid proof
            </li>
          </ul>
        </div>

        <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            Your Values
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-text-secondary">Input (x):</div>
              <div className="font-mono text-xl text-signal-private font-bold">{xValue}</div>
            </div>
            <div>
              <div className="text-text-secondary">Computed (x²):</div>
              <div className="font-mono text-xl text-text-primary font-bold">{userOutput}</div>
            </div>
            <div>
              <div className="text-text-secondary">Target:</div>
              <div className="font-mono text-xl text-text-primary font-bold">{targetOutput}</div>
            </div>
            <div>
              <div className="text-text-secondary">Valid?</div>
              <div className={`text-xl font-bold ${isCorrect ? 'text-signal-success' : 'text-signal-error'}`}>
                {isCorrect ? '✓ Yes' : '✗ No'}
              </div>
            </div>
          </div>
          {!isCorrect && (
            <div className="mt-4 p-3 bg-signal-error/10 border border-signal-error rounded">
              <p className="text-signal-error text-sm">
                <strong>Note:</strong> Your witness doesn't satisfy the constraint! With x = {xValue},
                you get {userOutput} but the target is {targetOutput}. The proof will show this
                failure clearly.
              </p>
            </div>
          )}
        </div>

        <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            Next Step: The Witness
          </h4>
          <p className="text-text-secondary">
            Now that we have our constraint system, we'll look at how the witness (our actual
            values) fits into this framework. The witness contains both public and private values
            that must satisfy all constraints.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
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
          Next: Witness →
        </button>
      </div>
    </div>
  )
}
