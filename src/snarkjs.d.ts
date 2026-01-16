declare module 'snarkjs' {
  export namespace groth16 {
    export function fullProve(
      input: any,
      wasmFile: string,
      zkeyFile: string
    ): Promise<{ proof: any; publicSignals: any[] }>

    export function verify(
      vKey: any,
      publicSignals: any[],
      proof: any
    ): Promise<boolean>
  }
}
