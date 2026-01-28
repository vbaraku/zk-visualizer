import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'

interface StepWitnessProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  xValue: number
  targetOutput: number
}

export default function StepWitness({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  xValue,
  targetOutput,
}: StepWitnessProps) {
  const [viewMode, setViewMode] = useState<'prover' | 'verifier'>('prover')

  // Witness vector: [1, x, out]
  const witnessVector = [
    { label: 'one', value: 1, index: 0, isPrivate: false, color: 'blue' },
    { label: 'x', value: xValue, index: 1, isPrivate: true, color: 'amber' },
    { label: 'out', value: targetOutput, index: 2, isPrivate: false, color: 'green' },
  ]

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">5. The Witness</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          The witness is a <strong>vector of all signal values</strong> that satisfies the circuit constraints.
          It's the prover's secret input to proof generation.
        </p>

        <h3 className="text-lg font-semibold mb-3">What Does the Witness Do?</h3>
        <div className="space-y-4 mb-6">
          <div className="bg-background-light p-4 rounded-lg border-l-4 border-blue-500">
            <p className="font-semibold text-blue-700 mb-1">1. Satisfies R1CS Constraints</p>
            <p className="text-sm text-text-light-secondary">
              The witness makes the equation true: <code className="bg-gray-100 px-1 rounded">(A·w) × (B·w) = (C·w)</code>
            </p>
          </div>
          
          <div className="bg-background-light p-4 rounded-lg border-l-4 border-purple-500">
            <p className="font-semibold text-purple-700 mb-1">2. Input to Proof Generation</p>
            <p className="text-sm text-text-light-secondary">
              snarkjs uses the witness to compute polynomial evaluations and create elliptic curve points.
            </p>
          </div>
          
          <div className="bg-background-light p-4 rounded-lg border-l-4 border-green-500">
            <p className="font-semibold text-green-700 mb-1">3. Gets Cryptographically Hidden</p>
            <p className="text-sm text-text-light-secondary">
              The proof "encodes" the witness, but extracting x from the proof is computationally impossible.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Vector Format</h3>
        <div className="bg-background-light p-4 rounded-xl border border-gray-200 mb-4 font-mono text-center text-lg">
          <span className="text-text-light-secondary">w = [</span>
          <span className="text-blue-600">1</span>
          <span className="text-text-light-secondary">, </span>
          <span className="text-amber-600">{xValue}</span>
          <span className="text-text-light-secondary">, </span>
          <span className="text-green-600">{targetOutput}</span>
          <span className="text-text-light-secondary">]</span>
        </div>

        <div className="space-y-1 text-sm text-text-light-secondary mb-6">
          <p><span className="font-mono text-blue-600">w[0]=1</span> — Constant for R1CS math</p>
          <p><span className="font-mono text-amber-600">w[1]=x</span> — Your secret (private)</p>
          <p><span className="font-mono text-green-600">w[2]=out</span> — The target (public)</p>
        </div>

        <div className="italic text-md mt-4 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">lightbulb</span>
          <p className="text-text-light-secondary">
            "No valid witness = no valid proof. This is why ZK proofs are secure."
          </p>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 pb-24">
          {/* View Mode Toggle */}
          <div className="mb-6 md:mb-8">
            <div className="bg-surface border-2 border-border-subtle rounded-full p-1 flex">
              <button
                onClick={() => setViewMode('prover')}
                className={`px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                  viewMode === 'prover'
                    ? 'bg-amber-500 text-slate-900'
                    : 'text-text-dark-secondary hover:text-text-dark-primary'
                }`}
              >
                👁 Prover's View
              </button>
              <button
                onClick={() => setViewMode('verifier')}
                className={`px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                  viewMode === 'verifier'
                    ? 'bg-green-500 text-slate-900'
                    : 'text-text-dark-secondary hover:text-text-dark-primary'
                }`}
              >
                🔒 Verifier's View
              </button>
            </div>
          </div>

          {/* Witness Vector Visualization */}
          <div className="w-full max-w-2xl">
            <motion.div
              className="bg-surface border-2 border-border-subtle rounded-2xl p-4 md:p-8"
              layout
            >
              {/* Vector Label */}
              <div className="text-center mb-4 md:mb-6">
                <span className="text-xl md:text-2xl font-bold text-accent-cyan font-mono">w</span>
                <span className="text-lg md:text-xl text-text-dark-secondary ml-2">=</span>
              </div>

              {/* Vector Elements */}
              <div className="flex items-center justify-center gap-1 md:gap-2">
                <span className="text-2xl md:text-4xl text-text-dark-secondary font-mono">[</span>
                
                {witnessVector.map((item, idx) => (
                  <div key={item.label} className="flex items-center">
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {/* Label */}
                      <span className={`text-[10px] md:text-xs font-mono mb-1 md:mb-2 ${
                        item.color === 'blue' ? 'text-blue-400' :
                        item.color === 'amber' ? 'text-amber-400' : 'text-green-400'
                      }`}>
                        {item.label}
                      </span>
                      
                      {/* Value Box - responsive sizes */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${item.label}-${viewMode}`}
                          initial={{ rotateY: 90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          exit={{ rotateY: -90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-14 h-14 md:w-20 md:h-20 rounded-lg md:rounded-xl flex items-center justify-center font-mono text-lg md:text-2xl font-bold border-2 ${
                            item.isPrivate && viewMode === 'verifier'
                              ? 'bg-slate-800 border-slate-600 text-slate-500'
                              : item.color === 'blue'
                                ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                                : item.color === 'amber'
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                  : 'bg-green-500/20 border-green-500 text-green-400'
                          }`}
                        >
                          {item.isPrivate && viewMode === 'verifier' ? '?' : item.value}
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Privacy Indicator */}
                      <span className={`text-[10px] md:text-xs mt-1 md:mt-2 ${
                        item.isPrivate ? 'text-amber-400' : 'text-green-400'
                      }`}>
                        {item.isPrivate ? '🔒 private' : '🔓 public'}
                      </span>
                    </motion.div>
                    
                    {/* Comma separator */}
                    {idx < witnessVector.length - 1 && (
                      <span className="text-lg md:text-2xl text-text-dark-secondary font-mono mx-1 md:mx-2">,</span>
                    )}
                  </div>
                ))}
                
                <span className="text-2xl md:text-4xl text-text-dark-secondary font-mono">]</span>
              </div>

              {/* View Mode Description */}
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 md:mt-8 text-center"
              >
                {viewMode === 'prover' ? (
                  <p className="text-amber-400 text-xs md:text-sm">
                    <span className="font-bold">Prover knows everything:</span> x = {xValue} enables proof generation.
                  </p>
                ) : (
                  <p className="text-green-400 text-xs md:text-sm">
                    <span className="font-bold">Verifier only sees public values:</span> x is hidden, but proof still verifies!
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Flow Diagram - hidden on mobile to save space */}
          <div className="hidden md:block mt-8 w-full max-w-3xl">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-surface border-2 border-amber-500/50 rounded-lg p-4 text-center">
                <span className="text-amber-400 text-sm font-semibold">Witness</span>
                <p className="text-xs text-text-dark-secondary mt-1">w = [1, {xValue}, {targetOutput}]</p>
              </div>
              
              <div className="flex items-center text-text-dark-secondary">
                <span className="text-2xl">→</span>
              </div>
              
              <div className="bg-surface border-2 border-purple-500/50 rounded-lg p-4 text-center">
                <span className="text-purple-400 text-sm font-semibold">snarkjs.groth16.prove()</span>
                <p className="text-xs text-text-dark-secondary mt-1">Polynomial magic ✨</p>
              </div>
              
              <div className="flex items-center text-text-dark-secondary">
                <span className="text-2xl">→</span>
              </div>
              
              <div className="bg-surface border-2 border-green-500/50 rounded-lg p-4 text-center">
                <span className="text-green-400 text-sm font-semibold">proof</span>
                <p className="text-xs text-text-dark-secondary mt-1">x is hidden!</p>
              </div>
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