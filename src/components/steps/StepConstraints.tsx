interface StepConstraintsProps {
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
}

export default function StepConstraints({ onNext, onPrevious }: StepConstraintsProps) {
  // Constraints explain the rules for proving x² = 9 (fixed target)
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 3: The Constraints</h2>

      <div className="bg-pink-50 border-l-4 border-pink-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-pink-900 mb-3">
          Mathematical Constraints
        </h3>
        <p className="text-pink-800">
          Constraints are mathematical rules that the inputs and outputs must satisfy.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Our Constraint System:</h4>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-mono text-lg text-blue-900">
              Constraint 1: out = x * x
            </p>
            <p className="text-sm text-blue-700 mt-2">
              The output must equal x multiplied by itself
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-mono text-lg text-green-900">
              Public Input: out = 9
            </p>
            <p className="text-sm text-green-700 mt-2">
              The output is publicly known to be 9
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What Are Constraints?</h4>
          <p className="text-gray-600">
            Constraints are like equations that must be true. In a zero-knowledge proof system,
            we convert our computation into a set of polynomial equations. If someone can provide
            values that satisfy all these equations, they've proven they know a valid solution.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Why Constraints Matter</h4>
          <p className="text-gray-600">
            These constraints ensure that the prover can't cheat. They can only create a valid proof
            if they actually know a value of x that, when squared, equals 9. The math makes it
            impossible to fake.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Example</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">If x = 3:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>3 × 3 = 9 ✓ (Constraint satisfied!)</li>
              <li>out = 9 ✓ (Matches public input!)</li>
            </ul>
            <p className="text-green-600 mt-3 font-semibold">All constraints are satisfied!</p>
          </div>
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
          Next: Witness →
        </button>
      </div>
    </div>
  )
}
