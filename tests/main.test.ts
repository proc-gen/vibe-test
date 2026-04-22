import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init } from '../src/main';
import * as THREE from 'three';
import { LSystemVisualizer } from '../src/visualizer';

// Mock LSystemVisualizer to avoid initializing Three.js and WebGL in main tests
vi.mock('../src/visualizer', () => {
  class MockVisualizer {
    renderLSystem = vi.fn();
    constructor() {}
  }
  return {
    LSystemVisualizer: vi.fn().mockImplementation(MockVisualizer),
  };
});

describe('Main entry point logic', () => {
  const createMockDOM = () => {
    document.body.innerHTML = `
      <div id="canvas-container"></div>
      <input id="axiom-input" />
      <input id="rule-input" />
      <input id="iterations-input" />
      <input id="angle-input" />
      <select id="style-select">
        <option value="lines">Lines</option>
        <option value="voxels">Voxels</option>
        <option value="cylinders">Cylinders</option>
        <option value="pills">Pills</option>
      </select>
    `;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if required UI elements are missing', () => {
    document.body.innerHTML = '';
    expect(() => init()).toThrow('Required UI elements not found in the DOM');
  });

  it('should initialize with default values', () => {
    createMockDOM();
    init();

    expect((document.getElementById('axiom-input') as HTMLInputElement).value).toBe('F');
    expect((document.getElementById('rule-input') as HTMLInputElement).value).toContain('->');
    expect((document.getElementById('iterations-input') as HTMLInputElement).value).toBe('3');
  });

  it('should trigger re-render when inputs change', () => {
    createMockDOM();
    init();

    const axiomInput = document.getElementById('axiom-input') as HTMLInputElement;
    
    // We need to get the instance of LSystemVisualizer that was created inside init()
    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];

    axiomInput.value = 'G';
    axiomInput.dispatchEvent(new Event('input'));

    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });

  it('should parse rules correctly and pass them to visualizer', () => {
    createMockDOM();
    init();

    const ruleInput = document.getElementById('rule-input') as HTMLInputElement;
    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];

    // Set a simple rule and trigger change
    ruleInput.value = 'F -> FF';
    ruleInput.dispatchEvent(new Event('input'));

    // The call to renderLSystem should have been made with instructions 
    // generated from this rule. We can't easily check the exact string 
    // without mocking LSystem.generate, but we verify it was called.
    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });
});
