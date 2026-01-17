import { useState } from 'react'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'
import { verifyProof } from '../../utils/zkProof'

interface StepVerificationProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onPrevious: () => void
  proofData: any
  xValue: number
  targetOutput: number
}

export default function StepVerification({ currentStepIndex, totalSteps, stepName, onPrevious, proofData, xValue: _xValue, targetOutput }: StepVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTampered, setIsTampered] = useState(false)

  const handleVerify = async (tamper: boolean = false) => {
    if (!proofData) {
      setError('No proof data available')
      return
    }

    setIsVerifying(true)
    setError(null)
    setIsTampered(tamper)

    try {
      let dataToVerify = proofData

      if (tamper) {
        const wrongOutput = targetOutput + 1
        dataToVerify = {
          ...proofData,
          publicSignals: [wrongOutput.toString()]
        }
      }

      const result = await verifyProof(dataToVerify)
      setVerificationResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify proof')
      console.error('Verification error:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">7. Verification</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The verifier can now check the proof without learning anything about the secret value x.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            What the Verifier Knows
          </span>
          <div className="text-sm space-y-2">
            <p>• The challenge: x² = {targetOutput}</p>
            <p>• The circuit structure</p>
            <p>• The cryptographic proof</p>
          </div>
        </div>

        <div className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-600 mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            What the Verifier Does NOT Know
          </span>
          <div className="text-sm space-y-2">
            <p>🔒 The private input: x = ???</p>
            <p>🔒 Whether x is 3 or -3</p>
            <p>🔒 Any other prover knowledge</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">How Verification Works</h3>
        <p className="text-text-light-secondary text-sm leading-relaxed mb-6">
          The verifier performs cryptographic checks on the proof using elliptic curve pairings.
          These checks confirm the proof is valid WITHOUT revealing the secret value x.
        </p>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2 text-text-light-secondary">"The verifier learns NOTHING except that the prover knows a valid answer!"</p>
          </div>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex items-center justify-center p-12 pb-24">
          <div className="w-full max-w-2xl space-y-6">
            {!verificationResult && verificationResult !== false && (
              <div className="bg-surface rounded-xl shadow-2xl border border-dark-border p-12 text-center">
                <div className="mb-8">
                  <span className="material-symbols-outlined text-accent-cyan text-6xl">verified</span>
                </div>
                <h3 className="text-2xl font-bold text-text-dark-primary mb-4">Ready to Verify</h3>
                <p className="text-text-dark-secondary mb-8">
                  Verify that the proof is valid without learning what x is.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => handleVerify(false)}
                    disabled={isVerifying || !proofData}
                    className="w-full bg-accent-cyan text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3"
                  >
                    {isVerifying ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">check_circle</span>
                        Verify Proof
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleVerify(true)}
                    disabled={isVerifying || !proofData}
                    className="w-full bg-surface text-text-dark-primary px-6 py-3 rounded-lg font-semibold border-2 border-dark-border hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">bug_report</span>
                    Test with Tampered Data
                  </button>
                </div>
              </div>
            )}

            {verificationResult === true && (
              <div className="bg-accent-cyan/10 border-2 border-accent-cyan p-12 rounded-xl shadow-2xl glow-cyan text-center">
                <div className="text-6xl mb-6">✓</div>
                <h3 className="text-3xl font-bold text-accent-cyan mb-4">Proof Verified!</h3>
                <p className="text-text-dark-secondary text-lg mb-4">
                  {isTampered
                    ? 'Even with tampered data, the cryptographic checks worked!'
                    : 'The prover knows a valid x where x² = ' + targetOutput}
                </p>
                <p className="text-text-dark-secondary">
                  <strong>Zero-knowledge achieved:</strong> The verifier learned NOTHING about the secret value x!
                </p>
              </div>
            )}

            {verificationResult === false && (
              <div className="bg-signal-error/10 border-2 border-signal-error p-12 rounded-xl shadow-2xl text-center">
                <div className="text-6xl mb-6">✗</div>
                <h3 className="text-3xl font-bold text-signal-error mb-4">Verification Failed!</h3>
                <p className="text-text-dark-secondary text-lg">
                  {isTampered
                    ? 'The tampered data was caught! The proof is invalid for the modified public signals.'
                    : 'The proof is invalid. Either the witness was incorrect or the proof was tampered with.'}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-signal-error/10 border-2 border-signal-error p-8 rounded-xl">
                <h4 className="text-xl font-bold text-signal-error mb-2">Error</h4>
                <p className="text-text-dark-secondary">{error}</p>
              </div>
            )}
          </div>
        </div>

        <BottomControlBar
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          stepName={stepName}
          onPrevious={onPrevious}
        />
      </CanvasPanel>
    </>
  )
}
