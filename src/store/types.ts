import { Step } from '../types'
import { CircuitDefinition, Witness } from '../types/circuit'

/**
 * Application State Types
 */

export interface ProofState {
  proof: any | null
  publicSignals: any[] | null
  isGenerating: boolean
  isVerified: boolean | null
}

export interface AppState {
  // Tutorial state
  currentStep: Step
  targetOutput: number

  // Circuit state
  currentCircuit: CircuitDefinition
  witness: Witness
  computedValues: Witness

  // Proof state
  proofState: ProofState

  // UI state
  animationSpeed: number
  expandedPanels: {
    [key: string]: boolean
  }
}

export type AppAction =
  | { type: 'SET_STEP'; step: Step }
  | { type: 'SET_WITNESS_VALUE'; signalId: string; value: number }
  | { type: 'SET_COMPUTED_VALUES'; values: Witness }
  | { type: 'SET_PROOF_DATA'; proof: any; publicSignals: any[] }
  | { type: 'SET_PROOF_GENERATING'; isGenerating: boolean }
  | { type: 'SET_PROOF_VERIFIED'; isVerified: boolean }
  | { type: 'SET_ANIMATION_SPEED'; speed: number }
  | { type: 'TOGGLE_PANEL'; panelId: string }
  | { type: 'RESET_PROOF_STATE' }
