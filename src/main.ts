import './style.css';
import { LSystem } from './lsystem';
import { LSystemVisualizer } from './visualizer';

export function init() {
  const canvasContainer = document.getElementById('canvas-container');
  const axiomInput = document.getElementById('axiom-input') as HTMLInputElement;
  const ruleInput = document.getElementById('rule-input') as HTMLInputElement;
  const iterationsInput = document.getElementById('iterations-input') as HTMLInputElement;
  const angleInput = document.getElementById('angle-input') as HTMLInputElement;

  if (!canvasContainer || !axiomInput || !ruleInput || !iterationsInput || !angleInput) {
    throw new Error('Required UI elements not found in the DOM');
  }

  // Initialize the 3D Visualizer
  const visualizer = new LSystemVisualizer(canvasContainer);

  // Default grammar to start with
  axiomInput.value = 'F';
  ruleInput.value = 'F -> FF+[+F-&F-&F]-[-F+^F+^F]';
  iterationsInput.value = '3';

  function generate() {
    const axiom = axiomInput.value;
    const ruleStr = ruleInput.value;
    const iterations = parseInt(iterationsInput.value) || 0;
    const angleDeg = parseFloat(angleInput.value) || 25;

    // Parse the rule string "Key -> Value" into a map
    const rules: Record<string, string> = {};
    if (ruleStr.includes('->')) {
      const [key, value] = ruleStr.split('->').map(s => s.trim());
      if (key && value) {
        rules[key] = value;
      }
    }

    const instructions = LSystem.generate(axiom, rules, iterations);
    visualizer.renderLSystem(instructions, angleDeg);
  }

  // Hot reload: trigger generation on any input change
  axiomInput.addEventListener('input', generate);
  ruleInput.addEventListener('input', generate);
  iterationsInput.addEventListener('input', generate);
  angleInput.addEventListener('input', generate);

  // Initial generation
  generate();
}

if (typeof window !== 'undefined') {
  try {
    init();
  } catch (e) {
    // Silence errors during module import in test environments.
    // In a real browser environment, this will only throw if the HTML 
    // is missing required elements.
  }
}
