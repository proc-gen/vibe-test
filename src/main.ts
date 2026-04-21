import './style.css';
import { LSystem } from './lsystem';
import { LSystemVisualizer } from './visualizer';

const canvasContainer = document.getElementById('canvas-container');
const grammarInput = document.getElementById('grammar-input') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn');

if (!canvasContainer || !grammarInput || !generateBtn) {
  throw new Error('Required UI elements not found in the DOM');
}

// Initialize the 3D Visualizer
const visualizer = new LSystemVisualizer(canvasContainer);

// Default grammar to start with
const defaultGrammar = `Axiom: F
Rule: F -> FF+[+F-F-F]-[-F+F+F]
Iterations: 3`;

grammarInput.value = defaultGrammar;

function generate() {
  const input = grammarInput.value;
  const { axiom, rules, iterations } = LSystem.parseGrammar(input);
  const instructions = LSystem.generate(axiom, rules, iterations);
  
  visualizer.renderLSystem(instructions);
}

generateBtn.addEventListener('click', generate);

// Initial generation
generate();