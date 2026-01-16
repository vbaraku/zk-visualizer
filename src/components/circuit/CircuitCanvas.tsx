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
import { CircuitDefinition } from '../../types/circuit'

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
}

// Register custom node types
const nodeTypes = {
  input: InputNode,
  gate: GateNode,
  output: OutputNode,
}

export default function CircuitCanvas({
  circuit,
  witnessValues,
  targetOutput,
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
            type: 'input',
            position: layoutNode.position,
            data: {
              label: signal.name,
              value: value,
              description: signal.description,
              isPrivate: true,
            },
          })
        } else if (signal.type === 'public') {
          nodes.push({
            id: signal.id,
            type: 'output',
            position: layoutNode.position,
            data: {
              label: signal.name,
              value: value,
              expectedValue: targetOutput,
              description: signal.description,
            },
          })
        }
      }

      // Check if this is a gate
      const gate = circuit.gates.find((g) => g.id === layoutNode.id)
      if (gate) {
        nodes.push({
          id: gate.id,
          type: 'gate',
          position: layoutNode.position,
          data: {
            label: gate.type === 'mul' ? 'Multiply' : 'Add',
            operation: gate.label || (gate.type === 'mul' ? '×' : '+'),
            description: gate.type === 'mul' ? 'Multiplication gate' : 'Addition gate',
          },
        })
      }
    })

    return nodes
  }, [circuit, witnessValues, targetOutput])

  // Build edges from circuit gates
  const initialEdges = useMemo(() => {
    const edges: Edge[] = []

    circuit.gates.forEach((gate) => {
      // Connect inputs to gate
      gate.inputs.forEach((inputId, index) => {
        edges.push({
          id: `${inputId}-${gate.id}-${index}`,
          source: inputId,
          target: gate.id,
          targetHandle: `input-${index + 1}`,
          animated: true,
          style: {
            stroke: '#FBBF24', // signal-private color
            strokeWidth: 3,
          },
          type: ConnectionLineType.SmoothStep,
        })
      })

      // Connect gate to output
      const outputValue = witnessValues[gate.output]
      const isCorrect = targetOutput === undefined || outputValue === targetOutput

      edges.push({
        id: `${gate.id}-${gate.output}`,
        source: gate.id,
        target: gate.output,
        animated: true,
        style: {
          stroke: isCorrect ? '#22C55E' : '#EF4444', // success or error
          strokeWidth: 3,
        },
        type: ConnectionLineType.SmoothStep,
      })
    })

    return edges
  }, [circuit, witnessValues, targetOutput])

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
