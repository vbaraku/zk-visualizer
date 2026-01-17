import { useState } from 'react'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
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
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4 font-serif-edu">5. Proof Generation</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          Now we use the witness to generate a cryptographic proof that we know a value x where x² = {targetOutput}.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 handwritten bg-white px-2 border rounded-md shadow-sm text-sm">
            What Happens?
          </span>
          <div className="text-md space-y-2 font-serif-edu">
            <p>• Computing polynomial evaluations</p>
            <p>• Applying cryptographic transformations</p>
            <p>• Creating verifiable proof elements</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">The Proof Structure</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          The final proof is a collection of cryptographic values (points on an elliptic curve).
          These values prove we know a valid witness, but they reveal nothing about what x actually is.
        </p>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">Why This Works</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          The proof system (Groth16 in this case) has a special property: it's computationally
          infeasible to create a valid proof unless you actually know a witness that satisfies
          the constraints. This is the security guarantee of the system.
        </p>

        <div className="handwritten text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2">"The proof proves knowledge without revealing the knowledge itself."</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-text-light-primary hover:bg-gray-100 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Previous</span>
          </button>
          <button
            onClick={onNext}
            disabled={!proofGenerated}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next Step</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-2xl text-center">
            {!proofGenerated && !error && (
              <div className="bg-surface rounded-xl shadow-2xl border border-dark-border p-12">
                <div className="mb-8">
                  <span className="material-symbols-outlined text-accent-cyan text-6xl">verified_user</span>
                </div>
                <h3 className="text-2xl font-bold text-text-dark-primary mb-4">Ready to Generate Proof</h3>
                <p className="text-text-dark-secondary mb-8">
                  Click below to create a zero-knowledge proof for x² = {targetOutput}
                </p>
                <button
                  onClick={handleGenerateProof}
                  disabled={isGenerating}
                  className="bg-accent-cyan text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3 mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Proof...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">play_circle</span>
                      Generate Zero-Knowledge Proof
                    </>
                  )}
                </button>
              </div>
            )}

            {proofGenerated && (
              <div className="bg-accent-cyan/10 border-2 border-accent-cyan p-12 rounded-xl shadow-2xl glow-cyan">
                <div className="text-6xl mb-6">✓</div>
                <h3 className="text-3xl font-bold text-accent-cyan mb-4">Proof Generated Successfully!</h3>
                <p className="text-text-dark-secondary text-lg">
                  The proof has been created. It proves we know x where x² = {targetOutput}, without revealing that x = {xValue}.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-signal-error/10 border-2 border-signal-error p-12 rounded-xl shadow-2xl">
                <div className="text-6xl mb-6">⚠</div>
                <h3 className="text-3xl font-bold text-signal-error mb-4">Error</h3>
                <p className="text-text-dark-secondary">{error}</p>
              </div>
            )}
          </div>
        </div>
      </CanvasPanel>
    </>
  )
}
