import * as THREE from 'three';

export interface LineSegment {
  start: THREE.Vector3;
  end: THREE.Vector3;
}

export class Turtle {
  static calculatePath(instructions: string, angleDeg: number = 25, stepLength: number = 0.5): LineSegment[] {
    const angleRad = (angleDeg * Math.PI) / 180;
    let currentPosition = new THREE.Vector3(0, 0, 0);
    let currentQuaternion = new THREE.Quaternion();
    const stack: { pos: THREE.Vector3, quat: THREE.Quaternion }[] = [];
    const segments: LineSegment[] = [];

    for (const char of instructions) {
      if (/[a-zA-Z]/.test(char) && !['+', '-', '&', '^', '\\', '/', '[', ']'].includes(char)) {
        const direction = new THREE.Vector3(0, 1, 0).applyQuaternion(currentQuaternion);
        const nextPosition = currentPosition.clone().add(direction.multiplyScalar(stepLength));
        segments.push({
          start: currentPosition.clone(),
          end: nextPosition.clone()
        });
        currentPosition.copy(nextPosition);
        continue;
      }

      switch (char) {
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

    return segments;
  }
}