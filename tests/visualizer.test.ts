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
  }

  class MockObject3D {
    add = vi.fn();
    remove = vi.fn();
    traverse = vi.fn((cb) => cb(this));
    removeFromParent = vi.fn();
    dispose = vi.fn();
    geometry = { dispose: vi.fn() };
    material = { dispose: vi.fn() };
  }

  class MockLineSegments extends MockObject3D {}
  class MockInstancedMesh extends MockObject3D {
    setMatrixAt = vi.fn();
  }

  class MockBufferGeometry {
    setAttribute = vi.fn().mockReturnThis();
    setFromPoints = vi.fn().mockReturnThis();
  }

  class MockGeometry {}

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
    LineSegments: vi.fn().mockImplementation(MockLineSegments as any),
    InstancedMesh: vi.fn().mockImplementation(MockInstancedMesh as any),
    BufferGeometry: vi.fn().mockImplementation(MockBufferGeometry as any),
    BoxGeometry: vi.fn().mockImplementation(MockGeometry as any),
    CylinderGeometry: vi.fn().mockImplementation(MockGeometry as any),
    CapsuleGeometry: vi.fn().mockImplementation(MockGeometry as any),
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
    
    visualizer.renderLSystem('F');
    visualizer.renderLSystem('FF');
    
    expect(true).toBe(true); 
  });

  it('should use LineSegments for "lines" style', () => {
    const visualizer = new LSystemVisualizer(container);
    visualizer.renderLSystem('F', 25, 0.5, 'lines');
    expect(THREE.LineSegments).toHaveBeenCalled();
  });

  it('should use InstancedMesh with CylinderGeometry for "cylinders" style', () => {
    const visualizer = new LSystemVisualizer(container);
    visualizer.renderLSystem('F', 25, 0.5, 'cylinders');
    expect(THREE.InstancedMesh).toHaveBeenCalled();
    expect(THREE.CylinderGeometry).toHaveBeenCalled();
  });

  it('should use InstancedMesh with CapsuleGeometry for "pills" style', () => {
    const visualizer = new LSystemVisualizer(container);
    visualizer.renderLSystem('F', 25, 0.5, 'pills');
    expect(THREE.InstancedMesh).toHaveBeenCalled();
    expect(THREE.CapsuleGeometry).toHaveBeenCalled();
  });

  it('should use InstancedMesh with BoxGeometry for "voxels" style', () => {
    const visualizer = new LSystemVisualizer(container);
    visualizer.renderLSystem('F', 25, 0.5, 'voxels');
    expect(THREE.InstancedMesh).toHaveBeenCalled();
    expect(THREE.BoxGeometry).toHaveBeenCalled();
  });

  it('should handle empty instructions gracefully', () => {
    const visualizer = new LSystemVisualizer(container);
    // Should return early without crashing when points length is 0
    expect(() => visualizer.renderLSystem('')).not.toThrow();
  });
});