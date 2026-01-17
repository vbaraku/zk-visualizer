import NotebookPanel from '../layout/NotebookPanel'
import CanvasPanel from '../layout/CanvasPanel'
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
    <>
      <NotebookPanel>
        <h2 className="text-xl font-bold mb-4 font-serif-edu">4. The Polynomials</h2>

        <p className="text-text-light-secondary text-md leading-relaxed mb-6 font-serif-edu">
          You've witnessed the transformation from R1CS constraints to QAP (Quadratic Arithmetic Program) polynomials!
          This is the KEY insight that makes ZK proofs work.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 handwritten bg-white px-2 border rounded-md shadow-sm text-sm">
            The QAP Transformation
          </span>
          <div className="text-md space-y-2 font-serif-edu">
            <p>• Polynomials encode ALL constraints compactly</p>
            <p>• Random checks catch cheaters with high probability</p>
            <p>• Check ONE equation instead of n constraints</p>
            <p>• Makes proofs SUCCINCT — constant size!</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 font-serif-edu">The Math Behind the Magic</h3>
        
        <div className="space-y-4 text-sm font-serif-edu text-text-light-secondary">
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

        <div className="handwritten text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <div>
            <p className="mb-2">"This polynomial magic transforms constraint checking into a single elegant equation."</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-text-light-primary hover:bg-gray-100 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Previous</span>
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
          >
            <span>Next Step</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 p-6">
          <PolynomialVisualization xValue={xValue} />
        </div>
      </CanvasPanel>
    </>
  )
}
