# ZK Visualizer

Learn how zero-knowledge proofs work by watching them happen. An interactive educational tool that visualizes the entire ZK proof pipeline — from problem statement to verification.

![ZK Visualizer](https://img.shields.io/badge/status-beta-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Why This Exists

The ZK education space has plenty of code tools and theoretical explanations, but nothing that shows you **what actually happens** when a proof is generated. ZK Visualizer bridges that gap with:

- **Real cryptography** via snarkjs (not simulations)
- **Step-by-step visibility** into the entire pipeline
- **Interactive demos** that make abstract concepts tangible

## Features

- 🎯 **7-Step Educational Journey**: Problem → Circuit → R1CS → Polynomials → Witness → Proof → Verification
- 🔐 **Real ZK Proofs**: Actual Groth16 proofs generated in your browser via snarkjs
- 📊 **Animated Visualizations**: Watch circuit evaluation, constraint checking, and verification unfold
- 👁️ **Prover/Verifier Perspectives**: Toggle between what each party knows
- 🧪 **Tamper Detection Demo**: See verification fail when data is modified

## The Seven Steps

| Step | Name | What You Learn |
|------|------|----------------|
| 1 | **Problem** | Frame the ZK problem: prove you know x where x² = 9 |
| 2 | **Circuit** | See the computation as a circuit with animated signal flow |
| 3 | **Constraints** | Watch R1CS matrices transform the circuit into math |
| 4 | **Polynomials** | Understand why polynomials enable succinct proofs |
| 5 | **Witness** | See the prover's secret vs. what the verifier knows |
| 6 | **Proof** | Generate a real Groth16 proof and inspect its structure |
| 7 | **Verification** | Verify the proof and test tamper detection |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vbaraku/zk-visualizer.git
cd zk-visualizer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
zk-visualizer/
├── circuits/                    # Circom circuit files
│   └── square.circom            # x² = y circuit
├── public/
│   └── circuits/                # Compiled circuit artifacts (wasm, zkey, vkey)
├── src/
│   ├── components/
│   │   ├── circuit/             # Circuit visualization (React Flow)
│   │   ├── r1cs/                # R1CS matrix visualization
│   │   ├── polynomial/          # Polynomial plots (D3.js)
│   │   ├── layout/              # NotebookPanel, CanvasPanel, BottomControlBar
│   │   └── steps/               # Step components (StepProblem, StepCircuit, etc.)
│   ├── core/                    # Core logic (witness computation, QAP)
│   ├── hooks/                   # Custom React hooks (animations)
│   ├── stores/                  # Zustand state management
│   ├── types/                   # TypeScript definitions
│   ├── utils/                   # snarkjs wrapper, helpers
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Circuit Viz | React Flow |
| Graphs | D3.js |
| Animations | Framer Motion |
| ZK Proofs | snarkjs + Circom |
| Proof System | Groth16 |

## How It Works

1. **Circuit Definition**: A simple Circom circuit (`x * x === y`) is pre-compiled
2. **Witness Generation**: User inputs are used to compute all signal values
3. **R1CS Check**: The witness is validated against constraint matrices
4. **Proof Generation**: snarkjs creates a Groth16 proof (3 elliptic curve points)
5. **Verification**: The proof is verified using pairing checks

All cryptographic operations happen in the browser — no server required.

## Roadmap

- [ ] Additional circuits (range proof, hash preimage, Merkle proof)
- [ ] "Break It" mode — explore what happens with invalid witnesses
- [ ] Circuit builder — create your own circuits
- [ ] Side-by-side proof system comparison (Groth16 vs PLONK)
- [ ] Export/share functionality

## Learning Resources

- [Circom Documentation](https://docs.circom.io/)
- [snarkjs GitHub](https://github.com/iden3/snarkjs)
- [RareSkills ZK Book](https://www.rareskills.io/zk-book)
- [Vitalik's SNARK Explainer](https://vitalik.eth.limo/general/2021/01/26/snarks.html)

## Contributing

Contributions welcome! Please open an issue first to discuss what you'd like to change.

## License

MIT