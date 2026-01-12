pragma circom 2.0.0;

// Circuit to prove: I know x such that x * x = out
template Square() {
    // Private input (secret)
    signal input x;

    // Public output
    signal output out;

    // Constraint: out must equal x * x
    out <== x * x;
}

// Main component
component main {public [out]} = Square();
