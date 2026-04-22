import { describe, it, expect, vi } from 'vitest';
import { init } from '../src/main';

describe('Main entry point logic', () => {
  it('should throw error if required UI elements are missing', () => {
    // Clear DOM to simulate missing elements
    document.body.innerHTML = '';
    
    expect(() => init()).toThrow('Required UI elements not found in the DOM');
  });
});
