import { motion } from 'framer-motion'
import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'

interface StepProblemProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  xValue: number
  setXValue: (value: number) => void
  targetOutput: number
}

export default function StepProblem({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  xValue,
  setXValue,
  targetOutput,
}: StepProblemProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">1. The Problem Statement</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          Zero-knowledge proofs allow you to{' '}
          <span className="font-bold text-text-light-primary">
            prove you know something without revealing what that something is
          </span>
          . In this example, we'll prove we know a value x such that x² = {targetOutput}.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            Challenge
          </span>
          <div className="text-lg space-y-2">
            <p>
              Prove you know <span className="text-primary font-semibold">x</span> where
            </p>
            <p className="text-2xl text-center my-4">x × x = {targetOutput}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> This is a toy example — x² = {targetOutput} only has two solutions, 
            so it's not truly "secret." We use it because the circuit is simple enough to visualize completely. 
            Real ZK applications use problems with huge solution spaces.
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-3">The Core Idea</h3>
        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          You can only create a valid zero-knowledge proof if you actually know a correct answer.
          This is what makes ZK proofs secure — you can't fake knowledge you don't have.
        </p>

        <h3 className="text-lg font-semibold mb-3">What Stays Secret, What's Public</h3>
        <div className="space-y-2 text-sm mb-6">
          <p>
            <span className="font-semibold text-green-600">Public:</span> The challenge (x² = {targetOutput})
          </p>
          <p>
            <span className="font-semibold text-amber-600">Secret:</span> Your answer (x = {xValue}) — 
            this will never be revealed in the proof!
          </p>
        </div>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <p className="text-text-light-secondary">
            "The verifier will become convinced you know x, but will learn{' '}
            <span className="font-semibold text-text-light-primary">nothing</span> about what x actually is."
          </p>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 overflow-y-auto custom-scrollbar-dark flex flex-col p-6 pb-24 overflow-y-auto custom-scrollbar-dark">
          {/* Prover vs Verifier Visualization */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Prover Card */}
              <div className="bg-surface border-2 border-amber-400/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">👤</span>
                  <h3 className="font-bold text-amber-400 text-lg">PROVER (You)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-amber-400/10 rounded-lg p-3">
                    <p className="text-text-dark-secondary mb-1">Secret:</p>
                    <p className="font-mono text-2xl text-amber-400">
                      x = {isCorrect ? xValue : '?'}
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3">
                    <p className="text-text-dark-secondary mb-1">Computation:</p>
                    <p className="font-mono text-lg text-text-dark-primary">
                      {isCorrect ? `${xValue} × ${xValue} = ${userOutput}` : '? × ? = ?'}
                    </p>
                  </div>
                  <p className="text-text-dark-secondary text-xs">
                    You know everything
                  </p>
                </div>
              </div>

              {/* Verifier Card */}
              <div className="bg-surface border-2 border-accent-cyan/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">👁️</span>
                  <h3 className="font-bold text-accent-cyan text-lg">VERIFIER</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-text-dark-secondary mb-1">Secret:</p>
                    <p className="font-mono text-2xl text-slate-500">
                      x = ???
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3">
                    <p className="text-text-dark-secondary mb-1">Knows only:</p>
                    <p className="font-mono text-lg text-text-dark-primary">
                      ?² = {targetOutput}
                    </p>
                  </div>
                  <p className="text-text-dark-secondary text-xs">
                    Learns nothing about x
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Input Section */}
          <div className="bg-surface border-2 border-border-subtle rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-accent-cyan">target</span>
              <h3 className="font-semibold text-text-dark-primary text-lg">
                Your Challenge: Find x where x² = {targetOutput}
              </h3>
            </div>

            <p className="text-text-dark-secondary text-sm mb-4">
              Enter your secret number. Only if you know a correct answer can you generate a valid proof.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-text-dark-secondary text-sm">Your guess for x:</label>
              <input
                type="number"
                value={xValue}
                onChange={(e) => setXValue(Number(e.target.value))}
                className={`w-24 bg-background-dark-canvas border-2 rounded-lg px-4 py-2 text-text-dark-primary font-mono text-xl focus:outline-none transition-colors ${
                  isCorrect
                    ? 'border-accent-cyan focus:border-accent-cyan'
                    : 'border-dark-border focus:border-accent-cyan'
                }`}
              />
              <span className="text-text-dark-secondary">
                → {xValue}² ={' '}
                <span
                  className={`font-mono font-bold text-xl ${
                    isCorrect ? 'text-accent-cyan' : 'text-signal-error'
                  }`}
                >
                  {userOutput}
                </span>
                {isCorrect ? ' ✓' : ' ✗'}
              </span>
            </div>

            {isCorrect ? (
              <motion.div 
                className="p-4 bg-accent-cyan/10 border border-accent-cyan rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-accent-cyan font-semibold">✓ Correct! You know a valid answer!</p>
                <p className="text-sm text-text-dark-secondary mt-2">
                  You can now generate a zero-knowledge proof that you know x where x² = {targetOutput},
                  without revealing that x = {xValue}.
                </p>
              </motion.div>
            ) : (
              <div className="p-4 bg-signal-error/10 border border-signal-error rounded-lg">
                <p className="text-signal-error font-semibold">
                  ✗ Incorrect: {xValue}² = {userOutput}, not {targetOutput}
                </p>
                <p className="text-sm text-text-dark-secondary mt-2">
                  You can proceed, but proof generation will fail because you don't know a valid answer.
                  Try 3 or -3!
                </p>
              </div>
            )}
          </div>

          {/* Key Insight */}
          {isCorrect && (
            <motion.div 
              className="mt-6 p-4 bg-surface-subtle rounded-lg border border-border-subtle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-text-dark-secondary text-sm text-center">
                <span className="text-accent-cyan font-semibold">The magic:</span> At the end of this journey, 
                the verifier will be <em>convinced</em> you know x, but will have learned{' '}
                <span className="font-bold text-text-dark-primary">absolutely nothing</span> about what x is.
              </p>
            </motion.div>
          )}
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