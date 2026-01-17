import { useState } from 'react'
import { generateProof } from '../../utils/zkProof'

interface StepProofProps {
  onNext: () => void
  onPrevious: () => void
  setProofData: (data: any) => void
  xValue: number
  targetOutput: number
}

export default function StepProof({ onNext, onPrevious, setProofData, xValue, targetOutput }: StepProofProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [proofGenerated, setProofGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  const handleGenerateProof = async () => {
    // Check if the user has the correct answer
    if (!isCorrect) {
      setError(`Cannot generate proof! Your guess x = ${xValue} is incorrect (${xValue}² = ${userOutput}, not ${targetOutput}). You can only prove something if you actually know a valid answer. Go back and try 3 or -3.`)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateProof(xValue)
      setProofData(result)
      setProofGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate proof')
      console.error('Proof generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 5: Proof Generation
      </h2>

      <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 mb-6 rounded">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Creating the Zero-Knowledge Proof
        </h3>
        <p className="text-text-secondary">
          Now we use the witness to generate a cryptographic proof that we know a
          value x where x² = 9.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            What Happens During Proof Generation?
          </h4>
          <p className="text-text-secondary mb-3">
            The proving algorithm takes our witness (x = 3) and uses advanced
            cryptography to create a proof. This process involves:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
            <li>Computing polynomial evaluations based on the constraints</li>
            <li>Applying cryptographic transformations (elliptic curve operations)</li>
            <li>Creating proof elements that can be verified without revealing x</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">
            The Proof Structure
          </h4>
          <p className="text-text-secondary">
            The final proof is a collection of cryptographic values (points on an
            elliptic curve). These values prove we know a valid witness, but they
            reveal nothing about what x actually is.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Why This Works</h4>
          <p className="text-text-secondary">
            The proof system (Groth16 in this case) has a special property: it's
            computationally infeasible to create a valid proof unless you actually
            know a witness that satisfies the constraints. This is the security
            guarantee of the system.
          </p>
        </div>
      </div>

      <div className="bg-surface border-2 border-border-subtle rounded-lg p-6 mb-6">
        <div className="text-center">
          {!proofGenerated && !error && (
            <button
              onClick={handleGenerateProof}
              disabled={isGenerating}
              className="bg-accent-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-600 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed text-lg"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Proof...
                </span>
              ) : (
                'Generate Zero-Knowledge Proof'
              )}
            </button>
          )}

          {proofGenerated && (
            <div className="bg-signal-success/10 border-2 border-signal-success p-6 rounded-lg">
              <div className="text-4xl mb-3">✓</div>
              <h4 className="text-xl font-semibold text-signal-success mb-2">
                Proof Generated Successfully!
              </h4>
              <p className="text-text-secondary">
                The proof has been created. It proves we know x where x² = 9,
                without revealing that x = 3.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-signal-error/10 border-2 border-signal-error p-6 rounded-lg">
              <div className="text-4xl mb-3">⚠</div>
              <h4 className="text-xl font-semibold text-signal-error mb-2">Error</h4>
              <p className="text-text-secondary">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-surface text-text-primary border-2 border-border-subtle px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!proofGenerated}
          className="bg-accent-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors disabled:bg-surface disabled:cursor-not-allowed disabled:text-text-secondary"
        >
          Next: Verify Proof →
        </button>
      </div>
    </div>
  )
}
