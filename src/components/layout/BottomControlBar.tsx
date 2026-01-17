interface BottomControlBarProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onPrevious?: () => void
  onNext?: () => void
  className?: string
}

const STEP_NAMES = ['Problem', 'Circuit', 'Constraints', 'Polynomials', 'Witness', 'Proof', 'Verification']

/**
 * BottomControlBar - Unified control bar for step navigation
 * Appears at the bottom of the canvas panel with dark, blurred styling
 */
export default function BottomControlBar({
  currentStepIndex,
  totalSteps,
  stepName,
  onPrevious,
  onNext,
  className = ''
}: BottomControlBarProps) {
  // Calculate progress percentage (0-100)
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  return (
    <div className={`sticky bottom-0 z-40 h-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center px-10 gap-10 ${className}`}>
      {/* Progress Timeline */}
      <div className="flex-1 relative">
        {/* Step Labels */}
        <div className="absolute -top-6 left-0 w-full">
          {STEP_NAMES.map((step, idx) => {
            const stepProgress = ((idx + 1) / totalSteps) * 100
            return (
              <span
                key={step}
                className={`absolute text-[10px] font-bold uppercase tracking-wider -translate-x-1/2 ${
                  idx === currentStepIndex ? 'text-accent-cyan glow-text' : 'text-slate-500'
                }`}
                style={{ left: `${stepProgress}%` }}
              >
                {step}
              </span>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-accent-cyan relative shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white border-2 border-accent-cyan rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Tick Marks */}
        <div className="absolute top-0 left-0 w-full">
          {STEP_NAMES.map((_, idx) => {
            const stepProgress = ((idx + 1) / totalSteps) * 100
            return (
              <div
                key={idx}
                className={`absolute h-4 w-0.5 -translate-x-1/2 ${idx <= currentStepIndex ? 'bg-accent-cyan/40' : 'bg-slate-700'}`}
                style={{ left: `${stepProgress}%` }}
              ></div>
            )
          })}
        </div>
      </div>

      {/* Step Info & Navigation */}
      <div className="flex items-center gap-6 text-slate-200">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-slate-500">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
          <p className="text-sm font-bold">{stepName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={!onPrevious || currentStepIndex === 0}
            className="size-8 rounded border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_left</span>
          </button>
          <button
            onClick={onNext}
            disabled={!onNext || currentStepIndex === totalSteps - 1}
            className="size-8 rounded border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
