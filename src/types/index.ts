export type Step = 'problem' | 'circuit' | 'constraints' | 'witness' | 'proof' | 'verification'

export interface ProofData {
  proof: any
  publicSignals: any[]
  witness?: any
  constraints?: any
  circuit?: any
}

export interface StepInfo {
  id: Step
  title: string
  description: string
  order: number
}

export const STEPS: StepInfo[] = [
  {
    id: 'problem',
    title: 'The Problem',
    description: 'What are we trying to prove?',
    order: 1
  },
  {
    id: 'circuit',
    title: 'The Circuit',
    description: 'How do we represent the computation?',
    order: 2
  },
  {
    id: 'constraints',
    title: 'The Constraints',
    description: 'Mathematical rules that must be satisfied',
    order: 3
  },
  {
    id: 'witness',
    title: 'The Witness',
    description: 'Private inputs that satisfy the constraints',
    order: 4
  },
  {
    id: 'proof',
    title: 'Proof Generation',
    description: 'Creating the zero-knowledge proof',
    order: 5
  },
  {
    id: 'verification',
    title: 'Verification',
    description: 'Verifying the proof without revealing secrets',
    order: 6
  }
]
