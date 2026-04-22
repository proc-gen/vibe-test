import { describe, it, expect } from 'vitest';
import { Counter, setupCounter } from '../src/counter';

describe('Counter', () => {
  it('should start with value 0', () => {
    const counter = new Counter();
    expect(counter.value).toBe(0);
  });

  it('should increment the value by 1', () => {
    const counter = new Counter();
    counter.increment();
    expect(counter.value).toBe(1);
  });

  it('should return the new value after incrementing', () => {
    const counter = new Counter();
    const newValue = counter.increment();
    expect(newValue).toBe(1);
    expect(counter.value).toBe(1);
  });

  it('should increment multiple times', () => {
    const counter = new Counter();
    counter.increment();
    counter.increment();
    counter.increment();
    expect(counter.value).toBe(3);
  });
});

describe('setupCounter', () => {
  it('should initialize the button text and increment value on click', () => {
    const btn = document.createElement('button');
    setupCounter(btn);
    
    expect(btn.textContent).toBe('Count is 0');
    
    btn.click();
    expect(btn.textContent).toBe('Count is 1');
    
    btn.click();
    expect(btn.textContent).toBe('Count is 2');
  });
});
