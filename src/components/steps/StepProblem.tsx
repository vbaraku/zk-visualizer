interface StepProblemProps {
  onNext: () => void
  xValue: number
  setXValue: (value: number) => void
}

export default function StepProblem({ onNext, xValue, setXValue }: StepProblemProps) {
  const output = xValue * xValue

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 1: The Problem</h2>

      <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-indigo-900 mb-3">
          Claim: I know a number x such that x × x = {output}
        </h3>
        <p className="text-indigo-800">
          In this example, we want to prove that we know a secret number that, when squared, equals {output}.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is a Zero-Knowledge Proof?</h4>
          <p className="text-gray-600">
            A zero-knowledge proof lets you prove you know something without revealing what that something is.
            In our case, we can prove we know a number that squares to {output}, without telling anyone what that number is.
          </p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-3">Try It Yourself!</h4>
          <p className="text-yellow-800 mb-4">
            Choose a secret number to use for the proof:
          </p>
          <div className="flex items-center gap-4">
            <label className="font-semibold text-yellow-900">Secret value x:</label>
            <input
              type="number"
              value={xValue}
              onChange={(e) => setXValue(Number(e.target.value))}
              className="border-2 border-yellow-400 rounded-lg px-4 py-2 font-mono text-lg w-32 focus:outline-none focus:border-yellow-600"
            />
            <span className="text-yellow-800">
              → x² = <span className="font-mono font-bold text-xl">{output}</span>
            </span>
          </div>
          <p className="text-sm text-yellow-700 mt-3">
            Try values like 3, -3, 4, or 5. You'll see if the proof succeeds or fails!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">The Secret</h4>
          <p className="text-gray-600">
            Our secret number is <span className="font-mono bg-gray-100 px-2 py-1 rounded">x = {xValue}</span>.
            We know that {xValue} × {xValue} = {output}, but we want to prove this without revealing that our number is {xValue}.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Public Information</h4>
          <p className="text-gray-600">
            The result <span className="font-mono bg-gray-100 px-2 py-1 rounded">{output}</span> is public.
            Everyone knows we're proving we know a square root of {output}, but they won't learn the actual value.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Next: The Circuit →
        </button>
      </div>
    </div>
  )
}
