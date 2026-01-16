export type Step = 'problem' | 'circuit' | 'constraints' | 'polynomials' | 'witness' | 'proof' | 'verification'

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
    id: 'polynomials',
    title: 'The Polynomials',
    description: 'How polynomials enable succinct proofs',
    order: 4
  },
  {
    id: 'witness',
    title: 'The Witness',
    description: 'Private inputs that satisfy the constraints',
    order: 5
  },
  {
    id: 'proof',
    title: 'Proof Generation',
    description: 'Creating the zero-knowledge proof',
    order: 6
  },
  {
    id: 'verification',
    title: 'Verification',
    description: 'Verifying the proof without revealing secrets',
    order: 7
  }
]

// Re-export circuit types
export * from './circuit'

// Re-export animation types
export * from './animation'

// Re-export R1CS types
export * from './r1cs'

// Re-export polynomial types
export * from './polynomial'
