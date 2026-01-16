# ZK Visualizer

Learn how zero-knowledge proofs work by watching them happen. An interactive educational tool that visualizes circuit construction, witness generation, and proof verification step-by-step.

## About

ZK Visualizer helps beginners understand zero-knowledge proofs by breaking down the process into simple, visual steps. Instead of reading abstract explanations, you can see exactly how a ZK proof works from start to finish.

## Features (MVP)

- 📚 **Step-by-step walkthrough**: Six clear steps from problem to verification
- 🎯 **Simple example**: Prove you know a number x where x² = 9
- 🎨 **Clean UI**: Built with React, TypeScript, and Tailwind CSS
- 🔒 **Zero-knowledge**: See how proofs work without revealing secrets
- 🌐 **Browser-based**: All ZK operations run in your browser (via snarkjs)

## The Six Steps

1. **The Problem** - What are we trying to prove?
2. **The Circuit** - How do we represent the computation?
3. **The Constraints** - Mathematical rules that must be satisfied
4. **The Witness** - Private input assignment
5. **Proof Generation** - Creating the zero-knowledge proof
6. **Verification** - Verifying without revealing secrets

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### View the App

Open your browser to `http://localhost:5173` after running `npm run dev`.

## Project Structure

```
zk-visualizer/
├── circuits/           # Circom circuit files
│   └── square.circom   # x² = 9 circuit
├── src/
│   ├── components/     # React components
│   │   ├── steps/      # Step-by-step components
│   │   └── StepContainer.tsx
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # ZK proof utilities (snarkjs)
│   ├── App.tsx         # Main application
│   └── main.tsx        # Entry point
└── package.json
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **ZK Proofs**: snarkjs + Circom
- **Proof System**: Groth16

## Next Steps

For the full MVP with working ZK proofs:

1. Compile the Circom circuit to WASM
2. Generate proving and verification keys
3. Integrate real snarkjs proof generation
4. Add circuit visualization
5. Create interactive parameter inputs

## Learn More

- [Circom Documentation](https://docs.circom.io/)
- [snarkjs](https://github.com/iden3/snarkjs)
- [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

## License

MIT
