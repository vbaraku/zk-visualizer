import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
import BottomControlBar from '../layout/BottomControlBar'
import PolynomialVisualization from '../polynomial/PolynomialVisualization'

interface StepPolynomialsProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onNext: () => void
  onPrevious: () => void
  xValue: number
}

export default function StepPolynomials({
  currentStepIndex,
  totalSteps,
  stepName,
  onNext,
  onPrevious,
  xValue,
}: StepPolynomialsProps) {
  return (
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4">4. The Polynomials</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6">
          You've witnessed the transformation from R1CS constraints to QAP (Quadratic Arithmetic Program) polynomials!
          This is the KEY insight that makes ZK proofs work.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            The QAP Transformation
          </span>
          <div className="text-md space-y-2">
            <p>• Polynomials encode ALL constraints compactly</p>
            <p>• Random checks catch cheaters with high probability</p>
            <p>• Check ONE equation instead of n constraints</p>
            <p>• Makes proofs SUCCINCT — constant size!</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Understanding Polynomial Proofs</h3>
        <div className="space-y-3 text-text-light-secondary text-sm mb-6">
          <p>
            <strong className="text-text-light-primary">Why Polynomials?</strong> They give us a magical
            property called the <em>Schwartz-Zippel lemma</em>: different polynomials rarely agree
            at random points.
          </p>
          <p>
            <strong className="text-text-light-primary">The Key Insight:</strong> Instead of checking ALL
            constraints individually, we encode them into polynomials and check ONE equation at ONE
            random point.
          </p>
          <p>
            <strong className="text-text-light-primary">QAP (Quadratic Arithmetic Program):</strong> The
            transformation from R1CS constraints to polynomial form. The equation A(x)·B(x) - C(x) =
            H(x)·Z(x) must hold for all constraint evaluation points.
          </p>
          <p>
            <strong className="text-text-light-primary">Succinctness:</strong> This is what makes ZK
            proofs SUCCINCT — constant-size proofs regardless of circuit complexity!
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-3">The Math Behind the Magic</h3>
        <div className="space-y-4 text-sm text-text-light-secondary">
          <div>
            <p className="font-bold text-text-light-primary">Lagrange Interpolation:</p>
            <p>Given n points, we can find a polynomial of degree n-1 that passes through all of them.</p>
          </div>

          <div>
            <p className="font-bold text-text-light-primary">The Vanishing Polynomial Z(x):</p>
            <p>A polynomial that equals zero at all constraint evaluation points.</p>
          </div>

          <div>
            <p className="font-bold text-text-light-primary">The Quotient Polynomial H(x):</p>
            <p>The result of dividing A(x)·B(x) - C(x) by Z(x). If it exists, constraints are satisfied!</p>
          </div>
        </div>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2 text-text-light-secondary">"This polynomial magic transforms constraint checking into a single elegant equation."</p>
          </div>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 p-6 pb-24">
          <PolynomialVisualization xValue={xValue} />
        </div>

        <BottomControlBar
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          stepName={stepName}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </CanvasPanel>
    </>
  )
}
