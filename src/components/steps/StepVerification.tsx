import { useState } from 'react'
import { verifyProof } from '../../utils/zkProof'

interface StepVerificationProps {
  onPrevious: () => void
  proofData: any
  xValue: number
}

export default function StepVerification({ onPrevious, proofData, xValue }: StepVerificationProps) {
  const output = xValue * xValue
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

      // If tampering, modify the public signals to a wrong value
      if (tamper) {
        const wrongOutput = output + 1 // Wrong output value
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
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 6: Verification</h2>

      <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-green-900 mb-3">
          Verifying the Proof
        </h3>
        <p className="text-green-800">
          The verifier can now check the proof without learning anything about the secret value x.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What the Verifier Knows</h4>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-blue-900">
              <li>The public output: <code className="bg-blue-100 px-2 py-1 rounded">out = {output}</code></li>
              <li>The circuit structure (what computation was performed)</li>
              <li>The cryptographic proof</li>
            </ul>
            {proofData && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Proof's public signals:</p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded block">
                  {JSON.stringify(proofData.publicSignals)}
                </code>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What the Verifier Does NOT Know</h4>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-yellow-900">
              <li>The private input: <code className="bg-yellow-100 px-2 py-1 rounded">x = ???</code></li>
              <li>Whether x is 3 or -3</li>
              <li>Any other information about the prover's knowledge</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">How Verification Works</h4>
          <p className="text-gray-600">
            The verifier runs a mathematical check on the proof using the public inputs and a verification key.
            This check is very fast (much faster than generating the proof) and will only succeed if:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 mt-2">
            <li>The prover actually knows a valid witness</li>
            <li>The witness satisfies all the constraints</li>
            <li>The public outputs match</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <div className="text-center">
          {verificationResult === null && !error && (
            <div className="space-y-4">
              <button
                onClick={() => handleVerify(false)}
                disabled={isVerifying || !proofData}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed text-lg w-full sm:w-auto"
              >
                {isVerifying && !isTampered ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying Proof...
                  </span>
                ) : (
                  'Verify the Proof'
                )}
              </button>

              <div className="text-sm text-gray-600 my-2">or</div>

              <button
                onClick={() => handleVerify(true)}
                disabled={isVerifying || !proofData}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed text-lg w-full sm:w-auto"
              >
                {isVerifying && isTampered ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Testing Tampered Proof...
                  </span>
                ) : (
                  '🔬 Test Tampered Proof (Demo Failure)'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                The tampered test changes the public output to {output + 1}, causing verification to fail
              </p>
            </div>
          )}

          {verificationResult === true && !isTampered && (
            <div className="bg-green-50 border-2 border-green-300 p-8 rounded-lg">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-2xl font-bold text-green-900 mb-3">Proof Verified!</h4>
              <p className="text-green-700 text-lg mb-4">
                The proof is valid! The verifier is now convinced that the prover knows
                a number x where x² = {output}.
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">What was proven:</p>
                <p className="font-semibold text-gray-800">
                  "I know a secret number that, when squared, equals {output}"
                </p>
                <p className="text-sm text-gray-600 mt-3">What was NOT revealed:</p>
                <p className="font-semibold text-gray-800">
                  The actual value of the secret number (x = {xValue})
                </p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The proof always succeeds when verifying with the correct public signals.
                  Any valid input x produces a valid proof for x². Try the "Test Tampered Proof" button to see
                  what happens when the public signals are modified!
                </p>
              </div>
            </div>
          )}

          {verificationResult === false && (
            <div className="bg-red-50 border-2 border-red-300 p-8 rounded-lg">
              <div className="text-4xl mb-3">✗</div>
              <h4 className="text-xl font-semibold text-red-900 mb-2">Verification Failed!</h4>
              <p className="text-red-700 mb-4">
                The proof is invalid! {isTampered ? 'This is expected - we tampered with the public signals.' : 'This means the proof does not match the claimed output.'}
              </p>
              {isTampered && (
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 mb-2">What happened:</p>
                  <p className="text-gray-800">
                    The proof was generated for output = <code className="bg-gray-100 px-2 py-1 rounded">{output}</code>,
                    but we tried to verify it with output = <code className="bg-gray-100 px-2 py-1 rounded">{output + 1}</code>.
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    This demonstrates that ZK proofs are cryptographically secure - you cannot modify the
                    public outputs without invalidating the proof!
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
              <div className="text-4xl mb-3">⚠</div>
              <h4 className="text-xl font-semibold text-red-900 mb-2">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg mb-6">
        <h4 className="font-semibold text-indigo-900 mb-2">🎓 Congratulations!</h4>
        <p className="text-indigo-800">
          You've just witnessed a complete zero-knowledge proof workflow! You've seen how someone
          can prove they know something without revealing what that something is—a fundamental
          building block of privacy-preserving systems.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}
