import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Turtle, type LineSegment } from './turtle';

export type RenderStyle = 'lines' | 'voxels' | 'cylinders' | 'pills';

export class LSystemVisualizer {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private group: THREE.Group;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    const aspect = container.clientWidth / container.clientHeight;
    const viewSize = 10;
    this.camera = new THREE.OrthographicCamera(
      -viewSize * aspect / 2,
      viewSize * aspect / 2,
      viewSize / 2,
      -viewSize / 2,
      0.1,
      1000
    );
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

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  private onWindowResize() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const viewSize = 10;
    this.camera.left = -viewSize * aspect / 2;
    this.camera.right = viewSize * aspect / 2;
    this.camera.top = viewSize / 2;
    this.camera.bottom = -viewSize / 2;
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

  public renderLSystem(instructions: string, angleDeg: number = 25, stepLength: number = 0.5, style: RenderStyle = 'lines') {
    this.clear();
    const segments = Turtle.calculatePath(instructions, angleDeg, stepLength);
    if (segments.length === 0) return;

    switch (style) {
      case 'lines':
        this.renderLines(segments);
        break;
      case 'cylinders':
        this.renderMeshSegments(segments, new THREE.CylinderGeometry(0.05, 0.05, stepLength), 'cylinders');
        break;
      case 'pills':
        this.renderMeshSegments(segments, new THREE.CapsuleGeometry(0.05, stepLength, 4, 8), 'pills');
        break;
      case 'voxels':
        this.renderVoxels(segments, stepLength);
        break;
    }
  }

  private renderLines(segments: LineSegment[]) {
    const points: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];

    for (const segment of segments) {
      points.push(segment.start, segment.end);
      colors.push(new THREE.Color(0x4caf50), new THREE.Color(0x8bc34a));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(colors.flatMap(c => [c.r, c.g, c.b])), 3));

    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true });
    const lines = new THREE.LineSegments(geometry, lineMat);
    this.group.add(lines);
  }

  private renderMeshSegments(segments: LineSegment[], geometry: THREE.BufferGeometry, type: string) {
    const material = new THREE.MeshPhongMaterial({ color: 0x4caf50 });
    const mesh = new THREE.InstancedMesh(geometry, material, segments.length);

    const dummy = new THREE.Object3D();
    segments.forEach((segment, i) => {
      const start = segment.start;
      const end = segment.end;
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      
      dummy.position.copy(midpoint);
      
      // Align Y-axis of geometry to the segment direction
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      dummy.setRotationFromQuaternion(quaternion);
      
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    this.group.add(mesh);
  }

    private renderVoxels(segments: LineSegment[], stepLength: number) {
      const voxelSize = 0.1;
      // Increase sampling frequency to prevent gaps in diagonal segments
      const samplesPerSegment = Math.ceil((stepLength / voxelSize) * 2);
      const uniqueVoxels = new Set<string>();

    segments.forEach((segment) => {
      for (let i = 0; i < samplesPerSegment; i++) {
        const t = (i + 0.5) / samplesPerSegment;
        const pos = new THREE.Vector3().lerpVectors(segment.start, segment.end, t);
        
        // Snap to grid
        const sx = Math.round(pos.x / voxelSize) * voxelSize;
        const sy = Math.round(pos.y / voxelSize) * voxelSize;
        const sz = Math.round(pos.z / voxelSize) * voxelSize;
        
        uniqueVoxels.add(`${sx.toFixed(2)},${sy.toFixed(2)},${sz.toFixed(2)}`);
      }
    });

    const uniquePositions = Array.from(uniqueVoxels).map(key => {
      const [x, y, z] = key.split(',').map(Number);
      return new THREE.Vector3(x, y, z);
    });

    const geometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
    const material = new THREE.MeshPhongMaterial({ color: 0x4caf50 });
    const mesh = new THREE.InstancedMesh(geometry, material, uniquePositions.length);

    const dummy = new THREE.Object3D();
    uniquePositions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    this.group.add(mesh);
  }
}