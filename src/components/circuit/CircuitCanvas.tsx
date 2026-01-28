import { useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import InputNode from './nodes/InputNode'
import GateNode from './nodes/GateNode'
import OutputNode from './nodes/OutputNode'
import AnimatedEdge from './edges/AnimatedEdge'
import { CircuitDefinition } from '../../types/circuit'
import { NodeState, EdgeState } from '../../types/animation'

/**
 * CircuitCanvas - Main circuit visualization component using React Flow
 *
 * Takes a circuit definition and witness values, renders an interactive
 * circuit diagram with custom nodes.
 */

interface CircuitCanvasProps {
  circuit: CircuitDefinition
  witnessValues: { [signalId: string]: number }
  targetOutput?: number
  nodeStates?: Record<string, NodeState>
  edgeStates?: Record<string, { state: EdgeState; showParticle: boolean }>
}

// Register custom node types
const nodeTypes = {
  inputSignal: InputNode,
  gateNode: GateNode,
  outputSignal: OutputNode,
}
// Register custom edge types
const edgeTypes = {
  animated: AnimatedEdge,
}

export default function CircuitCanvas({
  circuit,
  witnessValues,
  targetOutput,
  nodeStates,
  edgeStates,
}: CircuitCanvasProps) {
  // Build nodes from circuit definition
  const initialNodes = useMemo(() => {
    const nodes: Node[] = []

    // Create nodes for each signal that has a layout position
    circuit.layout.nodes.forEach((layoutNode) => {
      const signal = circuit.signals.find((s) => s.id === layoutNode.id)
      if (signal) {
        const value = witnessValues[signal.id] ?? signal.value ?? '?'

        if (signal.type === 'private') {
          nodes.push({
            id: signal.id,
            type: 'inputSignal',
            position: layoutNode.position,
            data: {
              label: signal.name,
              value: value,
              description: signal.description,
              isPrivate: true,
              nodeState: nodeStates?.[signal.id] || 'complete',
            },
          })
        } else if (signal.type === 'public') {
          nodes.push({
            id: signal.id,
            type: 'outputSignal',
            position: layoutNode.position,
            data: {
              label: signal.name,
              value: value,
              expectedValue: targetOutput,
              description: signal.description,
              nodeState: nodeStates?.[signal.id] || 'complete',
            },
          })
        }
      }

      // Check if this is a gate
      const gate = circuit.gates.find((g) => g.id === layoutNode.id)
      if (gate) {
        nodes.push({
          id: gate.id,
          type: 'gateNode',
          position: layoutNode.position,
          data: {
            label: gate.type === 'mul' ? 'Multiply' : 'Add',
            operation: gate.label || (gate.type === 'mul' ? '×' : '+'),
            description: gate.type === 'mul' ? 'Multiplication gate' : 'Addition gate',
            nodeState: nodeStates?.[gate.id] || 'complete',
          },
        })
      }
    })

    return nodes
  }, [circuit, witnessValues, targetOutput, nodeStates])

  // Build edges from circuit gates
  const initialEdges = useMemo(() => {
    const edges: Edge[] = []

    circuit.gates.forEach((gate) => {
      // Connect inputs to gate
      gate.inputs.forEach((inputId, index) => {
        const edgeId = `${inputId}-${gate.id}-${index}`
        edges.push({
          id: edgeId,
          source: inputId,
          target: gate.id,
          targetHandle: `input-${index + 1}`,
          animated: true,
          style: {
            stroke: '#FBBF24', // signal-private color
            strokeWidth: 3,
          },
          type: 'animated',
          data: {
            edgeState: edgeStates?.[edgeId]?.state || 'idle',
            showParticle: edgeStates?.[edgeId]?.showParticle || false,
          },
        })
      })

      // Connect gate to output
      const outputValue = witnessValues[gate.output]
      const isCorrect = targetOutput === undefined || outputValue === targetOutput
      const edgeId = `${gate.id}-${gate.output}`

      edges.push({
        id: edgeId,
        source: gate.id,
        target: gate.output,
        animated: true,
        style: {
          stroke: isCorrect ? '#22C55E' : '#EF4444', // success or error
          strokeWidth: 3,
        },
        type: 'animated',
        data: {
          edgeState: edgeStates?.[edgeId]?.state || 'idle',
          showParticle: edgeStates?.[edgeId]?.showParticle || false,
        },
      })
    })

    return edges
  }, [circuit, witnessValues, targetOutput, edgeStates])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes and edges when witness values change
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  return (
    <div className="w-full h-full bg-surface rounded-lg overflow-hidden border-2 border-border-subtle">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: ConnectionLineType.SmoothStep,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#334155"
          className="bg-surface"
        />
      </ReactFlow>
    </div>
  )
}
