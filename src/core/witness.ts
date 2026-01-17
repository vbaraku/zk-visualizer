/**
 * Witness Computation Engine
 *
 * Generates step-by-step computation steps for circuit execution
 */

import { CircuitDefinition } from '../types/circuit'
import { ComputationStep } from '../types/animation'

/**
 * Generate computation steps from circuit definition and input values
 *
 * For the square circuit (x² = out), generates:
 * 1. Initialize: Input signal x receives its value
 * 2. Compute Gate: Multiply gate computes x × x
 * 3. Propagate: Result flows to output signal
 * 4. Complete: All signals have values
 */
export function generateComputationSteps(
  _circuit: CircuitDefinition,
  inputs: Record<string, number>
): ComputationStep[] {
  const steps: ComputationStep[] = []

  // For the square circuit, we have a simple computation flow
  // This is hardcoded for now, but can be generalized later
  // The circuit parameter is prefixed with underscore to indicate it's unused currently

  const xValue = inputs.x || 0
  const outputValue = xValue * xValue

  // Step 1: Initialize input
  steps.push({
    id: 'step-1',
    type: 'input',
    description: `Input x receives value ${xValue}`,
    signalUpdates: [
      {
        signalId: 'x',
        value: xValue,
        label: 'x',
      },
    ],
    activeNodes: ['x'],
    activeEdges: [],
  })

  // Step 2: Compute gate
  steps.push({
    id: 'step-2',
    type: 'gate',
    description: `Computing ${xValue} × ${xValue} = ${outputValue}`,
    signalUpdates: [],
    activeNodes: ['mul1'],
    activeEdges: ['x-mul1-0', 'x-mul1-1'], // Both inputs to the multiply gate
  })

  // Step 3: Propagate to output
  steps.push({
    id: 'step-3',
    type: 'output',
    description: `Output receives result ${outputValue}`,
    signalUpdates: [
      {
        signalId: 'out',
        value: outputValue,
        label: 'out',
      },
    ],
    activeNodes: ['out'],
    activeEdges: ['mul1-out'],
  })

  // Step 4: Complete
  steps.push({
    id: 'step-4',
    type: 'complete',
    description: `Circuit execution complete`,
    signalUpdates: [],
    activeNodes: [],
    activeEdges: [],
  })

  return steps
}

/**
 * Compute the witness values at a given step
 * Returns which signals have been computed up to this step
 */
export function getWitnessAtStep(
  steps: ComputationStep[],
  stepIndex: number
): Record<string, number> {
  const witness: Record<string, number> = {}

  // Apply all signal updates up to the current step
  for (let i = 0; i <= stepIndex && i < steps.length; i++) {
    const step = steps[i]
    for (const update of step.signalUpdates) {
      witness[update.signalId] = update.value
    }
  }

  return witness
}

/**
 * Get the node states for a given step
 * Determines which nodes should be idle/active/complete
 */
export function getNodeStatesAtStep(
  steps: ComputationStep[],
  stepIndex: number,
  allNodeIds: string[]
): Record<string, 'idle' | 'active' | 'computing' | 'receiving' | 'complete'> {
  const states: Record<string, any> = {}
  const witness = getWitnessAtStep(steps, stepIndex)

  if (stepIndex < 0 || stepIndex >= steps.length) {
    // All nodes idle
    allNodeIds.forEach((id) => {
      states[id] = 'idle'
    })
    return states
  }

  const currentStep = steps[stepIndex]

  allNodeIds.forEach((nodeId) => {
    // Check if this node is active in the current step
    if (currentStep.activeNodes.includes(nodeId)) {
      // Determine the specific active state based on step type
      if (currentStep.type === 'input') {
        states[nodeId] = 'active'
      } else if (currentStep.type === 'gate') {
        states[nodeId] = 'computing'
      } else if (currentStep.type === 'output') {
        states[nodeId] = 'receiving'
      } else {
        states[nodeId] = 'active'
      }
    }
    // Check if this node has been computed (has a value in witness)
    else if (witness[nodeId] !== undefined) {
      states[nodeId] = 'complete'
    }
    // Otherwise, it's idle (waiting)
    else {
      states[nodeId] = 'idle'
    }
  })

  return states
}

/**
 * Get the edge states for a given step
 * Determines which edges should animate
 */
export function getEdgeStatesAtStep(
  steps: ComputationStep[],
  stepIndex: number,
  allEdgeIds: string[]
): Record<string, { state: 'idle' | 'active' | 'complete'; showParticle: boolean }> {
  const states: Record<string, any> = {}

  if (stepIndex < 0 || stepIndex >= steps.length) {
    // All edges idle
    allEdgeIds.forEach((id) => {
      states[id] = { state: 'idle', showParticle: false }
    })
    return states
  }

  const currentStep = steps[stepIndex]

  allEdgeIds.forEach((edgeId) => {
    // Check if this edge is active in the current step
    if (currentStep.activeEdges.includes(edgeId)) {
      states[edgeId] = { state: 'active', showParticle: true }
    }
    // Check if this edge was active in any previous step
    else {
      let wasActive = false
      for (let i = 0; i < stepIndex && i < steps.length; i++) {
        if (steps[i].activeEdges.includes(edgeId)) {
          wasActive = true
          break
        }
      }
      states[edgeId] = {
        state: wasActive ? 'complete' : 'idle',
        showParticle: false,
      }
    }
  })

  return states
}
