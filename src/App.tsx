import { useState } from 'react'
import StepContainer from './components/StepContainer'
import { Step } from './types'

// Fixed target: we're always proving "I know x where x² = 9"
const TARGET_OUTPUT = 9

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('problem')
  const [proofData, setProofData] = useState<any>(null)
  const [xValue, setXValue] = useState<number>(3)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            ZK Visualizer
          </h1>
          <p className="text-xl text-text-secondary">
            Learn how Zero-Knowledge Proofs work, step by step
          </p>
        </header>

        <StepContainer
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          proofData={proofData}
          setProofData={setProofData}
          xValue={xValue}
          setXValue={setXValue}
          targetOutput={TARGET_OUTPUT}
        />
      </div>
    </div>
  )
}

export default App
