interface StepProblemProps {
  onNext: () => void
}

export default function StepProblem({ onNext }: StepProblemProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 1: The Problem</h2>

      <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-indigo-900 mb-3">
          Claim: I know a number x such that x × x = 9
        </h3>
        <p className="text-indigo-800">
          In this example, we want to prove that we know a secret number that, when squared, equals 9.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is a Zero-Knowledge Proof?</h4>
          <p className="text-gray-600">
            A zero-knowledge proof lets you prove you know something without revealing what that something is.
            In our case, we can prove we know a number that squares to 9, without telling anyone what that number is.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">The Secret</h4>
          <p className="text-gray-600">
            Our secret number is <span className="font-mono bg-gray-100 px-2 py-1 rounded">x = 3</span>.
            We know that 3 × 3 = 9, but we want to prove this without revealing that our number is 3.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Public Information</h4>
          <p className="text-gray-600">
            The result <span className="font-mono bg-gray-100 px-2 py-1 rounded">9</span> is public.
            Everyone knows we're proving we know a square root of 9, but they won't learn which one (3 or -3).
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
