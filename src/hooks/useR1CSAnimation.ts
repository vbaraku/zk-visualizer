/**
 * useR1CSAnimation Hook
 *
 * Manages R1CS construction animation state and playback controls
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimationSpeed } from '../types/animation'
import { R1CSAnimationStep } from '../types/r1cs'

/**
 * Speed settings in milliseconds per step
 */
const SPEED_SETTINGS: Record<AnimationSpeed, number> = {
  slow: 2000,
  normal: 1200,
  fast: 600,
}

export interface R1CSAnimationControls {
  // State
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: AnimationSpeed

  // Controls
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBack: () => void
  setSpeed: (speed: AnimationSpeed) => void
  goToStep: (step: number) => void
}

interface UseR1CSAnimationProps {
  steps: R1CSAnimationStep[]
  onStepChange?: (step: number) => void
}

/**
 * Custom hook for managing R1CS construction animation
 */
export function useR1CSAnimation({
  steps,
  onStepChange,
}: UseR1CSAnimationProps): R1CSAnimationControls {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const stepsRef = useRef(steps)

  // Update steps ref when steps change
  useEffect(() => {
    stepsRef.current = steps
  }, [steps])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Notify parent component when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep)
    }
  }, [currentStep, onStepChange])

  /**
   * Advance to the next step
   */
  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      const totalSteps = stepsRef.current.length
      if (prev < totalSteps - 1) {
        return prev + 1
      }
      // Reached the end, stop playing
      setIsPlaying(false)
      return prev
    })
  }, [])

  /**
   * Go back to the previous step
   */
  const stepBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
    // Pause when manually stepping back
    setIsPlaying(false)
  }, [])

  /**
   * Start playing the animation
   */
  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  /**
   * Pause the animation
   */
  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  /**
   * Reset to the beginning
   */
  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  /**
   * Jump to a specific step
   */
  const goToStep = useCallback((step: number) => {
    const totalSteps = stepsRef.current.length
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
    setIsPlaying(false)
  }, [])

  /**
   * Handle auto-advance when playing
   */
  useEffect(() => {
    if (isPlaying) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Set up new interval based on speed
      intervalRef.current = setInterval(() => {
        stepForward()
      }, SPEED_SETTINGS[speed])
    } else {
      // Stop the interval when paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, stepForward])

  return {
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    setSpeed,
    goToStep,
  }
}
