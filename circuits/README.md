# Circuit Compilation

This directory contains the Circom circuit for the square root proof.

## Circuit: square.circom

Proves: I know a number `x` such that `x * x = out`

- **Private input**: `x` (the secret number)
- **Public output**: `out` (the result, which is 9 in our example)

## To compile the circuit:

1. Install circom: https://docs.circom.io/getting-started/installation/
2. Run compilation:
   ```bash
   circom square.circom --r1cs --wasm --sym
   ```

3. Generate the proving and verification keys (requires ceremony or trusted setup)

For the MVP, we'll use mock proofs until the circuit compilation is set up.
