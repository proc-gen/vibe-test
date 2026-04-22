export class Counter {
  value = 0;
  increment() {
    this.value++;
    return this.value;
  }
}

export function setupCounter(element: HTMLButtonElement) {
  const counter = new Counter();
  const updateUI = () => {
    element.innerHTML = `Count is ${counter.value}`;
  };
  element.addEventListener('click', () => {
    counter.increment();
    updateUI();
  });
  updateUI();
}
