import './style.css';
import { LSystem } from './lsystem';
import { LSystemVisualizer } from './visualizer';

export function init() {
  const canvasContainer = document.getElementById('canvas-container');
  const axiomInput = document.getElementById('axiom-input') as HTMLInputElement;
  const rulesContainer = document.getElementById('rules-container');
  const addRuleBtn = document.getElementById('add-rule-btn');
  const iterationsInput = document.getElementById('iterations-input') as HTMLInputElement;
  const iterationsInc = document.getElementById('iterations-inc') as HTMLButtonElement;
  const iterationsDec = document.getElementById('iterations-dec') as HTMLButtonElement;

  const angleInput = document.getElementById('angle-input') as HTMLInputElement;
  const angleInc = document.getElementById('angle-inc') as HTMLButtonElement;
  const angleDec = document.getElementById('angle-dec') as HTMLButtonElement;

  const styleSelect = document.getElementById('style-select') as HTMLSelectElement;

  if (!canvasContainer || !axiomInput || !rulesContainer || !addRuleBtn || 
      !iterationsInput || !iterationsInc || !iterationsDec || 
      !angleInput || !angleInc || !angleDec || !styleSelect) {
    throw new Error('Required UI elements not found in the DOM');
  }

  // Initialize the 3D Visualizer
  const visualizer = new LSystemVisualizer(canvasContainer);

  function addRuleRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'rule-row';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'Key';
    keyInput.value = key;
    keyInput.className = 'rule-key';
    keyInput.addEventListener('input', generate);

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Replacement';
    valueInput.value = value;
    valueInput.className = 'rule-value';
    valueInput.addEventListener('input', generate);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-rule-btn';
    removeBtn.onclick = () => {
      row.remove();
      generate();
    };

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(removeBtn);
    if (rulesContainer) {
      rulesContainer.appendChild(row);
    }
  }

  // Default grammar to start with
  axiomInput.value = 'F';
  addRuleRow('F', 'FF+[+F-&F-&F]-[-F+^F+^F]');
  iterationsInput.value = '3';

  function generate() {
    const axiom = axiomInput.value;
    const iterations = parseInt(iterationsInput.value) || 0;
    const angleDeg = parseFloat(angleInput.value) || 25;
    const renderStyle = styleSelect.value as any;

    // Collect rules from dynamic rows
    const rules: Record<string, string> = {};
    if (rulesContainer) {
      const rows = rulesContainer.querySelectorAll('.rule-row');
      rows.forEach(row => {
        const keyInput = row.querySelector('.rule-key') as HTMLInputElement;
        const valueInput = row.querySelector('.rule-value') as HTMLInputElement;
        if (keyInput && valueInput && keyInput.value.trim() && valueInput.value.trim()) {
          rules[keyInput.value.trim()] = valueInput.value.trim();
        }
      });
    }

    const instructions = LSystem.generate(axiom, rules, iterations);
    visualizer.renderLSystem(instructions, angleDeg, 0.5, renderStyle);
  }

  // Hot reload: trigger generation on any input change
  axiomInput.addEventListener('input', generate);
  iterationsInput.addEventListener('input', generate);
  angleInput.addEventListener('input', generate);
  styleSelect.addEventListener('change', generate);
  addRuleBtn.addEventListener('click', () => {
    addRuleRow();
    generate();
  });

  function updateNumericValue(input: HTMLInputElement, incBtn: HTMLButtonElement, decBtn: HTMLButtonElement, delta: number) {
    incBtn.onclick = () => {
      input.value = ((parseInt(input.value) || 0) + delta).toString();
      generate();
    };
    decBtn.onclick = () => {
      input.value = ((parseInt(input.value) || 0) - delta).toString();
      generate();
    };
  }

  updateNumericValue(iterationsInput, iterationsInc, iterationsDec, 1);
  updateNumericValue(angleInput, angleInc, angleDec, 1);

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
