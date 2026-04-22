import { describe, it, expect } from 'vitest';
import { LSystem } from '../src/lsystem';
import { SAMPLE_GRAMMARS } from '../src/tests/fixtures/lsystem-grammars';

describe('LSystem', () => {
  it('should generate a simple sequence correctly', () => {
    const parsed = LSystem.parseGrammar(SAMPLE_GRAMMARS.basic);
    expect(LSystem.generate(parsed.axiom, parsed.rules, parsed.iterations)).toBe('FFFF');
  });

  it('should handle multiple rules correctly', () => {
    const axiom = 'F';
    const rules = { 'F': 'F+G', 'G': 'GG' };
    const iterations = 1;
    expect(LSystem.generate(axiom, rules, iterations)).toBe('F+G');
  });

  it('should handle no transformations if rule missing', () => {
    const axiom = 'ABC';
    const rules = { 'A': 'X' };
    const iterations = 1;
    expect(LSystem.generate(axiom, rules, iterations)).toBe('XBC');
  });

  it('should parse grammar string correctly', () => {
    const result = LSystem.parseGrammar(SAMPLE_GRAMMARS.complex);
    expect(result.axiom).toBe('F');
    expect(result.rules['F']).toBe('FF+[+F-&F-&F]-[-F+^F+^F]');
    expect(result.iterations).toBe(4);
  });

  it('should use default values for parseGrammar when input is empty', () => {
    const result = LSystem.parseGrammar(SAMPLE_GRAMMARS.empty);
    expect(result.axiom).toBe('F');
    expect(result.iterations).toBe(3);
  });

  it('should handle malformed grammar strings gracefully', () => {
    const result = LSystem.parseGrammar(SAMPLE_GRAMMARS.malformed);
    // Axiom should be preserved from the line if present
    expect(result.axiom).toBe('F');
    // Iterations should fall back to default if NaN
    expect(result.iterations).toBe(3);
    // Rule should not be added if "->" is missing
    expect(Object.keys(result.rules)).toHaveLength(0);
  });
});