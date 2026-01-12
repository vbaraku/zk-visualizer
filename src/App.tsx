import { useState } from 'react'
import StepContainer from './components/StepContainer'
import { Step } from './types'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('problem')
  const [proofData, setProofData] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ZK Visualizer
          </h1>
          <p className="text-xl text-gray-600">
            Learn how Zero-Knowledge Proofs work, step by step
          </p>
        </header>

        <StepContainer
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          proofData={proofData}
          setProofData={setProofData}
        />
      </div>
    </div>
  )
}

export default App
