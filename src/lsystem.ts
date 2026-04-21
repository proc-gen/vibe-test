export interface LSystemRules {
  [key: string]: string;
}

export class LSystem {
  static generate(axiom: string, rules: LSystemRules, iterations: number): string {
    let current = axiom;
    for (let i = 0; i < iterations; i++) {
      let next = "";
      for (const char of current) {
        next += rules[char] || char;
      }
      current = next;
    }
    return current;
  }

  static parseGrammar(input: string): { axiom: string, rules: LSystemRules, iterations: number } {
    const lines = input.split('\n').map(l => l.trim()).filter(l => l);
    let axiom = "F";
    const rules: LSystemRules = {};
    let iterations = 3;

    for (const line of lines) {
      if (line.startsWith("Axiom:")) {
        axiom = line.split(":")[1].trim();
      } else if (line.startsWith("Rule:")) {
        const rulePart = line.split(":")[1].trim();
        const [key, value] = rulePart.split("->").map(s => s.trim());
        if (key && value) {
          rules[key] = value;
        }
      } else if (line.startsWith("Iterations:")) {
        iterations = parseInt(line.split(":")[1].trim()) || 3;
      }
    }

    return { axiom, rules, iterations };
  }
}