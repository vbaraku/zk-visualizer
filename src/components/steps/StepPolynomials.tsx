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
          How do we go from checking many constraints to checking just one equation?
          The answer is polynomials.
        </p>

        <div className="bg-background-light p-5 rounded-xl border-l-4 border-primary mb-8 relative">
          <span className="absolute -right-4 -top-2 italic bg-white px-2 border rounded-md shadow-sm text-sm text-text-light-secondary">
            The Big Idea
          </span>
          <div className="text-md space-y-2">
            <p>• Encode ALL constraints into polynomials</p>
            <p>• Check ONE equation at a random point</p>
            <p>• Cheaters get caught with overwhelming probability</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">The QAP Identity</h3>
        <div className="space-y-3 text-text-light-secondary text-sm mb-6">
          <p>
            We transform R1CS into polynomials <span className="text-purple-600 font-semibold">A(x)</span>,{' '}
            <span className="text-blue-600 font-semibold">B(x)</span>,{' '}
            <span className="text-green-600 font-semibold">C(x)</span> such that:
          </p>
          
          <div className="bg-slate-100 p-4 rounded-lg text-center font-mono text-lg">
            <span className="text-purple-600">A(x)</span> · <span className="text-blue-600">B(x)</span> − <span className="text-green-600">C(x)</span> = <span className="text-orange-500">H(x)</span> · <span className="text-slate-600">Z(x)</span>
          </div>

          <p>
            If this equation holds, all constraints are satisfied. <span className="text-orange-500 font-semibold">H(x)</span> is the quotient polynomial — it only exists if the prover knows a valid witness.
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-3">The Schwartz-Zippel Lemma</h3>
        <div className="space-y-3 text-text-light-secondary text-sm mb-6">
          <p>
            <strong className="text-text-light-primary">Key insight:</strong> Two different polynomials of degree n can agree at <em>most</em> n points.
          </p>
          <p>
            If we check at a random point from a huge set (like 256-bit numbers), the chance of a cheater's fake polynomial matching at that exact point is negligibly small.
          </p>
          <p>
            <strong className="text-text-light-primary">This is why ZK proofs work:</strong> One random check is enough to catch cheaters with overwhelming probability!
          </p>
        </div>

        <div className="italic text-lg mt-8 border-t border-primary/20 pt-4 flex gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          <p className="text-text-light-secondary">
            "The magic of polynomials: check everything by checking almost nothing."
          </p>
        </div>
      </NotebookPanel>

      <CanvasPanel>
        <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-6 pb-24">
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