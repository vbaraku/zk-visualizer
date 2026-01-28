interface LandingPageProps {
  onStartVisualizer: () => void
}

export default function LandingPage({ onStartVisualizer }: LandingPageProps) {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            {/* <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded mb-6">
              The idea
            </span> */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.1] mb-8">
              Demystifying{' '}
              <span className="italic text-primary">Zero-Knowledge</span>{' '}
              Through Visualization
            </h1>
            <p className="text-lg lg:text-xl text-text-light-secondary leading-relaxed mb-10 max-w-xl">
              Watch a real ZK proof get generated step-by-step. From circuit to constraints
              to polynomials to the final proof. No black boxes, only visual understanding.
            </p>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <button
                onClick={onStartVisualizer}
                className="px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all"
              >
                Launch Visualizer
              </button>
              <a
                href="#why-zk"
                className="text-sm font-bold flex items-center gap-2 group text-text-light-secondary hover:text-primary transition-colors"
              >
                Learn More
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-8 flex items-center justify-center overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-xl p-6 relative">
                <div className="absolute -top-3 -left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
                  LIVE PREVIEW
                </div>
                <div className="mb-5 flex justify-between items-center">
                  <h3 className="italic text-lg text-slate-800">Proof: x² = 9</h3>
                  <span className="text-[10px] font-bold text-slate-400">GROTH16</span>
                </div>
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-4/5 bg-primary/30 rounded-full"></div>
                    <div className="absolute left-[80%] top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 bg-primary border-4 border-white rounded-full shadow-md"></div>
                  </div>

                  {/* Mini cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Witness</p>
                      <div className="font-mono text-sm">w = [1, 3, 9]</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Proof Size</p>
                      <div className="font-mono text-sm">~200 bytes</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center pt-2">
                    <div className="w-full h-8 flex items-center justify-center border-2 border-dashed border-green-500/30 rounded-lg text-green-600 text-xs font-bold gap-2 bg-green-50/50">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Proof Verified ✓
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 italic text-primary text-sm rotate-6 bg-white/90 backdrop-blur px-2 py-1 border rounded shadow-sm">
                  "x stays hidden!"
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 size-24 border border-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 size-40 bg-cyan-400/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Why ZK Section */}
      <section className="bg-white py-20 lg:py-24 border-y border-slate-100" id="why-zk">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-6">Why Zero-Knowledge?</h2>
            <div className="w-20 h-0.5 bg-primary mb-8"></div>
            <div className="space-y-6 text-lg text-text-light-secondary leading-relaxed">
              <p>
                In a world where data is the new oil, privacy has become an endangered species.
                Zero-Knowledge Proofs represent a paradigm shift, they let you prove truths
                without exposing the underlying data.
              </p>
              <p>
                Zero-knowledge proofs are incredibly powerful, but learning them is hard.
                Most resources are either too theoretical (pages of math) or too practical
                (just run this code). Neither shows you <strong>what actually happens</strong>.
              </p>
              <p>
                ZK Visualizer bridges that gap. It generates real Groth16 proofs in your browser
                and visualizes every step—from circuit compilation to R1CS constraints to polynomial
                commitments to the final verification.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="space-y-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <h4 className="font-bold text-sm uppercase tracking-tight">Real Cryptography</h4>
              <p className="text-sm text-text-light-secondary leading-relaxed">
                Actual Groth16 proofs via snarkjs. No simulations or hand-waving—real math you can verify.
              </p>
            </div>
            <div className="space-y-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">stacked_line_chart</span>
              </div>
              <h4 className="font-bold text-sm uppercase tracking-tight">Step-by-Step</h4>
              <p className="text-sm text-text-light-secondary leading-relaxed">
                Seven phases from problem to proof. Pause, rewind, and explore each transformation.
              </p>
            </div>
            <div className="space-y-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">code</span>
              </div>
              <h4 className="font-bold text-sm uppercase tracking-tight">Open Source</h4>
              <p className="text-sm text-text-light-secondary leading-relaxed">
                Built with React, TypeScript, and snarkjs. Fork it, extend it, learn from it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">The Seven Steps</h2>
          <p className="text-text-light-secondary">From problem statement to verified proof</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Problem', desc: 'Define what you want to prove without revealing' },
            { num: '02', title: 'Circuit', desc: 'See computation as signals and gates' },
            { num: '03', title: 'R1CS', desc: 'Transform circuit into matrix constraints' },
            { num: '04', title: 'Polynomials', desc: 'Encode constraints as polynomial equations' },
            { num: '05', title: 'Witness', desc: 'The prover\'s secret satisfying assignment' },
            { num: '06', title: 'Proof', desc: 'Generate cryptographic proof (~200 bytes)' },
            { num: '07', title: 'Verify', desc: 'Convince anyone without revealing secrets' },
          ].map((step, idx) => (
            <div
              key={step.num}
              className={`bg-slate-50 p-6 rounded-xl border border-slate-200 hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 ${idx === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <span className="text-xs font-bold text-slate-400 mb-3 block">{step.num}</span>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-text-light-secondary text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onStartVisualizer}
            className="px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all"
          >
            Start the Journey →
          </button>
        </div>
      </section>

      {/* Tech & Credits */}
      <section className="bg-slate-900 text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
                Built for <span className="italic text-cyan-400">Learners</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                ZK Visualizer is an open-source educational tool. It's not a production library—it's
                a learning companion designed to build intuition before you dive into the math.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {['React', 'TypeScript', 'snarkjs', 'Circom', 'Tailwind', 'React Flow', 'D3.js', 'Framer Motion'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href="https://github.com/vbaraku/zk-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 border border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                View on GitHub
              </a>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/30">
                    VB
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <p className="font-bold text-base">Vijon Baraku</p>
                    <p className="text-xs text-slate-500 mb-3">Creator & Developer</p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <a href="https://www.linkedin.com/in/vijon-baraku-3aa660232/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="LinkedIn">
                        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                      <a href="https://github.com/vbaraku" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="GitHub">
                        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      </a>
                      <a href="https://scholar.google.com/citations?user=BxKRTwQAAAAJ&hl=en&oi=ao" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Google Scholar">
                        <span className="material-symbols-outlined text-[20px]">school</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 text-center">
                <p className="text-slate-500 text-xs mb-2">Inspired by</p>
                <p className="text-slate-300 text-sm italic">
                  TensorFlow Playground • 0xPARC • RareSkills ZK Book
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-5 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
           <div className="flex items-center gap-3 text-text-light-primary hover:opacity-80 transition-opacity">
  {/* Container with fixed height to prevent pushing the header down */}
  <div className="size-8 flex items-center justify-center">
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="w-full h-full text-primary"
    >
      {/* The closed eyelid - moved slightly up to balance the long lashes */}
      <path d="M3 8a9 9 0 0 0 18 0" />
      
      {/* Longer Lashes pointing down */}
      <line x1="12" y1="17" x2="12" y2="22" />       {/* Center lash */}
      <line x1="7" y1="15.5" x2="4" y2="20" />      {/* Left lash */}
      <line x1="17" y1="15.5" x2="20" y2="20" />     {/* Right lash */}
    </svg>
  </div>
  
  {/* Align-baseline or self-center helps if the icon feels "floaty" */}
  <h2 className="text-xl font-bold leading-tight tracking-tight self-center">
    ZK<span className="text-primary">Visualizer</span>
  </h2>
</div>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 Vijon Baraku. Open Source.
          </div>
        </div>
      </footer>
    </main>
  )
}