// This file handles real zero-knowledge proof generation and verification using snarkjs

import * as snarkjs from 'snarkjs'

// Cache for loaded files to avoid re-fetching
let vKeyCache: any = null

// Load verification key from public directory
async function loadVerificationKey() {
  if (vKeyCache) return vKeyCache

  const response = await fetch('/circuits/square/verification_key.json')
  if (!response.ok) {
    throw new Error('Failed to load verification key')
  }
  vKeyCache = await response.json()
  return vKeyCache
}

/**
 * Generate a real zero-knowledge proof using snarkjs
 * @param xValue - The secret value to prove (x where x² = out)
 * @returns Proof data with proof and public signals
 */
export async function generateProof(xValue: number = 3) {
  try {
    const input = {
      x: xValue
    }

    console.log('Generating ZK proof with input:', input)
    console.log('Expected output:', xValue * xValue)

    // Load circuit WASM and zkey from public directory
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      '/circuits/square/square.wasm',
      '/circuits/square/square_final.zkey'
    )

    console.log('Proof generated successfully!')
    console.log('Public signals (output):', publicSignals)
    console.log('Proof:', proof)

    return {
      proof,
      publicSignals
    }
  } catch (error) {
    console.error('Error generating proof:', error)
    throw new Error(`Failed to generate proof: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verify a zero-knowledge proof using snarkjs
 * @param proofData - The proof data containing proof and public signals
 * @returns Boolean indicating if the proof is valid
 */
export async function verifyProof(proofData: any) {
  try {
    console.log('Verifying proof...')
    console.log('Public signals:', proofData.publicSignals)

    // Load the verification key
    const vKey = await loadVerificationKey()

    // Verify the proof using snarkjs
    const isValid = await snarkjs.groth16.verify(
      vKey,
      proofData.publicSignals,
      proofData.proof
    )

    console.log('Verification result:', isValid)

    return isValid
  } catch (error) {
    console.error('Error verifying proof:', error)
    throw new Error(`Failed to verify proof: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
