export const SAMPLE_GRAMMARS = {
  basic: `
    Axiom: F
    Rule: F -> FF
    Iterations: 2
  `,
  complex: `
    Axiom: F
    Rule: F -> FF+[+F-&F-&F]-[-F+^F+^F]
    Iterations: 4
  `,
  malformed: `
    Axiom: F
    Rule: Invalid Rule Here
    Iterations: not a number
  `,
  empty: ''
};

export const SAMPLE_INSTRUCTIONS = {
  straight: 'F',
  turnRight: 'F+F',
  branching: 'F[+F]-F'
};