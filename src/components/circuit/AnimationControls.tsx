/**
 * AnimationControls - Playback controls for witness propagation animation
 *
 * Provides play/pause, step forward/back, reset, and speed control
 * 
 * Mobile: Stacked layout, smaller buttons
 * Desktop: Single row with all controls
 */

import { AnimationSpeed } from '../../types/animation'

interface AnimationControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: AnimationSpeed
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBack: () => void
  onSpeedChange: (speed: AnimationSpeed) => void
}

export default function AnimationControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
}: AnimationControlsProps) {
  const isAtEnd = currentStep >= totalSteps - 1
  const isAtStart = currentStep === 0

  return (
    <div className="bg-surface border-2 border-border-subtle rounded-lg p-3 md:p-4">
      {/* Main Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        {/* Left: Playback buttons */}
        <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isAtStart && !isPlaying}
            className="bg-surface text-text-primary border border-border-subtle px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset to beginning"
          >
            ⟲
          </button>

          {/* Step Back */}
          <button
            onClick={onStepBack}
            disabled={isAtStart}
            className="bg-surface text-text-primary border border-border-subtle px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Step backward"
          >
            ◄
          </button>

          {/* Play / Pause */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="bg-accent-primary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-indigo-600 transition-colors"
              title="Pause"
            >
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isAtEnd}
              className="bg-accent-primary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              title="Play"
            >
              ▶ Play
            </button>
          )}

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={isAtEnd}
            className="bg-surface text-text-primary border border-border-subtle px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Step forward"
          >
            ►
          </button>
        </div>

        {/* Right: Step counter and speed control */}
        <div className="flex items-center justify-center md:justify-end gap-3 md:gap-4">
          {/* Step counter */}
          <div className="text-text-secondary text-xs md:text-sm font-medium">
            Step {currentStep + 1}/{totalSteps}
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-text-secondary text-xs md:text-sm hidden md:inline">Speed:</span>
            <div className="flex gap-0.5 md:gap-1">
              <button
                onClick={() => onSpeedChange('slow')}
                className={`px-2 md:px-3 py-1 rounded text-xs font-medium transition-colors ${
                  speed === 'slow'
                    ? 'bg-accent-primary text-white'
                    : 'bg-surface text-text-secondary border border-border-subtle hover:bg-slate-700'
                }`}
              >
                Slow
              </button>
              <button
                onClick={() => onSpeedChange('normal')}
                className={`px-2 md:px-3 py-1 rounded text-xs font-medium transition-colors ${
                  speed === 'normal'
                    ? 'bg-accent-primary text-white'
                    : 'bg-surface text-text-secondary border border-border-subtle hover:bg-slate-700'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onSpeedChange('fast')}
                className={`px-2 md:px-3 py-1 rounded text-xs font-medium transition-colors ${
                  speed === 'fast'
                    ? 'bg-accent-primary text-white'
                    : 'bg-surface text-text-secondary border border-border-subtle hover:bg-slate-700'
                }`}
              >
                Fast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}