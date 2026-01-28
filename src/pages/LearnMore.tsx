export default function LearnMore() {
  const glossary = [
    {
      term: 'Zero-Knowledge Proof (ZKP)',
      definition: 'A cryptographic method to prove you know something without revealing what that something is.',
    },
    {
      term: 'Circuit',
      definition: 'A fixed computation graph with signals (wires) and gates (operations). ZK proofs prove correct execution of circuits.',
    },
    {
      term: 'Witness',
      definition: 'The complete set of values (public + private) that satisfies all circuit constraints. The prover\'s secret input.',
    },
    {
      term: 'R1CS',
      definition: 'Rank-1 Constraint System. Represents circuit constraints as matrix equations: (A·w) × (B·w) = (C·w).',
    },
    {
      term: 'QAP',
      definition: 'Quadratic Arithmetic Program. Transforms R1CS into polynomials, enabling succinct proofs via the Schwartz-Zippel lemma.',
    },
    {
      term: 'Groth16',
      definition: 'A popular SNARK proving system. Produces tiny proofs (~200 bytes) with fast verification, but requires a trusted setup.',
    },
    {
      term: 'Trusted Setup',
      definition: 'A one-time ceremony that generates proving/verification keys. The "toxic waste" from this must be destroyed.',
    },
    {
      term: 'Pairing',
      definition: 'A bilinear map on elliptic curves that enables the verifier to check proof validity without knowing the witness.',
    },
    {
      term: 'snarkjs',
      definition: 'A JavaScript library for generating and verifying zk-SNARK proofs. Powers this visualizer.',
    },
    {
      term: 'Circom',
      definition: 'A domain-specific language for writing ZK circuits. Compiles to R1CS constraints.',
    },
  ]

  const resources = [
    {
      title: 'RareSkills ZK Book',
      url: 'https://www.rareskills.io/zk-book',
      description: 'Comprehensive, practical guide to ZK development. Start here.',
    },
    {
      title: 'Vitalik\'s SNARK Explainer',
      url: 'https://vitalik.eth.limo/general/2021/01/26/snarks.html',
      description: 'Excellent conceptual overview of how SNARKs work.',
    },
    {
      title: 'Circom Documentation',
      url: 'https://docs.circom.io/',
      description: 'Official docs for the Circom circuit language.',
    },
    {
      title: 'snarkjs GitHub',
      url: 'https://github.com/iden3/snarkjs',
      description: 'The library powering this visualizer. Great examples included.',
    },
    {
      title: '0xPARC Learning Resources',
      url: 'https://learn.0xparc.org/',
      description: 'Courses and materials from the applied ZK research group.',
    },
    {
      title: 'ZK Hack',
      url: 'https://zkhack.dev/',
      description: 'Puzzles and challenges to test your ZK knowledge.',
    },
  ]

  const nextSteps = [
    'Build your own circuit in Circom (try a range proof or Merkle proof)',
    'Explore PLONK — a newer proving system without per-circuit trusted setup',
    'Learn about zkEVMs and how ZK is scaling Ethereum',
    'Study recursive proofs — proofs that verify other proofs',
    'Contribute to open source ZK projects',
  ]

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background-light">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Learn More</h1>
        <p className="text-text-light-secondary mb-12">
          Deepen your understanding of zero-knowledge proofs with these resources.
        </p>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">link</span>
            External Resources
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                  {item.title}
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </h3>
                <p className="text-text-light-secondary text-sm mt-1">{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">menu_book</span>
            Glossary
          </h2>
          <div className="grid gap-4">
            {glossary.map((item) => (
              <div key={item.term} className="bg-white rounded-lg border border-gray-200 p-4">
                <dt className="font-semibold text-primary mb-1">{item.term}</dt>
                <dd className="text-text-light-secondary text-sm">{item.definition}</dd>
              </div>
            ))}
          </div>
        </section>

        {/* What's Next */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            What's Next?
          </h2>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
            <p className="text-text-light-secondary mb-4">
              Now that you understand the basics, here are some paths to explore:
            </p>
            <ul className="space-y-2">
              {nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary font-bold">{idx + 1}.</span>
                  <span className="text-text-light-secondary">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}