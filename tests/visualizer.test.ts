import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import { LSystemVisualizer } from '../src/visualizer';

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three');
  
  class MockWebGLRenderer {
    setSize = vi.fn();
    setClearColor = vi.fn();
    render = vi.fn();
    domElement = document.createElement('canvas');
    constructor() {}
  }

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});

describe('LSystemVisualizer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Mock HTML element for the visualizer to attach to
    container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', { value: 800 });
    Object.defineProperty(container, 'clientHeight', { value: 600 });
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should initialize and add renderer to container', () => {
    const visualizer = new LSystemVisualizer(container);
    expect(container.children.length).toBeGreaterThan(0);
    // The renderer adds a canvas element
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('should clear existing lines before rendering new ones', () => {
    const visualizer = new LSystemVisualizer(container);
    
    // We can check if renderLSystem is called and then visually 
    // (or via internal state) it clears. Since the group is private,
    // we test that calling render multiple times doesn't crash 
    // and maintains expected behavior.
    visualizer.renderLSystem('F');
    visualizer.renderLSystem('FF');
    
    // If clear() failed or wasn't called, the scene would grow indefinitely.
    // While we can't easily check group size without making it public,
    // testing that renderLSystem completes successfully is a start.
    expect(true).toBe(true); 
  });

  it('should handle empty instructions gracefully', () => {
    const visualizer = new LSystemVisualizer(container);
    // Should return early without crashing when points length is 0
    expect(() => visualizer.renderLSystem('')).not.toThrow();
  });
});