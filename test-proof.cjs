const snarkjs = require('snarkjs');
const fs = require('fs');

async function testProof() {
  console.log('Testing ZK proof generation...\n');

  // Test case 1: x = 3 (should produce output = 9)
  console.log('Test 1: x = 3, expected output = 9');
  const input1 = { x: 3 };

  try {
    const { proof: proof1, publicSignals: publicSignals1 } = await snarkjs.groth16.fullProve(
      input1,
      'public/square.wasm',
      'public/square_final.zkey'
    );

    console.log('Public signals (output):', publicSignals1);
    console.log('Expected: 9');
    console.log('Match:', publicSignals1[0] === '9');

    // Load verification key
    const vKey = JSON.parse(fs.readFileSync('public/verification_key.json'));

    // Verify the proof
    const isValid1 = await snarkjs.groth16.verify(vKey, publicSignals1, proof1);
    console.log('Verification result:', isValid1);
    console.log('');

    // Test case 2: x = -3 (should also produce output = 9)
    console.log('Test 2: x = -3, expected output = 9');
    const input2 = { x: -3 };
    const { proof: proof2, publicSignals: publicSignals2 } = await snarkjs.groth16.fullProve(
      input2,
      'public/square.wasm',
      'public/square_final.zkey'
    );

    console.log('Public signals (output):', publicSignals2);
    console.log('Expected: 9');
    console.log('Match:', publicSignals2[0] === '9');

    const isValid2 = await snarkjs.groth16.verify(vKey, publicSignals2, proof2);
    console.log('Verification result:', isValid2);
    console.log('');

    // Test case 3: x = 4 (should produce output = 16)
    console.log('Test 3: x = 4, expected output = 16');
    const input3 = { x: 4 };
    const { proof: proof3, publicSignals: publicSignals3 } = await snarkjs.groth16.fullProve(
      input3,
      'public/square.wasm',
      'public/square_final.zkey'
    );

    console.log('Public signals (output):', publicSignals3);
    console.log('Expected: 16');
    console.log('Match:', publicSignals3[0] === '16');

    const isValid3 = await snarkjs.groth16.verify(vKey, publicSignals3, proof3);
    console.log('Verification result:', isValid3);

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

testProof();
