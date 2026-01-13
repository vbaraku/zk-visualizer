interface StepWitnessProps {
  onNext: () => void
  onPrevious: () => void
  xValue: number
}

export default function StepWitness({ onNext, onPrevious, xValue }: StepWitnessProps) {
  const output = xValue * xValue
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 4: The Witness</h2>

      <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-orange-900 mb-3">
          Assignment of Values
        </h3>
        <p className="text-orange-800">
          The witness is the complete assignment of all values (public and private) that satisfy the constraints.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Our Witness:</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
            <p className="text-sm text-yellow-700 font-semibold mb-2">🔒 PRIVATE</p>
            <p className="font-mono text-xl text-yellow-900 mb-1">x = {xValue}</p>
            <p className="text-sm text-yellow-700">
              This value is secret and will never be revealed
            </p>
          </div>

          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-semibold mb-2">🔓 PUBLIC</p>
            <p className="font-mono text-xl text-green-900 mb-1">out = {output}</p>
            <p className="text-sm text-green-700">
              This value is public and known to everyone
            </p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-900 font-semibold mb-2">Verification:</p>
          <p className="font-mono text-blue-800">
            {xValue} × {xValue} = {output} ✓
          </p>
          <p className="text-sm text-blue-700 mt-2">
            The witness satisfies all constraints!
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is a Witness?</h4>
          <p className="text-gray-600">
            The witness is the prover's secret knowledge. It includes all the private inputs and
            intermediate values needed to satisfy the constraints. Think of it as the "solution" to
            the puzzle that the constraints define.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Why "Witness"?</h4>
          <p className="text-gray-600">
            It's called a witness because it "witnesses" or testifies that a valid solution exists.
            The prover uses the witness to generate the proof, but the witness itself is never
            shared with the verifier.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">The Magic of Zero-Knowledge</h4>
          <p className="text-gray-600">
            Here's the magic: we're about to generate a proof using this witness, but the proof
            won't contain the value "3". The verifier will be convinced we know x, without ever
            learning what x is!
          </p>
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
          Next: Generate Proof →
        </button>
      </div>
    </div>
  )
}
