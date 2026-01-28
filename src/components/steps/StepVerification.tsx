import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function StepVerification({
  currentStepIndex,
  totalSteps,
  stepName,
  onPrevious,
  proofData,
  xValue,
  targetOutput,
}: StepVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTampered, setIsTampered] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<{ label: string; component: string; success: boolean }[]>([])

  const getAnimationSteps = (tampered: boolean) => [
    { label: 'Loading proof components...', component: 'π_A, π_B, π_C', success: true },
    { label: 'Loading public inputs...', component: `x² = ${tampered ? targetOutput + 1 : targetOutput}`, success: true },
    { label: 'Computing pairing e(π_A, π_B)...', component: 'e₁', success: true },
    { label: 'Computing pairing e(π_C, δ)...', component: 'e₂', success: true },
    { label: 'Checking equation e₁ = e₂ ?', component: tampered ? 'MISMATCH' : 'MATCH', success: !tampered },
  ]

  useEffect(() => {
    const steps = getAnimationSteps(isTampered)
    if (isVerifying && animationStep < steps.length) {
      const timer = setTimeout(() => {
        setAnimationStep((prev) => prev + 1)
      }, 1000) // Slower: 1 second per step
      return () => clearTimeout(timer)
    }
  }, [isVerifying, animationStep, isTampered])

  const handleVerify = async (tamper: boolean = false) => {
    if (!proofData) {
      setError('No proof data available. Go back and generate a proof first.')
      return
    }

    setIsVerifying(true)
    setError(null)
    setIsTampered(tamper)
    setAnimationStep(0)
    setCompletedSteps([])
    setVerificationResult(null)

    try {
      let dataToVerify = proofData

      if (tamper) {
        const wrongOutput = targetOutput + 1
        dataToVerify = {
          ...proofData,
          publicSignals: [wrongOutput.toString()],
        }
      }

      // Wait for animation to complete (5 steps × 1 second + buffer)
      await new Promise((resolve) => setTimeout(resolve, 5500))

      // Store completed steps for display
      setCompletedSteps(getAnimationSteps(tamper))

      const result = await verifyProof(dataToVerify)
      setVerificationResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify proof')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleReset = () => {
    setVerificationResult(null)
    setError(null)
    setIsTampered(false)
    setAnimationStep(0)
    setCompletedSteps([])
  }

  const currentSteps = getAnimationSteps(isTampered)

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">7. Verification</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The verifier can now check the proof without learning anything about the secret value x.
          This is the moment of truth — does the cryptographic math check out?
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-6 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            What the Verifier Knows
          </span>
          <div className="text-sm space-y-2">
            <p>• The challenge: x² = {targetOutput}</p>
            <p>• The circuit structure (public)</p>
            <p>• The cryptographic proof (π_A, π_B, π_C)</p>
            <p>• The verification key (from trusted setup)</p>
          </div>
        </div>

        <div className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-500 mb-6 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            What the Verifier Does NOT Know
          </span>
          <div className="text-sm space-y-2">
            <p>🔒 The private input: x = ???</p>
            <p>🔒 Whether x is {xValue} or {-xValue} (both valid!)</p>
            <p>🔒 Any intermediate computation values</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">How Verification Works</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-4">
          The verifier performs a <strong>pairing check</strong> — a special mathematical operation
          on elliptic curves. The equation looks something like:
        </p>
        <div className="bg-background-light p-4 rounded-xl border border-gray-200 mb-4 font-mono text-sm text-center">
          e(π_A, π_B) = e(α, β) · e(L, γ) · e(π_C, δ)
        </div>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Don't worry about the details — the key insight is that this equation will ONLY be true
          if the prover actually knew a valid witness. It's mathematically impossible to create
          π_A, π_B, π_C that satisfy this equation without knowing x.
        </p>

        <h3 className="text-lg font-semibold mb-3">Why Verification is Fast</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Verification requires only a few pairing operations — the same amount regardless of
          circuit complexity. A circuit with 1 million constraints verifies just as fast as our
          simple x² circuit. This O(1) verification is what makes SNARKs practical for blockchains.
        </p>

        <h3 className="text-lg font-semibold mb-3">The Tamper Test</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-4">
          Try the "Test with Tampered Data" button to see what happens when someone tries to cheat.
          We'll change the public signal from {targetOutput} to {targetOutput + 1} and watch
          verification fail.
        </p>

        <div className="italic text-md mt-4 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">lightbulb</span>
          <p className="text-text-light-secondary">
            "The verifier learns NOTHING except that the prover knows a valid answer!"
          </p>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-6 pb-24">
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {/* Initial State */}
                {verificationResult === null && !isVerifying && (
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
                    <h3 className="text-2xl font-bold text-text-dark-primary mb-3">Ready to Verify</h3>
                    <p className="text-text-dark-secondary mb-8">
                      Verify that the proof is valid without learning what x is.
                    </p>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <button
                        onClick={() => handleVerify(false)}
                        className="w-full bg-accent-cyan text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-cyan/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                        Verify Proof
                      </button>

                      <button
                        onClick={() => handleVerify(true)}
                        className="w-full bg-surface border-2 border-border-subtle text-text-dark-secondary px-8 py-4 rounded-lg font-semibold hover:border-red-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">warning</span>
                        Test with Tampered Data
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Animated Verification Process */}
                {isVerifying && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className={`bg-surface rounded-2xl border-2 p-6 ${isTampered ? 'border-red-500/50' : 'border-accent-cyan'}`}>
                      <h3 className={`text-lg font-bold mb-6 text-center ${isTampered ? 'text-red-400' : 'text-accent-cyan'}`}>
                        {isTampered ? '⚠️ Verifying Tampered Data...' : '🔍 Verifying Proof...'}
                      </h3>

                      {/* Animated proof components entering verifier */}
                      <div className="flex justify-center gap-4 mb-8">
                        {['π_A', 'π_B', 'π_C'].map((component, idx) => (
                          <motion.div
                            key={component}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.2, type: 'spring' }}
                            className={`px-4 py-2 rounded-lg font-mono text-sm font-bold ${
                              idx === 0
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                : idx === 1
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                : 'bg-green-500/20 text-green-400 border border-green-500/50'
                            }`}
                          >
                            {component}
                          </motion.div>
                        ))}
                      </div>

                      {/* Tampered indicator */}
                      {isTampered && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-center">
                          <p className="text-red-400 text-sm">
                            ⚠️ Tampered: claiming x² = <span className="font-mono font-bold">{targetOutput + 1}</span> instead of{' '}
                            <span className="font-mono">{targetOutput}</span>
                          </p>
                        </div>
                      )}

                      {/* Animated steps */}
                      <div className="space-y-3">
                        {currentSteps.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                              opacity: animationStep > idx ? 1 : animationStep === idx ? 0.8 : 0.3,
                              x: 0,
                            }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              animationStep > idx
                                ? step.success
                                  ? 'bg-green-500/10'
                                  : 'bg-red-500/10'
                                : animationStep === idx
                                ? isTampered
                                  ? 'bg-red-500/5'
                                  : 'bg-accent-cyan/10'
                                : 'bg-slate-800/50'
                            }`}
                          >
                            <div className="w-6 h-6 flex items-center justify-center">
                              {animationStep > idx ? (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={step.success ? 'text-green-400' : 'text-red-400'}
                                >
                                  {step.success ? '✓' : '✗'}
                                </motion.span>
                              ) : animationStep === idx ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                  className={`w-4 h-4 border-2 border-t-transparent rounded-full ${
                                    isTampered ? 'border-red-400' : 'border-accent-cyan'
                                  }`}
                                />
                              ) : (
                                <span className="text-slate-600">○</span>
                              )}
                            </div>
                            <span
                              className={`text-sm flex-1 ${
                                animationStep >= idx ? 'text-text-dark-primary' : 'text-text-dark-secondary'
                              }`}
                            >
                              {step.label}
                            </span>
                            <span
                              className={`font-mono text-xs ${
                                animationStep > idx
                                  ? step.success
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                  : 'text-text-dark-secondary'
                              }`}
                            >
                              {step.component}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Success State - with steps visible */}
                {verificationResult === true && !isTampered && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Completed steps */}
                    <div className="bg-surface rounded-2xl border-2 border-green-500 p-6">
                      <h3 className="text-lg font-bold text-green-400 mb-4 text-center">
                        ✓ Verification Complete
                      </h3>

                      <div className="flex justify-center gap-4 mb-6">
                        {['π_A', 'π_B', 'π_C'].map((component, idx) => (
                          <div
                            key={component}
                            className={`px-4 py-2 rounded-lg font-mono text-sm font-bold ${
                              idx === 0
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                : idx === 1
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                : 'bg-green-500/20 text-green-400 border border-green-500/50'
                            }`}
                          >
                            {component}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {completedSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded bg-green-500/10"
                          >
                            <span className="text-green-400 w-6 text-center">✓</span>
                            <span className="text-sm text-text-dark-primary flex-1">{step.label}</span>
                            <span className="font-mono text-xs text-green-400">{step.component}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result */}
                    <div className="bg-surface rounded-2xl border-2 border-border-subtle p-6 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="text-5xl mb-4"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-400 mb-2">Proof Verified!</h3>
                      <p className="text-text-dark-secondary mb-4">
                        The prover knows a valid x where x² = {targetOutput}
                      </p>

                      <div className="text-left space-y-2 text-sm border-t border-border-subtle pt-4 mt-4">
                        <div className="flex items-center gap-2 text-green-400">
                          <span>✓</span>
                          <span>Zero-knowledge preserved — x remains hidden</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                          <span>✓</span>
                          <span>Verifier convinced without learning the secret</span>
                        </div>
                      </div>

                      <button
                        onClick={handleReset}
                        className="mt-6 w-full bg-surface border border-border-subtle text-text-dark-secondary px-4 py-2 rounded-lg text-sm hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                      >
                        Try Again or Test Tampered Data
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Failure State - with steps visible */}
                {verificationResult === false && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Completed steps showing failure */}
                    <div className="bg-surface rounded-2xl border-2 border-red-500 p-6">
                      <h3 className="text-lg font-bold text-red-400 mb-4 text-center">
                        ✗ Verification Failed
                      </h3>

                      <div className="flex justify-center gap-4 mb-6">
                        {['π_A', 'π_B', 'π_C'].map((component, idx) => (
                          <div
                            key={component}
                            className={`px-4 py-2 rounded-lg font-mono text-sm font-bold opacity-50 ${
                              idx === 0
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                : idx === 1
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                : 'bg-green-500/20 text-green-400 border border-green-500/50'
                            }`}
                          >
                            {component}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {completedSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-2 rounded ${
                              step.success ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}
                          >
                            <span className={`w-6 text-center ${step.success ? 'text-green-400' : 'text-red-400'}`}>
                              {step.success ? '✓' : '✗'}
                            </span>
                            <span className="text-sm text-text-dark-primary flex-1">{step.label}</span>
                            <span className={`font-mono text-xs ${step.success ? 'text-green-400' : 'text-red-400'}`}>
                              {step.component}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-surface rounded-2xl border-2 border-border-subtle p-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="text-5xl mb-4 text-center"
                      >
                        🚫
                      </motion.div>
                      <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Tampering Detected!</h3>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                          <p className="text-xs text-green-400 mb-1">Proof created for</p>
                          <p className="font-mono text-lg text-green-400">x² = {targetOutput}</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                          <p className="text-xs text-red-400 mb-1">Attacker claimed</p>
                          <p className="font-mono text-lg text-red-400">x² = {targetOutput + 1}</p>
                        </div>
                      </div>

                      <p className="text-text-dark-secondary text-sm text-center">
                        The pairing check detected the mismatch. You cannot reuse a proof for different values!
                      </p>

                      <button
                        onClick={handleReset}
                        className="w-full mt-4 bg-surface border border-border-subtle text-text-dark-secondary px-4 py-2 rounded-lg text-sm hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                      >
                        Try Again
                      </button>
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
          onNext={() => {}}
          onPrevious={onPrevious}
        />
      </CanvasPanel>
    </>
  )
}