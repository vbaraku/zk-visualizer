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
    switch (currentStep) {
      case 'problem':
        return (
          <StepProblem
            onNext={handleNext}
            xValue={xValue}
            setXValue={setXValue}
            targetOutput={targetOutput}
          />
        )
      case 'circuit':
        return (
          <StepCircuit
            onNext={handleNext}
            onPrevious={handlePrevious}
            targetOutput={targetOutput}
            xValue={xValue}
          />
        )
      case 'constraints':
        return (
          <StepConstraints
            onNext={handleNext}
            onPrevious={handlePrevious}
            targetOutput={targetOutput}
            xValue={xValue}
          />
        )
      case 'polynomials':
        return (
          <StepPolynomials
            onNext={handleNext}
            onPrevious={handlePrevious}
            xValue={xValue}
          />
        )
      case 'witness':
        return (
          <StepWitness
            onNext={handleNext}
            onPrevious={handlePrevious}
            xValue={xValue}
            targetOutput={targetOutput}
          />
        )
      case 'proof':
        return (
          <StepProof
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
    <main className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Breadcrumb & Mode Selector */}
      <div className="bg-white border-b border-[#e7edf3] px-10 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <a className="text-text-light-secondary text-xs font-medium uppercase tracking-wider" href="#">
              Protocols
            </a>
            <span className="text-text-light-secondary text-xs">/</span>
            <a className="text-text-light-secondary text-xs font-medium uppercase tracking-wider" href="#">
              Zero-Knowledge
            </a>
            <span className="text-text-light-secondary text-xs">/</span>
            <span className="text-text-light-primary text-xs font-bold uppercase tracking-wider">
              Circuit Proofs
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{currentStepInfo.title}</h1>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden bg-background-light p-1">
            <button className="px-3 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-primary">
              Notebook
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-text-light-secondary hover:text-text-light-primary">
              Interactive
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-text-light-secondary hover:text-text-light-primary">
              Code
            </button>
          </div>
        </div>
      </div>

      {/* Split-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {renderStep()}
      </div>
    </main>
  )
}
