/**
 * Polynomial Animation Hook
 *
 * Controls animation playback for polynomial visualization steps
 */

import { useState, useEffect, useCallback } from 'react'
import { PolynomialAnimationStep } from '../types/polynomial'
import { AnimationSpeed } from '../types/animation'

interface UsePolynomialAnimationProps {
  steps: PolynomialAnimationStep[]
}

interface UsePolynomialAnimationReturn {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: AnimationSpeed
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBack: () => void
  setSpeed: (speed: AnimationSpeed) => void
  goToStep: (step: number) => void
}

const SPEED_SETTINGS: Record<AnimationSpeed, number> = {
  slow: 2500, // Slower for polynomial concepts
  normal: 1500,
  fast: 800,
}

export function usePolynomialAnimation({
  steps,
}: UsePolynomialAnimationProps): UsePolynomialAnimationReturn {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<AnimationSpeed>('normal')

  const totalSteps = steps.length

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const stepBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
    },
    [totalSteps]
  )

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, SPEED_SETTINGS[speed])

    return () => clearInterval(interval)
  }, [isPlaying, speed, totalSteps])

  return {
    currentStep,
    totalSteps,
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
