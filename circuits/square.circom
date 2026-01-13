// Circuit to prove: I know x such that x * x = out
template Square() {
    // Private input (secret)
    signal private input x;

    // Public output
    signal output out;

    // Constraint: out must equal x * x
    out <== x * x;
}

// Main component with public output
component main = Square();
