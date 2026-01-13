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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 3: The Constraints</h2>

      <div className="bg-pink-50 border-l-4 border-pink-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-pink-900 mb-3">
          R1CS: Rank-1 Constraint System
        </h3>
        <p className="text-pink-800">
          ZK circuits are represented as R1CS constraints. Each constraint has the form:
          <code className="bg-pink-100 px-2 py-1 rounded ml-2 font-mono">(A·w) × (B·w) = (C·w)</code>
        </p>
        <p className="text-pink-700 mt-2 text-sm">
          Watch how your witness values flow through the constraint system below!
        </p>
      </div>

      {/* R1CS Visualization */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Interactive R1CS Visualization:</h4>

        {/* Animation Controls */}
        <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <button
            onClick={handleReset}
            disabled={isPlaying}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↺ Reset
          </button>
          <button
            onClick={handleStepBack}
            disabled={isPlaying || animationStep === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Step Back
          </button>
          <button
            onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Animation'}
          </button>
          <button
            onClick={handleStepForward}
            disabled={isPlaying || animationStep === 5}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Step Forward →
          </button>
          <div className="ml-4 px-4 py-2 bg-indigo-50 rounded font-mono text-indigo-900">
            Step {animationStep}/5
          </div>
        </div>

        {/* Main R1CS Display */}
        <div className="space-y-6">
          {/* Witness Vector */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-600 mb-2">Witness Vector (w)</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-2xl">[</span>
                {witnessVector.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <motion.div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-mono text-lg font-bold ${
                        idx === 0 ? 'bg-gray-50 border-gray-300 text-gray-700' :
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
                    <div className="text-xs text-gray-500 mt-1">{witnessLabels[idx]}</div>
                    {idx === 1 && <div className="text-xs text-yellow-700 font-semibold">🔒 Private</div>}
                    {idx === 2 && <div className="text-xs text-green-700 font-semibold">Public</div>}
                  </div>
                ))}
                <span className="text-gray-500 text-2xl">]</span>
              </div>
            </div>
          </div>

          {/* Constraint Equation: (A·w) × (B·w) = (C·w) */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-center gap-4 flex-wrap">
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
                <div className="text-gray-400 my-2">·</div>
                <div className="text-sm font-mono text-gray-600">w</div>

                {animationStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-3 py-2 bg-purple-100 rounded-lg"
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
                className="text-4xl text-gray-400 font-bold"
                animate={{
                  scale: animationStep === 3 ? 1.3 : 1,
                  color: animationStep === 3 ? '#9333ea' : '#9ca3af'
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
                <div className="text-gray-400 my-2">·</div>
                <div className="text-sm font-mono text-gray-600">w</div>

                {animationStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-3 py-2 bg-blue-100 rounded-lg"
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
                  <div className="text-4xl text-gray-400 font-bold mb-2">=</div>
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
                  className="text-4xl text-gray-400 font-bold"
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
                  <div className="text-gray-400 my-2">·</div>
                  <div className="text-sm font-mono text-gray-600">w</div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-3 py-2 bg-green-100 rounded-lg"
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
                className={`mt-6 p-4 rounded-lg border-2 ${
                  isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">
                    {isCorrect ? '✓ Constraint Satisfied!' : '✗ Constraint Failed!'}
                  </div>
                  <div className="font-mono text-xl">
                    <span className="font-bold">{productValue}</span>
                    <span className="mx-3">{isCorrect ? '===' : '≠'}</span>
                    <span className="font-bold">{constraintValue}</span>
                  </div>
                  <div className={`text-sm mt-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect
                      ? `The witness satisfies the constraint! You can generate a valid proof.`
                      : `The witness doesn't satisfy the constraint. Proof generation would fail.`
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
              className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
            >
              <div className="font-semibold text-indigo-900 mb-2">
                {getStepTitle(animationStep)}
              </div>
              <div className="text-indigo-700 text-sm">
                {getStepExplanation(animationStep, xValue, leftValue, rightValue, productValue, constraintValue, isCorrect)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Educational content */}
      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is R1CS?</h4>
          <p className="text-gray-600">
            R1CS (Rank-1 Constraint System) is how ZK circuits are represented mathematically.
            Each constraint has the form <code className="bg-gray-100 px-2 py-1 rounded font-mono">(A·w) × (B·w) = (C·w)</code>,
            where <code className="bg-gray-100 px-1 rounded">w</code> is the witness vector containing all values
            (constants, private inputs, and public outputs).
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Our Circuit's R1CS</h4>
          <p className="text-gray-600 mb-2">
            For the circuit <code className="bg-gray-100 px-2 py-1 rounded">x * x = out</code>, we have:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li><strong>A = [0, 1, 0]</strong> selects x from the witness</li>
            <li><strong>B = [0, 1, 0]</strong> selects x from the witness</li>
            <li><strong>C = [0, 0, 1]</strong> selects out from the witness</li>
            <li><strong>w = [1, {xValue}, {userOutput}]</strong> is your witness vector</li>
          </ul>
          <p className="text-gray-600 mt-2">
            The constraint ensures: x × x = out
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Why This Matters</h4>
          <p className="text-gray-600">
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
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
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
    case 0: return 'Step 0: Initial State'
    case 1: return 'Step 1: Compute A·w (Left Side)'
    case 2: return 'Step 2: Compute B·w (Right Side)'
    case 3: return 'Step 3: Multiply Left × Right'
    case 4: return 'Step 4: Compute C·w (Constraint Side)'
    case 5: return 'Step 5: Verify Constraint'
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
  isCorrect: boolean
): string {
  switch (step) {
    case 0:
      return `We start with the witness vector w = [1, ${xValue}, ${xValue * xValue}]. The constraint equation is (A·w) × (B·w) = (C·w). Let's see if it holds!`
    case 1:
      return `Matrix A selects the private input x. Computing the dot product: A·w = 0×1 + 1×${xValue} + 0×${xValue * xValue} = ${leftValue}`
    case 2:
      return `Matrix B also selects x. Computing the dot product: B·w = 0×1 + 1×${xValue} + 0×${xValue * xValue} = ${rightValue}`
    case 3:
      return `Now multiply the results: ${leftValue} × ${rightValue} = ${productValue}. This is x squared!`
    case 4:
      return `Matrix C selects the output. Computing: C·w = 0×1 + 0×${xValue} + 1×${xValue * xValue} = ${constraintValue}`
    case 5:
      return isCorrect
        ? `Success! ${productValue} === ${constraintValue}. The constraint is satisfied because ${xValue}² equals the output. You can create a valid proof!`
        : `Failed! ${productValue} ≠ ${constraintValue}. The constraint is NOT satisfied because ${xValue}² doesn't equal the target output. No valid proof possible.`
    default:
      return ''
  }
}
