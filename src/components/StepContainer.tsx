import { Step, STEPS } from '../types'
import StepProblem from './steps/StepProblem'
import StepCircuit from './steps/StepCircuit'
import StepConstraints from './steps/StepConstraints'
import StepPolynomials from './steps/StepPolynomials'
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
  targetOutput: number
}

export default function StepContainer({
  currentStep,
  setCurrentStep,
  proofData,
  setProofData,
  xValue,
  setXValue,
  targetOutput,
}: StepContainerProps) {
  const currentStepInfo = STEPS.find((s) => s.id === currentStep)!

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
    const stepIndex = currentStepInfo.order - 1 // Convert to 0-based index
    const totalSteps = STEPS.length

    switch (currentStep) {
      case 'problem':
        return (
          <StepProblem
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onNext={handleNext}
            onPrevious={handlePrevious}
            xValue={xValue}
            setXValue={setXValue}
            targetOutput={targetOutput}
          />
        )
      case 'circuit':
        return (
          <StepCircuit
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onNext={handleNext}
            onPrevious={handlePrevious}
            targetOutput={targetOutput}
            xValue={xValue}
          />
        )
      case 'constraints':
        return (
          <StepConstraints
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onNext={handleNext}
            onPrevious={handlePrevious}
            targetOutput={targetOutput}
            xValue={xValue}
          />
        )
      case 'polynomials':
        return (
          <StepPolynomials
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onNext={handleNext}
            onPrevious={handlePrevious}
            xValue={xValue}
          />
        )
      case 'witness':
        return (
          <StepWitness
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onNext={handleNext}
            onPrevious={handlePrevious}
            xValue={xValue}
            targetOutput={targetOutput}
          />
        )
      case 'proof':
        return (
          <StepProof
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onNext={handleNext}
            onPrevious={handlePrevious}
            setProofData={setProofData}
            xValue={xValue}
            targetOutput={targetOutput}
          />
        )
      case 'verification':
        return (
          <StepVerification
            currentStepIndex={stepIndex}
            totalSteps={totalSteps}
            stepName={currentStepInfo.title}
            onPrevious={handlePrevious}
            proofData={proofData}
            xValue={xValue}
            targetOutput={targetOutput}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="flex h-[calc(100vh-64px)] overflow-hidden">
      {renderStep()}
    </main>
  )
}
