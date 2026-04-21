import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class LSystemVisualizer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private group: THREE.Group;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(3, 5, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.group = new THREE.Group();
    this.scene.add(this.group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  private onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public clear() {
    while (this.group.children.length > 0) {
      const child = this.group.children[0] as THREE.Mesh;
      this.group.remove(child);
    }
  }

  public renderLSystem(instructions: string, angleDeg: number = 25, stepLength: number = 0.5) {
    this.clear();
    const angleRad = (angleDeg * Math.PI) / 180;
    
    let currentPosition = new THREE.Vector3(0, 0, 0);
    let currentQuaternion = new THREE.Quaternion();
    const stack: { pos: THREE.Vector3, quat: THREE.Quaternion }[] = [];

    const points: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];

    for (const char of instructions) {
      switch (char) {
        case 'F': {
          const direction = new THREE.Vector3(0, 1, 0).applyQuaternion(currentQuaternion);
          const nextPosition = currentPosition.clone().add(direction.multiplyScalar(stepLength));
          
          points.push(currentPosition.clone(), nextPosition.clone());
          
          // Color based on height for a "plant" look
          colors.push(new THREE.Color(0x4caf50), new THREE.Color(0x8bc34a));

          currentPosition.copy(nextPosition);
          break;
        }
        case '+': { // Yaw (Z)
          const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleRad);
          currentQuaternion.multiply(q);
          break;
        }
        case '-': { // Yaw (Z)
          const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, -1), angleRad);
          currentQuaternion.multiply(q);
          break;
        }
        case '&': { // Pitch (X)
          const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleRad);
          currentQuaternion.multiply(q);
          break;
        }
        case '^': { // Pitch (X)
          const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, 0), angleRad);
          currentQuaternion.multiply(q);
          break;
        }
        case '\\': { // Roll (Y)
          const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleRad);
          currentQuaternion.multiply(q);
          break;
        }
        case '/': { // Roll (Y)
          const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, -1, 0), angleRad);
          currentQuaternion.multiply(q);
          break;
        }
        case '[': {
          stack.push({ pos: currentPosition.clone(), quat: currentQuaternion.clone() });
          break;
        }
        case ']': {
          const state = stack.pop();
          if (state) {
            currentPosition.copy(state.pos);
            currentQuaternion.copy(state.quat);
          }
          break;
        }
      }
    }

    // Create geometry from points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(colors.flatMap(c => [c.r, c.g, c.b])), 3));

    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true });
    const lines = new THREE.LineSegments(geometry, lineMat);
    this.group.add(lines);
  }
}