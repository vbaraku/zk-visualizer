import { useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface StepCircuitProps {
  onNext: () => void
  onPrevious: () => void
  targetOutput: number
  xValue: number
}

// Custom node component for displaying values with animations
const CustomNode = ({ data }: any) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [data.value])

  const isPrivate = data.type === 'input'
  const isOutput = data.type === 'output'
  const isCorrect = data.isCorrect

  const bgColor = isPrivate
    ? 'bg-yellow-50'
    : isOutput
    ? isCorrect
      ? 'bg-green-50'
      : 'bg-red-50'
    : 'bg-blue-50'

  const borderColor = isPrivate
    ? 'border-yellow-400'
    : isOutput
    ? isCorrect
      ? 'border-green-400'
      : 'border-red-400'
    : 'border-blue-400'

  const labelColor = isPrivate
    ? 'text-yellow-900'
    : isOutput
    ? isCorrect
      ? 'text-green-900'
      : 'text-red-900'
    : 'text-blue-900'

  return (
    <div className="relative">
      <div
        className={`${bgColor} border-2 ${borderColor} rounded-lg px-6 py-4 min-w-[120px] text-center transition-all duration-300 ${
          animate ? 'scale-110 shadow-lg' : 'scale-100'
        }`}
      >
        <div className={`text-xs font-semibold ${labelColor} mb-1`}>
          {data.label}
        </div>
        <div className={`text-2xl font-mono font-bold ${labelColor}`}>
          {data.value}
        </div>
        {data.subtitle && (
          <div className="text-xs text-gray-600 mt-1">{data.subtitle}</div>
        )}
      </div>
      {isPrivate && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          🔒 Private
        </div>
      )}
      {isOutput && (
        <div className={`absolute -top-2 -right-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full font-bold`}>
          {isCorrect ? '✓ Public' : '✗ Wrong'}
        </div>
      )}
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export default function StepCircuit({ onNext, onPrevious, targetOutput, xValue }: StepCircuitProps) {
  const userOutput = xValue * xValue
  const isCorrect = userOutput === targetOutput

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'custom',
      position: { x: 50, y: 100 },
      data: {
        label: 'Input',
        value: `x = ${xValue}`,
        type: 'input',
        subtitle: 'Secret value',
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        label: 'Multiply Gate',
        value: `${xValue} × ${xValue}`,
        type: 'gate',
        subtitle: 'x * x',
      },
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 550, y: 100 },
      data: {
        label: 'Output',
        value: `out = ${userOutput}`,
        type: 'output',
        subtitle: `Target: ${targetOutput}`,
        isCorrect,
      },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#f59e0b', strokeWidth: 3 },
      label: String(xValue),
      labelStyle: { fill: '#f59e0b', fontWeight: 700 },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animated: true,
      style: {
        stroke: isCorrect ? '#10b981' : '#ef4444',
        strokeWidth: 3,
      },
      label: String(userOutput),
      labelStyle: {
        fill: isCorrect ? '#10b981' : '#ef4444',
        fontWeight: 700,
      },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes and edges when xValue changes
  useEffect(() => {
    const newUserOutput = xValue * xValue
    const newIsCorrect = newUserOutput === targetOutput

    setNodes([
      {
        id: '1',
        type: 'custom',
        position: { x: 50, y: 100 },
        data: {
          label: 'Input',
          value: `x = ${xValue}`,
          type: 'input',
          subtitle: 'Secret value',
        },
      },
      {
        id: '2',
        type: 'custom',
        position: { x: 300, y: 100 },
        data: {
          label: 'Multiply Gate',
          value: `${xValue} × ${xValue}`,
          type: 'gate',
          subtitle: 'x * x',
        },
      },
      {
        id: '3',
        type: 'custom',
        position: { x: 550, y: 100 },
        data: {
          label: 'Output',
          value: `out = ${newUserOutput}`,
          type: 'output',
          subtitle: `Target: ${targetOutput}`,
          isCorrect: newIsCorrect,
        },
      },
    ])

    setEdges([
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 3 },
        label: String(xValue),
        labelStyle: { fill: '#f59e0b', fontWeight: 700 },
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        animated: true,
        style: {
          stroke: newIsCorrect ? '#10b981' : '#ef4444',
          strokeWidth: 3,
        },
        label: String(newUserOutput),
        labelStyle: {
          fill: newIsCorrect ? '#10b981' : '#ef4444',
          fontWeight: 700,
        },
      },
    ])
  }, [xValue, targetOutput, setNodes, setEdges])

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Step 2: The Circuit</h2>

      <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-3">
          Arithmetic Circuit Visualization
        </h3>
        <p className="text-purple-800">
          Watch how your value flows through the circuit! The circuit takes your secret input,
          processes it, and produces a public output.
        </p>
      </div>

      {/* React Flow Circuit Visualization */}
      <div className="bg-white border-2 border-gray-200 rounded-lg mb-6 overflow-hidden">
        <div style={{ height: '300px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>
        </div>
        <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>Private (secret)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Public (correct)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Public (wrong)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">What is a Circuit?</h4>
          <p className="text-gray-600">
            A circuit is a way to represent a computation using basic operations (addition, multiplication).
            Think of it like a flowchart for math operations. The animated diagram above shows exactly how
            values flow through the circuit.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Our Circuit</h4>
          <p className="text-gray-600">
            Our circuit is simple: it takes a private input <code className="bg-gray-100 px-1 rounded">x = {xValue}</code>,
            multiplies it by itself in the gate, and outputs <code className="bg-gray-100 px-1 rounded">{userOutput}</code>.
            {isCorrect ? (
              <span className="text-green-600 font-semibold"> ✓ This matches our target of {targetOutput}!</span>
            ) : (
              <span className="text-red-600 font-semibold"> ✗ This doesn't match our target of {targetOutput}.</span>
            )}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Privacy in the Circuit</h4>
          <p className="text-gray-600">
            Notice how the input <code className="bg-yellow-100 px-1 rounded">x</code> is marked as private (🔒) while
            the output <code className={`${isCorrect ? 'bg-green-100' : 'bg-red-100'} px-1 rounded`}>out</code> is
            public. The zero-knowledge proof will convince verifiers that you know an x that produces the correct output,
            without revealing what x is!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Circuit Code (Circom)</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`template Square() {
    signal private input x;  // Your secret: ${xValue}
    signal output out;       // Public result: ${userOutput}

    out <== x * x;           // Constraint: out must equal x²
}`}</pre>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Next: Constraints →
        </button>
      </div>
    </div>
  )
}
