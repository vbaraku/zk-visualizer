import PolynomialVisualization from '../polynomial/PolynomialVisualization'

interface StepPolynomialsProps {
  onNext: () => void
  onPrevious: () => void
  xValue: number
}

export default function StepPolynomials({
  onNext,
  onPrevious,
  xValue,
}: StepPolynomialsProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Step 4: The Polynomials
      </h2>

      {/* Main Polynomial Visualization */}
      <PolynomialVisualization xValue={xValue} />

      {/* Additional Educational Content */}
      <div className="mt-8 space-y-4">
        <div className="bg-accent-secondary/10 border-l-4 border-accent-secondary p-6 rounded">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            The QAP Transformation
          </h4>
          <p className="text-text-secondary">
            You've just witnessed the transformation from R1CS constraints to QAP (Quadratic
            Arithmetic Program) polynomials! This is the KEY insight that makes ZK proofs work:
          </p>
          <ul className="list-disc list-inside text-text-secondary ml-4 mt-2 space-y-1">
            <li>
              Polynomials encode ALL constraints in a compact mathematical form
            </li>
            <li>
              The Schwartz-Zippel lemma ensures random checks catch cheaters with overwhelming
              probability
            </li>
            <li>
              Instead of checking n constraints, we check ONE polynomial equation at ONE point
            </li>
            <li>
              This is what makes proofs SUCCINCT — constant size regardless of complexity!
            </li>
          </ul>
        </div>

        <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            The Math Behind the Magic
          </h4>
          <div className="space-y-3 text-text-secondary text-sm">
            <p>
              <strong className="text-text-primary">Lagrange Interpolation:</strong> Given n
              points, we can always find a unique polynomial of degree n-1 that passes through all
              of them. This is how we go from constraint evaluation points to polynomial curves.
            </p>
            <p>
              <strong className="text-text-primary">The Vanishing Polynomial Z(x):</strong> A
              polynomial that equals zero at all constraint evaluation points. If the prover's
              witness is valid, then A(x)·B(x) - C(x) must be divisible by Z(x).
            </p>
            <p>
              <strong className="text-text-primary">The Quotient Polynomial H(x):</strong> The
              result of dividing A(x)·B(x) - C(x) by Z(x). If H(x) exists (no remainder), the
              constraints are satisfied. If it doesn't exist, the prover is cheating!
            </p>
            <p>
              <strong className="text-text-primary">Random Evaluation:</strong> The verifier picks
              a random secret point τ (tau) and checks if A(τ)·B(τ) - C(τ) = H(τ)·Z(τ). Different
              polynomials can only agree at a few points, so this check catches cheaters.
            </p>
          </div>
        </div>

        <div className="bg-accent-primary/10 border-l-4 border-accent-primary p-6 rounded">
          <h4 className="text-lg font-semibold text-text-primary mb-3">
            Why This Matters for ZK Proofs
          </h4>
          <p className="text-text-secondary mb-3">
            The polynomial transformation is what enables the three key properties of zero-knowledge
            proofs:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-surface rounded">
              <div className="font-semibold text-signal-success mb-2">✓ Completeness</div>
              <div className="text-text-secondary">
                If the prover knows a valid witness, they can always compute H(x) and pass the
                check
              </div>
            </div>
            <div className="p-4 bg-surface rounded">
              <div className="font-semibold text-signal-processing mb-2">✓ Soundness</div>
              <div className="text-text-secondary">
                If the prover doesn't have a valid witness, the random check will catch them with
                overwhelming probability
              </div>
            </div>
            <div className="p-4 bg-surface rounded">
              <div className="font-semibold text-accent-primary mb-2">✓ Succinctness</div>
              <div className="text-text-secondary">
                The proof is constant-size: just polynomial evaluations, not all constraint values
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border-2 border-border-subtle rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-3">Next Steps</h4>
          <p className="text-text-secondary">
            Now that you understand how polynomials enable succinct proofs, we'll see how the
            witness (your secret input values) fits into this framework. Then we'll generate an
            actual zero-knowledge proof and verify it — all while keeping your secrets hidden!
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-surface-subtle hover:bg-surface border-2 border-border-subtle text-text-primary rounded-lg font-semibold transition-colors"
        >
          ← Previous: Constraints
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-lg font-semibold transition-colors"
        >
          Next: Witness →
        </button>
      </div>
    </div>
  )
}
