import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { AppState, AppAction } from './types'
import { getDefaultCircuit } from '../circuits'

/**
 * Global Application Context
 *
 * Manages all application state including circuit data, witness values,
 * proof state, and UI state.
 */

// Initial state
const initialState: AppState = {
  currentStep: 'problem',
  targetOutput: 9,
  currentCircuit: getDefaultCircuit(),
  witness: {
    x: 3, // Default value
  },
  computedValues: {
    x: 3,
    out: 9,
  },
  proofState: {
    proof: null,
    publicSignals: null,
    isGenerating: false,
    isVerified: null,
  },
  animationSpeed: 1,
  expandedPanels: {},
}

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step }

    case 'SET_WITNESS_VALUE': {
      const newWitness = {
        ...state.witness,
        [action.signalId]: action.value,
      }
      // Auto-compute output for the square circuit
      const computedOut = action.signalId === 'x' ? action.value * action.value : state.computedValues.out
      return {
        ...state,
        witness: newWitness,
        computedValues: {
          ...state.computedValues,
          x: action.value,
          out: computedOut,
        },
      }
    }

    case 'SET_COMPUTED_VALUES':
      return {
        ...state,
        computedValues: action.values,
      }

    case 'SET_PROOF_DATA':
      return {
        ...state,
        proofState: {
          ...state.proofState,
          proof: action.proof,
          publicSignals: action.publicSignals,
          isGenerating: false,
        },
      }

    case 'SET_PROOF_GENERATING':
      return {
        ...state,
        proofState: {
          ...state.proofState,
          isGenerating: action.isGenerating,
        },
      }

    case 'SET_PROOF_VERIFIED':
      return {
        ...state,
        proofState: {
          ...state.proofState,
          isVerified: action.isVerified,
        },
      }

    case 'RESET_PROOF_STATE':
      return {
        ...state,
        proofState: {
          proof: null,
          publicSignals: null,
          isGenerating: false,
          isVerified: null,
        },
      }

    case 'SET_ANIMATION_SPEED':
      return { ...state, animationSpeed: action.speed }

    case 'TOGGLE_PANEL':
      return {
        ...state,
        expandedPanels: {
          ...state.expandedPanels,
          [action.panelId]: !state.expandedPanels[action.panelId],
        },
      }

    default:
      return state
  }
}

// Create context
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
