import { useState } from 'react'
import StepContainer from './components/StepContainer'
import LearnMore from './pages/LearnMore'
import LandingPage from './pages/LandingPage'
import { Step } from './types'

type Page = 'visualizer' | 'learn' | 'about'

// Fixed target: we're always proving "I know x where x² = 9"
const TARGET_OUTPUT = 9

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('about') // Start on landing
  const [currentStep, setCurrentStep] = useState<Step>('problem')
  const [proofData, setProofData] = useState<any>(null)
  const [xValue, setXValue] = useState<number>(3)

  const renderPage = () => {
    switch (currentPage) {
      case 'visualizer':
        return (
          <StepContainer
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            proofData={proofData}
            setProofData={setProofData}
            xValue={xValue}
            setXValue={setXValue}
            targetOutput={TARGET_OUTPUT}
          />
        )
      case 'learn':
        return <LearnMore />
      case 'about':
        return <LandingPage onStartVisualizer={() => setCurrentPage('visualizer')} />
    }
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-text-light-primary overflow-x-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-b-[#e7edf3] bg-white/80 backdrop-blur-md px-6 lg:px-10 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-text-light-primary hover:opacity-80 transition-opacity">
  {/* Container with fixed height to prevent pushing the header down */}
  <div className="size-8 flex items-center justify-center">
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="w-full h-full text-primary"
    >
      {/* The closed eyelid - moved slightly up to balance the long lashes */}
      <path d="M3 8a9 9 0 0 0 18 0" />
      
      {/* Longer Lashes pointing down */}
      <line x1="12" y1="17" x2="12" y2="22" />       {/* Center lash */}
      <line x1="7" y1="15.5" x2="4" y2="20" />      {/* Left lash */}
      <line x1="17" y1="15.5" x2="20" y2="20" />     {/* Right lash */}
    </svg>
  </div>
  
  {/* Align-baseline or self-center helps if the icon feels "floaty" */}
  <h2 className="text-xl font-bold leading-tight tracking-tight self-center">
    ZK<span className="text-primary">Visualizer</span>
  </h2>
</div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('about')}
              className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('visualizer')}
              className={`text-sm font-medium transition-colors ${currentPage === 'visualizer' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Visualizer
            </button>
            <button 
              onClick={() => setCurrentPage('learn')}
              className={`text-sm font-medium transition-colors ${currentPage === 'learn' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Learn More
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setCurrentPage('visualizer')}
              className={`text-xs font-medium px-2 py-1 rounded ${currentPage === 'visualizer' ? 'bg-primary/10 text-primary' : ''}`}
            >
              Visualizer
            </button>
            <button 
              onClick={() => setCurrentPage('learn')}
              className={`text-xs font-medium px-2 py-1 rounded ${currentPage === 'learn' ? 'bg-primary/10 text-primary' : ''}`}
            >
              Learn
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {renderPage()}
    </div>
  )
}

export default App