import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'
import { generateProof } from '../../utils/zkProof'

interface StepProofProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  setProofData: (data: any) => void
  xValue: number
  targetOutput: number
}

export default function StepProof({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  setProofData,
  xValue,
  targetOutput,
}: StepProofProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [proofGenerated, setProofGenerated] = useState(false)
  const [proofResult, setProofResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRawProof, setShowRawProof] = useState(false)
  const [copied, setCopied] = useState(false)

  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  const handleGenerateProof = async () => {
    if (!isCorrect) {
      setError(`Cannot generate proof: ${xValue}² = ${userOutput} ≠ ${targetOutput}. Go back and use a valid x.`)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateProof(xValue)
      setProofData(result)
      setProofResult(result)
      setProofGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate proof')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyProof = async () => {
    if (!proofResult?.proof) return
    await navigator.clipboard.writeText(JSON.stringify(proofResult.proof, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Helper to truncate hex strings
  const truncateHex = (arr: string[], maxLen = 12) => {
    if (!arr || arr.length === 0) return '...'
    const hex = arr[0]
    if (hex.length <= maxLen) return hex
    return `${hex.slice(0, maxLen)}...`
  }

  // Calculate approximate proof size
  const getProofSize = () => {
    if (!proofResult?.proof) return 0
    return JSON.stringify(proofResult.proof).length
  }

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">6. Proof Generation</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          This is where the cryptographic magic happens. The prover takes the witness and transforms
          it into a proof — a small piece of data that convinces anyone that the prover knows a
          valid solution, without revealing what that solution is.
        </p>

        <h3 className="text-lg font-semibold mb-3">What is Groth16?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-4">
          We're using Groth16, one of the most widely deployed zk-SNARK proof systems. It was
          invented by Jens Groth in 2016 and is used in Zcash, Filecoin, and many other systems.
        </p>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Groth16 proofs are extremely small (just 3 elliptic curve points, ~200 bytes) and
          very fast to verify. The tradeoff is that it requires a trusted setup ceremony.
        </p>

        <h3 className="text-lg font-semibold mb-3">The Proof Structure</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-4">
          A Groth16 proof consists of three elements, each a point on an elliptic curve:
        </p>
        <div className="bg-background-light p-4 rounded-xl border border-gray-200 mb-6">
          <div className="space-y-3 font-mono text-sm">
            <p><span className="text-purple-600 font-bold">π_A</span> — A point on curve G₁ (2 coordinates)</p>
            <p><span className="text-blue-600 font-bold">π_B</span> — A point on curve G₂ (4 coordinates, more complex)</p>
            <p><span className="text-green-600 font-bold">π_C</span> — A point on curve G₁ (2 coordinates)</p>
          </div>
        </div>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          These three points encode all the information needed to verify that the prover knows a
          valid witness. The math is designed so that creating valid points without knowing the
          actual witness is computationally impossible (it would require breaking the discrete
          logarithm problem on elliptic curves).
        </p>

        <h3 className="text-lg font-semibold mb-3">What Happens During Proof Generation?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-4">
          Under the hood, snarkjs performs several computations:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-text-light-secondary text-md mb-6">
          <li>Evaluates the QAP polynomials at a secret point τ (from trusted setup)</li>
          <li>Computes linear combinations of the witness values</li>
          <li>Performs elliptic curve scalar multiplications</li>
          <li>Adds randomness for zero-knowledge (so the proof reveals nothing)</li>
        </ol>

        <h3 className="text-lg font-semibold mb-3">Why "Succinct"?</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The "S" in SNARK stands for "Succinct". No matter how complex your circuit — whether
          it has 1 constraint or 1 million constraints — the proof is always the same size:
          just 3 curve points. This is what makes SNARKs practical for blockchain applications
          where storage and bandwidth are expensive.
        </p>

        <div className="italic text-md mt-4 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">lightbulb</span>
          <p className="text-text-light-secondary">
            "The proof proves knowledge without revealing the knowledge itself — that's the 'zero-knowledge' part."
          </p>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-6">
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {!proofGenerated && !isGenerating && (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-surface rounded-2xl border-2 border-border-subtle p-10 text-center"
                  >
                    <div className="mb-6">
                      <span className="material-symbols-outlined text-accent-cyan text-6xl">verified_user</span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-dark-primary mb-3">Ready to Generate</h3>
                    <p className="text-text-dark-secondary mb-6">
                      Create a proof for x² = {targetOutput} using x = {xValue}
                    </p>
                    
                    {error && (
                      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <button
                      onClick={handleGenerateProof}
                      disabled={!isCorrect}
                      className="bg-accent-cyan text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Generate Zero-Knowledge Proof
                    </button>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface rounded-2xl border-2 border-accent-cyan p-10 text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="mb-6"
                    >
                      <span className="material-symbols-outlined text-accent-cyan text-6xl">sync</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-text-dark-primary mb-4">Generating Proof...</h3>
                    <div className="space-y-2 text-sm text-text-dark-secondary">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Evaluating QAP polynomials...
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        Computing elliptic curve operations...
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        Adding randomness for zero-knowledge...
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {proofGenerated && proofResult && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Success Header */}
                    <div className="bg-surface rounded-2xl border-2 border-green-500 p-6 text-center">
                      <span className="text-green-500 text-4xl">✓</span>
                      <h3 className="text-xl font-bold text-green-400 mt-2">Proof Generated!</h3>
                      <p className="text-text-dark-secondary text-sm mt-1">
                        Proves knowledge of x where x² = {targetOutput}, without revealing x = {xValue}
                      </p>
                    </div>

                    {/* Proof Components */}
                    <div className="bg-surface rounded-2xl border-2 border-border-subtle p-6">
                      <h4 className="text-sm font-semibold text-text-dark-secondary mb-4 uppercase tracking-wider">
                        Proof Components (Elliptic Curve Points)
                      </h4>
                      
                      <div className="space-y-4">
                        {/* π_A */}
                        <div className="bg-purple-500/10 border border-purple-500/50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-400 font-bold font-mono">π_A</span>
                            <span className="text-xs text-text-dark-secondary">Point on G₁</span>
                          </div>
                          <p className="font-mono text-xs text-purple-300 mt-2 break-all">
                            [{truncateHex(proofResult.proof.pi_a)}, {truncateHex(proofResult.proof.pi_a?.slice(1))}]
                          </p>
                        </div>

                        {/* π_B */}
                        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 font-bold font-mono">π_B</span>
                            <span className="text-xs text-text-dark-secondary">Point on G₂</span>
                          </div>
                          <p className="font-mono text-xs text-blue-300 mt-2 break-all">
                            [{truncateHex(proofResult.proof.pi_b?.[0])}, ...]
                          </p>
                        </div>

                        {/* π_C */}
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 font-bold font-mono">π_C</span>
                            <span className="text-xs text-text-dark-secondary">Point on G₁</span>
                          </div>
                          <p className="font-mono text-xs text-green-300 mt-2 break-all">
                            [{truncateHex(proofResult.proof.pi_c)}, {truncateHex(proofResult.proof.pi_c?.slice(1))}]
                          </p>
                        </div>
                      </div>

                      {/* Size Info */}
                      <div className="mt-6 pt-4 border-t border-border-subtle">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-dark-secondary">Proof size:</span>
                          <span className="text-accent-cyan font-bold font-mono">~{getProofSize()} bytes</span>
                        </div>
                        <p className="mt-2 text-xs text-text-dark-secondary">
                          Same size regardless of circuit complexity — that's "succinct"!
                        </p>
                      </div>

                      {/* Toggle Raw Proof */}
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => setShowRawProof(!showRawProof)}
                          className="text-xs text-accent-cyan hover:underline flex items-center gap-1"
                        >
                          {showRawProof ? '▼ Hide' : '▶ Show'} raw proof JSON
                        </button>
                        {showRawProof && (
                          <button
                            onClick={handleCopyProof}
                            className="text-xs text-text-dark-secondary hover:text-accent-cyan flex items-center gap-1"
                          >
                            {copied ? '✓ Copied!' : '📋 Copy'}
                          </button>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {showRawProof && (
                          <motion.pre
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 bg-slate-900 rounded-lg p-4 text-xs text-text-dark-secondary font-mono whitespace-pre-wrap break-all"
                          >
                            {JSON.stringify(proofResult.proof, null, 2)}
                          </motion.pre>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <BottomControlBar
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          stepName={stepName}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </CanvasPanel>
    </>
  )
}