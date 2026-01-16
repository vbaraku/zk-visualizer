import CircuitCanvas from '../circuit/CircuitCanvas'
import { getDefaultCircuit } from '../../circuits'

interface StepCircuitProps {
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

export default function StepCircuit({
  onNext,
  onPrevious,
  targetOutput,
  xValue,
}: StepCircuitProps) {
  const circuit = getDefaultCircuit()
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  // Witness values for the circuit
  const witnessValues = {
    x: xValue,
    out: userOutput,
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 2: The Circuit
      </h2>

      {/* Info Panel */}
      <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 mb-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Arithmetic Circuit Visualization
        </h3>
        <p className="text-text-secondary">
          Watch how your value flows through the circuit! The circuit takes your
          secret input, processes it, and produces a public output.
        </p>
      </div>

      {/* React Flow Circuit Visualization */}
      <div className="mb-6">
        <div style={{ height: '400px' }}>
          <CircuitCanvas
            circuit={circuit}
            witnessValues={witnessValues}
            targetOutput={targetOutput}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 p-4 bg-surface border border-border-subtle rounded-lg">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-signal-private rounded"></div>
              <span className="text-text-secondary">Private (secret)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-signal-processing rounded"></div>
              <span className="text-text-secondary">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-signal-success rounded"></div>
              <span className="text-text-secondary">Public (correct)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-signal-error rounded"></div>
              <span className="text-text-secondary">Public (wrong)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Sections */}
      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            What is a Circuit?
          </h4>
          <p className="text-text-secondary">
            A circuit is a way to represent a computation using basic operations
            (addition, multiplication). Think of it like a flowchart for math
            operations. The animated diagram above shows exactly how values flow
            through the circuit.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Our Circuit</h4>
          <p className="text-text-secondary">
            Our circuit is simple: it takes a private input{' '}
            <code className="bg-surface px-2 py-1 rounded text-signal-private font-mono">
              x = {xValue}
            </code>
            , multiplies it by itself in the gate, and outputs{' '}
            <code className="bg-surface px-2 py-1 rounded text-text-primary font-mono">
              {userOutput}
            </code>
            .
            {isCorrect ? (
              <span className="text-signal-success font-semibold">
                {' '}
                ✓ This matches our target of {targetOutput}!
              </span>
            ) : (
              <span className="text-signal-error font-semibold">
                {' '}
                ✗ This doesn't match our target of {targetOutput}.
              </span>
            )}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            Privacy in the Circuit
          </h4>
          <p className="text-text-secondary">
            Notice how the input{' '}
            <code className="bg-surface px-2 py-1 rounded text-signal-private font-mono">
              x
            </code>{' '}
            is marked as private (🔒) while the output{' '}
            <code
              className={`bg-surface px-2 py-1 rounded ${
                isCorrect ? 'text-signal-success' : 'text-signal-error'
              } font-mono`}
            >
              out
            </code>{' '}
            is public. The zero-knowledge proof will convince verifiers that you
            know an x that produces the correct output, without revealing what x
            is!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            Circuit Code (Circom)
          </h4>
          <pre className="bg-slate-950 text-text-primary p-4 rounded-lg overflow-x-auto text-sm border border-border-subtle">
            {`template Square() {
    signal private input x;  // Your secret: ${xValue}
    signal output out;       // Public result: ${userOutput}

    out <== x * x;           // Constraint: out must equal x²
}`}
          </pre>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
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
          Next: Constraints →
        </button>
      </div>
    </div>
  )
}
