import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StepConstraintsProps {
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

type AnimationStep = 0 | 1 | 2 | 3 | 4 | 5

export default function StepConstraints({ onNext, onPrevious, targetOutput, xValue }: StepConstraintsProps) {
  const [animationStep, setAnimationStep] = useState<AnimationStep>(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Calculate values
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  // R1CS matrices for x * x = out
  const A = [0, 1, 0] // Selects x
  const B = [0, 1, 0] // Selects x
  const C = [0, 0, 1] // Selects out
  const witnessVector = [1, xValue, userOutput] // [1, x, out]
  const witnessLabels = ['1', 'x', 'out']

  // Computed values for each step
  const leftValue = A[0] * witnessVector[0] + A[1] * witnessVector[1] + A[2] * witnessVector[2] // = x
  const rightValue = B[0] * witnessVector[0] + B[1] * witnessVector[1] + B[2] * witnessVector[2] // = x
  const productValue = leftValue * rightValue // = x²
  const constraintValue = C[0] * witnessVector[0] + C[1] * witnessVector[1] + C[2] * witnessVector[2] // = out

  useEffect(() => {
    if (isPlaying) {
      if (animationStep < 5) {
        const timer = setTimeout(() => {
          setAnimationStep((prev) => (prev + 1) as AnimationStep)
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        setIsPlaying(false)
      }
    }
  }, [isPlaying, animationStep])

  const handlePlay = () => {
    setAnimationStep(0)
    setIsPlaying(true)
  }

  const handleReset = () => {
    setAnimationStep(0)
    setIsPlaying(false)
  }

  const handleStepForward = () => {
    if (animationStep < 5) {
      setAnimationStep((prev) => (prev + 1) as AnimationStep)
    }
  }

  const handleStepBack = () => {
    if (animationStep > 0) {
      setAnimationStep((prev) => (prev - 1) as AnimationStep)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">Step 3: The Constraints</h2>

      <div className="bg-accent-secondary/10 border-l-4 border-accent-secondary p-6 mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          R1CS: Rank-1 Constraint System
        </h3>
        <p className="text-text-primary">
          ZK circuits are represented as R1CS constraints. Each constraint has the form:
          <code className="bg-surface px-2 py-1 rounded ml-2 font-mono border border-border-subtle">(A·w) × (B·w) = (C·w)</code>
        </p>
        <p className="text-text-secondary mt-2 text-sm">
          Watch how your witness values flow through the constraint system below!
        </p>
      </div>

      {/* R1CS Visualization */}
      <div className="bg-surface border-2 border-border-subtle rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-text-primary mb-4">Interactive R1CS Visualization:</h4>

        {/* Animation Controls */}
        <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-surface rounded-lg border border-border-subtle">
          <button
            onClick={handleReset}
            disabled={isPlaying}
            className="px-4 py-2 bg-surface text-text-primary rounded font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-border-subtle"
          >
            ↺ Reset
          </button>
          <button
            onClick={handleStepBack}
            disabled={isPlaying || animationStep === 0}
            className="px-4 py-2 bg-surface text-text-primary rounded font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-border-subtle"
          >
            ← Step Back
          </button>
          <button
            onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
            className="px-6 py-2 bg-accent-primary text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Animation'}
          </button>
          <button
            onClick={handleStepForward}
            disabled={isPlaying || animationStep === 5}
            className="px-4 py-2 bg-surface text-text-primary rounded font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-border-subtle"
          >
            Step Forward →
          </button>
          <div className="ml-4 px-4 py-2 bg-accent-primary/10 border border-accent-primary rounded font-mono text-text-primary">
            Step {animationStep}/5
          </div>
        </div>

        {/* Main R1CS Display */}
        <div className="space-y-6">
          {/* Witness Vector */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-semibold text-text-secondary mb-2">Witness Vector (w)</div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-2xl">[</span>
                {witnessVector.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <motion.div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-mono text-lg font-bold ${
                        idx === 0 ? 'bg-surface border-border-subtle text-text-primary' :
                        idx === 1 ? 'bg-yellow-50 border-yellow-400 text-yellow-900' :
                        'bg-green-50 border-green-400 text-green-900'
                      }`}
                      animate={{
                        scale: animationStep > 0 && animationStep <= 4 ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {val}
                    </motion.div>
                    <div className="text-xs text-text-secondary mt-1">{witnessLabels[idx]}</div>
                    {idx === 1 && <div className="text-xs text-yellow-700 font-semibold">🔒 Private</div>}
                    {idx === 2 && <div className="text-xs text-green-700 font-semibold">Public</div>}
                  </div>
                ))}
                <span className="text-text-secondary text-2xl">]</span>
              </div>
            </div>
          </div>

          {/* Constraint Equation: (A·w) × (B·w) = (C·w) */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {/* Left side: A·w */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`transition-all duration-300 ${
                    animationStep >= 1 ? 'ring-4 ring-purple-400' : ''
                  }`}
                >
                  <MatrixDisplay
                    label="A"
                    values={A}
                    color="purple"
                    highlighted={animationStep === 1}
                  />
                </motion.div>
                <div className="text-slate-400 my-2">·</div>
                <div className="text-sm font-mono text-text-secondary">w</div>

                {animationStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 px-4 py-3 bg-purple-100 rounded-lg shadow-sm"
                  >
                    <div className="text-xs text-purple-700 mb-1">Dot product:</div>
                    <div className="font-mono text-sm text-purple-900">
                      {A[0]}·{witnessVector[0]} + {A[1]}·{witnessVector[1]} + {A[2]}·{witnessVector[2]}
                    </div>
                    <div className="font-mono text-lg font-bold text-purple-900 mt-1">
                      = {leftValue}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Multiplication symbol */}
              <motion.div
                className="text-4xl text-slate-400 font-bold"
                animate={{
                  scale: animationStep === 3 ? 1.3 : 1,
                  color: animationStep === 3 ? '#9333ea' : '#94a3b8'
                }}
              >
                ×
              </motion.div>

              {/* Right side: B·w */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`transition-all duration-300 ${
                    animationStep >= 2 ? 'ring-4 ring-blue-400' : ''
                  }`}
                >
                  <MatrixDisplay
                    label="B"
                    values={B}
                    color="blue"
                    highlighted={animationStep === 2}
                  />
                </motion.div>
                <div className="text-slate-400 my-2">·</div>
                <div className="text-sm font-mono text-text-secondary">w</div>

                {animationStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 px-4 py-3 bg-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="text-xs text-blue-700 mb-1">Dot product:</div>
                    <div className="font-mono text-sm text-blue-900">
                      {B[0]}·{witnessVector[0]} + {B[1]}·{witnessVector[1]} + {B[2]}·{witnessVector[2]}
                    </div>
                    <div className="font-mono text-lg font-bold text-blue-900 mt-1">
                      = {rightValue}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Product result */}
              {animationStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-4xl text-slate-400 font-bold mb-2">=</div>
                  <div className="px-4 py-3 bg-purple-600 text-white rounded-lg">
                    <div className="text-xs mb-1">Left × Right</div>
                    <div className="font-mono text-xl font-bold">
                      {leftValue} × {rightValue} = {productValue}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Equals symbol */}
              {animationStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-4xl text-slate-400 font-bold"
                >
                  =
                </motion.div>
              )}

              {/* Right side: C·w */}
              {animationStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className={`transition-all duration-300 ${
                      animationStep >= 4 ? 'ring-4 ring-green-400' : ''
                    }`}
                  >
                    <MatrixDisplay
                      label="C"
                      values={C}
                      color="green"
                      highlighted={animationStep === 4}
                    />
                  </motion.div>
                  <div className="text-slate-400 my-2">·</div>
                  <div className="text-sm font-mono text-text-secondary">w</div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 px-4 py-3 bg-green-100 rounded-lg shadow-sm"
                  >
                    <div className="text-xs text-green-700 mb-1">Dot product:</div>
                    <div className="font-mono text-sm text-green-900">
                      {C[0]}·{witnessVector[0]} + {C[1]}·{witnessVector[1]} + {C[2]}·{witnessVector[2]}
                    </div>
                    <div className="font-mono text-lg font-bold text-green-900 mt-1">
                      = {constraintValue}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Final comparison */}
            {animationStep >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-6 rounded-lg border-4 ${
                  isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '✓ Constraint Satisfied!' : '✗ Constraint Failed!'}
                  </div>
                  <div className={`font-mono text-3xl font-bold mb-3 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                    <span>{productValue}</span>
                    <span className="mx-4">{isCorrect ? '===' : '≠'}</span>
                    <span>{constraintValue}</span>
                  </div>
                  <div className={`text-base font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect
                      ? `The witness satisfies the constraint! You can generate a valid proof.`
                      : `The witness doesn't satisfy the constraint. Proof generation would fail because ${xValue}² = ${productValue}, not ${targetOutput}.`
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Step explanations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={animationStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-accent-primary/10 p-4 rounded-lg border border-accent-primary"
            >
              <div className="font-semibold text-text-primary mb-2">
                {getStepTitle(animationStep)}
              </div>
              <div className="text-text-secondary text-sm">
                {getStepExplanation(animationStep, xValue, leftValue, rightValue, productValue, constraintValue, isCorrect, targetOutput)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Educational content */}
      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-text-primary mb-2">What is R1CS?</h4>
          <p className="text-text-secondary">
            R1CS (Rank-1 Constraint System) is how ZK circuits are represented mathematically.
            Each constraint has the form <code className="bg-surface px-2 py-1 rounded font-mono border border-border-subtle">(A·w) × (B·w) = (C·w)</code>,
            where <code className="bg-surface px-1 rounded border border-border-subtle">w</code> is the witness vector containing all values
            (constants, private inputs, and public outputs).
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Our Circuit's R1CS</h4>
          <p className="text-text-secondary mb-2">
            For the circuit <code className="bg-surface px-2 py-1 rounded border border-border-subtle">x * x = out</code>, we have:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
            <li><strong>A = [0, 1, 0]</strong> selects x from the witness</li>
            <li><strong>B = [0, 1, 0]</strong> selects x from the witness</li>
            <li><strong>C = [0, 0, 1]</strong> selects out from the witness</li>
            <li><strong>w = [1, {xValue}, {userOutput}]</strong> is your witness vector</li>
          </ul>
          <p className="text-text-secondary mt-2">
            The constraint ensures: x × x = out
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Why This Matters</h4>
          <p className="text-text-secondary">
            You can only generate a valid ZK proof if your witness satisfies ALL constraints.
            {isCorrect ? (
              <span className="text-green-600 font-semibold"> Your current witness (x = {xValue}) satisfies the constraint because {xValue}² = {userOutput} = {targetOutput}!</span>
            ) : (
              <span className="text-red-600 font-semibold"> Your current witness (x = {xValue}) does NOT satisfy the constraint because {xValue}² = {userOutput} ≠ {targetOutput}.</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-surface text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors border-2 border-border-subtle"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="bg-accent-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Next: Witness →
        </button>
      </div>
    </div>
  )
}

// Matrix Display Component
function MatrixDisplay({
  label,
  values,
  color,
  highlighted
}: {
  label: string
  values: number[]
  color: 'purple' | 'blue' | 'green'
  highlighted: boolean
}) {
  const colorClasses = {
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-400',
      text: 'text-purple-900',
      label: 'bg-purple-600 text-white'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-900',
      label: 'bg-blue-600 text-white'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-900',
      label: 'bg-green-600 text-white'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="flex flex-col items-center">
      <div className={`${colors.label} px-3 py-1 rounded-t-lg font-bold text-sm`}>
        {label}
      </div>
      <div className={`${colors.bg} border-2 ${colors.border} border-t-0 rounded-b-lg p-2`}>
        <div className="flex flex-col gap-1">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              className={`w-12 h-8 flex items-center justify-center ${colors.bg} border ${colors.border} rounded font-mono font-bold ${colors.text}`}
              animate={{
                scale: highlighted ? 1.1 : 1,
                backgroundColor: highlighted ? (color === 'purple' ? '#f3e8ff' : color === 'blue' ? '#dbeafe' : '#dcfce7') : undefined
              }}
              transition={{ duration: 0.3 }}
            >
              {val}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getStepTitle(step: AnimationStep): string {
  switch (step) {
    case 0: return 'Initial State'
    case 1: return 'Step 1: Select Left Wire'
    case 2: return 'Step 2: Select Right Wire'
    case 3: return 'Step 3: Multiply Wires'
    case 4: return 'Step 4: Select Output Wire'
    case 5: return 'Step 5: Check Equality'
    default: return ''
  }
}

function getStepExplanation(
  step: AnimationStep,
  xValue: number,
  leftValue: number,
  rightValue: number,
  productValue: number,
  constraintValue: number,
  isCorrect: boolean,
  targetOutput: number
): string {
  switch (step) {
    case 0:
      return `The constraint equation (A·w) × (B·w) = (C·w) will check if your witness is valid.`
    case 1:
      return `Matrix A selects which wire to use for the LEFT side of multiplication — it picks x from the witness.`
    case 2:
      return `Matrix B selects which wire to use for the RIGHT side of multiplication — it also picks x.`
    case 3:
      return `We multiply the left and right values together: ${leftValue} × ${rightValue} = ${productValue}.`
    case 4:
      return `Matrix C selects which wire should EQUAL the multiplication result — it picks the output wire.`
    case 5:
      return isCorrect
        ? `The multiplication result ${productValue} EQUALS the output ${constraintValue} — constraint satisfied!`
        : `The multiplication result ${productValue} does NOT EQUAL the output ${constraintValue} — constraint violated! (${xValue}² = ${productValue}, but we need ${targetOutput})`
    default:
      return ''
  }
}
