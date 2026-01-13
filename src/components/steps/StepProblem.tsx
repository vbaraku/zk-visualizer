interface StepProblemProps {
  onNext: () => void
  xValue: number
  setXValue: (value: number) => void
  targetOutput: number
}

export default function StepProblem({ onNext, xValue, setXValue, targetOutput }: StepProblemProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 1: The Problem</h2>

      <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-indigo-900 mb-3">
          Challenge: Prove you know x where x × x = {targetOutput}
        </h3>
        <p className="text-indigo-800">
          We want to prove that we know a secret number that, when squared, equals {targetOutput}.
          <strong> But we won't reveal what that number is!</strong>
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is a Zero-Knowledge Proof?</h4>
          <p className="text-gray-600">
            A zero-knowledge proof lets you prove you know something without revealing what that something is.
            In our case, we can prove we know a number that squares to {targetOutput}, without telling anyone what that number is.
          </p>
        </div>

        <div className={`border-2 rounded-lg p-6 ${isCorrect ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-300'}`}>
          <h4 className="font-semibold text-gray-900 mb-3">🎯 Your Challenge: Find x where x² = {targetOutput}</h4>
          <p className="text-gray-800 mb-4">
            Try to guess the secret number! Only if you know a correct answer can you generate a valid proof.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold text-gray-900">Your guess for x:</label>
            <input
              type="number"
              value={xValue}
              onChange={(e) => setXValue(Number(e.target.value))}
              className={`border-2 rounded-lg px-4 py-2 font-mono text-lg w-32 focus:outline-none ${
                isCorrect
                  ? 'border-green-400 focus:border-green-600 bg-green-50'
                  : 'border-gray-400 focus:border-gray-600'
              }`}
            />
            <span className="text-gray-800">
              → {xValue}² = <span className={`font-mono font-bold text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{userOutput}</span>
              {isCorrect ? ' ✓' : ' ✗'}
            </span>
          </div>

          {isCorrect ? (
            <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded">
              <p className="text-green-800 font-semibold">✓ Correct! You know a valid answer!</p>
              <p className="text-sm text-green-700 mt-1">
                You can now generate a zero-knowledge proof that you know x where x² = {targetOutput},
                without revealing that x = {xValue}.
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded">
              <p className="text-red-800 font-semibold">✗ Incorrect: {xValue}² = {userOutput}, not {targetOutput}</p>
              <p className="text-sm text-red-700 mt-1">
                You can proceed, but proof generation will fail because you don't know a valid answer.
                Try 3, -3, or think about what other numbers square to {targetOutput}!
              </p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">The Key Concept</h4>
          <p className="text-gray-600">
            You can only create a valid zero-knowledge proof if you actually know a correct answer!
            This is what makes ZK proofs secure - you can't fake knowledge you don't have.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What Stays Secret, What's Public</h4>
          <p className="text-gray-600">
            <strong>Public:</strong> The challenge (x² = {targetOutput})<br />
            <strong>Secret:</strong> Your answer (x = {xValue}) - this will never be revealed in the proof!
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
