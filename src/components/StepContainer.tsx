import { Step, STEPS } from '../types'
import StepProblem from './steps/StepProblem'
import StepCircuit from './steps/StepCircuit'
import StepConstraints from './steps/StepConstraints'
import StepWitness from './steps/StepWitness'
import StepProof from './steps/StepProof'
import StepVerification from './steps/StepVerification'

interface StepContainerProps {
  currentStep: Step
  setCurrentStep: (step: Step) => void
  proofData: any
  setProofData: (data: any) => void
  xValue: number
  setXValue: (value: number) => void
}

export default function StepContainer({
  currentStep,
  setCurrentStep,
  proofData,
  setProofData,
  xValue,
  setXValue
}: StepContainerProps) {
  const currentStepInfo = STEPS.find(s => s.id === currentStep)!

  const handleNext = () => {
    const nextIndex = currentStepInfo.order
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id)
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepInfo.order - 2
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'problem':
        return <StepProblem onNext={handleNext} xValue={xValue} setXValue={setXValue} />
      case 'circuit':
        return <StepCircuit onNext={handleNext} onPrevious={handlePrevious} xValue={xValue} />
      case 'constraints':
        return <StepConstraints onNext={handleNext} onPrevious={handlePrevious} xValue={xValue} />
      case 'witness':
        return <StepWitness onNext={handleNext} onPrevious={handlePrevious} xValue={xValue} />
      case 'proof':
        return <StepProof onNext={handleNext} onPrevious={handlePrevious} setProofData={setProofData} xValue={xValue} />
      case 'verification':
        return <StepVerification onPrevious={handlePrevious} proofData={proofData} xValue={xValue} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.order <= currentStepInfo.order
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.order}
                </div>
                <span className="text-xs mt-2 text-center text-gray-600 hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition-all ${
                    step.order < currentStepInfo.order ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        {renderStep()}
      </div>
    </div>
  )
}
