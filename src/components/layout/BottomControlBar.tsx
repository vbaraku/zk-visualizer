import { ReactNode } from 'react'

interface BottomControlBarProps {
  currentStepIndex: number
  totalSteps: number
  stepName: string
  onPrevious?: () => void
  onNext?: () => void
  onPlay?: () => void
  progress?: number // 0-100
  children?: ReactNode
  className?: string
}

/**
 * BottomControlBar - Unified control bar for animations and step navigation
 * Appears at the bottom of the canvas panel with dark, blurred styling
 */
export default function BottomControlBar({
  currentStepIndex,
  totalSteps,
  stepName,
  onPrevious,
  onNext,
  onPlay,
  progress = 0,
  children,
  className = ''
}: BottomControlBarProps) {
  const steps = ['Commitment', 'Challenge', 'Response', 'Verification']

  return (
    <div className={`h-24 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center px-10 gap-10 ${className}`}>
      {/* Play Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPlay}
          className="size-10 rounded-full border border-accent-cyan flex items-center justify-center text-accent-cyan hover:bg-accent-cyan hover:text-slate-900 transition-colors shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        >
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
      </div>

      {/* Timeline Progress */}
      <div className="flex-1 relative">
        {/* Step Labels */}
        <div className="absolute -top-6 left-0 w-full flex justify-between px-1">
          {steps.map((step, idx) => (
            <span
              key={step}
              className={`text-[10px] font-bold uppercase ${
                idx === 0 ? 'text-accent-cyan glow-text' : 'text-slate-500'
              }`}
            >
              {step}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-accent-cyan relative shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white border-2 border-accent-cyan rounded-full shadow-md cursor-pointer"></div>
          </div>
        </div>

        {/* Tick Marks */}
        <div className="absolute top-0 left-0 w-full flex justify-between">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-4 w-0.5 ${idx === 0 ? 'bg-accent-cyan/40' : 'bg-slate-700'}`}></div>
          ))}
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
            disabled={currentStepIndex === 0}
            className="size-8 rounded border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_left</span>
          </button>
          <button
            onClick={onNext}
            disabled={currentStepIndex === totalSteps - 1}
            className="size-8 rounded border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Optional Custom Controls */}
      {children}
    </div>
  )
}
