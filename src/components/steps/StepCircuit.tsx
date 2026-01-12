interface StepCircuitProps {
  onNext: () => void
  onPrevious: () => void
}

export default function StepCircuit({ onNext, onPrevious }: StepCircuitProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 2: The Circuit</h2>

      <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-3">
          Arithmetic Circuit
        </h3>
        <p className="text-purple-800">
          To create a zero-knowledge proof, we need to represent our computation as a circuit.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-4 mb-2">
              <span className="text-xl font-mono font-bold">x</span>
            </div>
            <p className="text-sm text-gray-600">Private Input</p>
          </div>

          <div className="text-4xl text-gray-400">→</div>

          <div className="text-center">
            <div className="bg-blue-100 border-2 border-blue-400 rounded-lg px-6 py-4 mb-2">
              <span className="text-xl font-mono font-bold">×</span>
            </div>
            <p className="text-sm text-gray-600">Multiply</p>
          </div>

          <div className="text-4xl text-gray-400">→</div>

          <div className="text-center">
            <div className="bg-green-100 border-2 border-green-400 rounded-lg px-6 py-4 mb-2">
              <span className="text-xl font-mono font-bold">out</span>
            </div>
            <p className="text-sm text-gray-600">Public Output</p>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600">
          <code className="bg-gray-100 px-3 py-1 rounded">out = x * x</code>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is a Circuit?</h4>
          <p className="text-gray-600">
            A circuit is a way to represent a computation using basic operations (addition, multiplication).
            Think of it like a flowchart for math operations.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Our Circuit</h4>
          <p className="text-gray-600">
            Our circuit is simple: it takes a private input <code className="bg-gray-100 px-1 rounded">x</code>,
            multiplies it by itself, and outputs the result. The circuit doesn't care what x is—it just
            describes the relationship between x and the output.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Circuit Code (Circom)</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`template SquareRoot() {
    signal input x;      // Private input
    signal output out;   // Public output

    out <== x * x;       // Constraint: out equals x squared
}`}</pre>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Next: Constraints →
        </button>
      </div>
    </div>
  )
}
