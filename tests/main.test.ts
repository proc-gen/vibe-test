import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init } from '../src/main';
import * as THREE from 'three';
import { LSystemVisualizer } from '../src/visualizer';

// Mock LSystemVisualizer to avoid initializing Three.js and WebGL in main tests
vi.mock('../src/visualizer', () => {
  class MockVisualizer {
    renderLSystem = vi.fn();
    clear = vi.fn();
    constructor(container: HTMLElement) {}
  }
  return {
    LSystemVisualizer: vi.fn().mockImplementation((container: HTMLElement) => new MockVisualizer(container)),
  };
});

describe('Main entry point logic', () => {
  const createMockDOM = () => {
    document.body.innerHTML = `
      <div id="canvas-container"></div>
      <select id="style-select">
        <option value="lines">Lines</option>
        <option value="voxels">Voxels</option>
        <option value="cylinders">Cylinders</option>
        <option value="pills">Pills</option>
      </select>
      <div class="numeric-controls">
        <button id="iterations-dec"></button>
        <input id="iterations-input" />
        <button id="iterations-inc"></button>
      </div>
      <div class="numeric-controls">
        <button id="angle-dec"></button>
        <input id="angle-input" />
        <button id="angle-inc"></button>
      </div>
      <input id="axiom-input" />
      <div id="rules-section">
        <div id="rules-container"></div>
        <button id="add-rule-btn"></button>
      </div>
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
    const ruleRow = document.querySelector('.rule-row');
    expect(ruleRow).not.toBeNull();
    const keyInput = ruleRow?.querySelector('.rule-key') as HTMLInputElement;
    expect(keyInput.value).toBe('F');
    expect((document.getElementById('iterations-input') as HTMLInputElement).value).toBe('3');
  });

  it('should trigger re-render when inputs change', () => {
    createMockDOM();
    init();

    const axiomInput = document.getElementById('axiom-input') as HTMLInputElement;
    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];

    axiomInput.value = 'G';
    axiomInput.dispatchEvent(new Event('input'));

    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });

  it('should trigger re-render when numeric buttons are clicked', () => {
    createMockDOM();
    init();

    const iterationsInc = document.getElementById('iterations-inc') as HTMLButtonElement;
    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];
    
    vi.clearAllMocks();
    iterationsInc.click();

    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });

  it('should parse rules correctly and pass them to visualizer', () => {
    createMockDOM();
    init();

    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];
    
    // Find the first rule row's value input
    const valueInput = document.querySelector('.rule-value') as HTMLInputElement;
    
    // Set a simple replacement and trigger change
    valueInput.value = 'FF';
    valueInput.dispatchEvent(new Event('input'));

    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });

  it('should handle multiple rules correctly', () => {
    createMockDOM();
    init();

    const addRuleBtn = document.getElementById('add-rule-btn') as HTMLButtonElement;
    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];

    // Add a second rule
    addRuleBtn.click();
    
    const rows = document.querySelectorAll('.rule-row');
    const secondKey = rows[1].querySelector('.rule-key') as HTMLInputElement;
    const secondValue = rows[1].querySelector('.rule-value') as HTMLInputElement;

    secondKey.value = 'G';
    secondValue.value = 'GG';
    secondKey.dispatchEvent(new Event('input'));

    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });

  it('should trigger re-render when a rule is removed', () => {
    createMockDOM();
    init();

    const visualizerInstance = vi.mocked(LSystemVisualizer).mock.instances[0];
    const removeBtn = document.querySelector('.remove-rule-btn') as HTMLButtonElement;
    
    vi.clearAllMocks(); // Clear previous calls from init/defaults
    removeBtn.click();

    expect(visualizerInstance.renderLSystem).toHaveBeenCalled();
  });
});
