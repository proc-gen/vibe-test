import { describe, it, expect } from 'vitest';
import { Turtle } from '../src/turtle';
import * as THREE from 'three';
import { SAMPLE_INSTRUCTIONS } from '../src/tests/fixtures/lsystem-grammars';

describe('Turtle', () => {
  it('should produce a straight line for movement characters', () => {
    // Test 'F'
    const segmentsF = Turtle.calculatePath('F', 25, 1);
    expect(segmentsF).toHaveLength(1);
    expect(segmentsF[0].end.y).toBe(1);

    // Test other uppercase/lowercase letters as move commands
    const segmentsG = Turtle.calculatePath('G', 25, 1);
    expect(segmentsG).toHaveLength(1);
    expect(segmentsG[0].end.y).toBe(1);

    const segmentsA = Turtle.calculatePath('a', 25, 1);
    expect(segmentsA).toHaveLength(1);
    expect(segmentsA[0].end.y).toBe(1);
  });

  it('should handle rotations correctly', () => {
    // 'F+F' with 90 degrees should go up then right
    const segments = Turtle.calculatePath(SAMPLE_INSTRUCTIONS.turnRight, 90, 1);
    expect(segments).toHaveLength(2);
    
    // First segment: (0,0,0) -> (0,1,0)
    expect(segments[0].start.y).toBeCloseTo(0);
    expect(segments[0].end.y).toBeCloseTo(1);

    // Second segment: should be perpendicular to first
    // Since + is Yaw (Z), it rotates around Z axis in XY plane
    // Initial direction (0,1,0) rotated 90 deg around (0,0,1) becomes (-1,0,0) or (1,0,0)?
    // THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2) 
    // applied to (0,1,0) results in (-1,0,0)
    expect(segments[1].start.y).toBe(1);
    expect(segments[1].end.x).toBeCloseTo(-1);
    expect(segments[1].end.y).toBeCloseTo(1);
  });

  it('should handle stacks correctly for branching', () => {
    // 'F[+F]-F' 
    const segments = Turtle.calculatePath(SAMPLE_INSTRUCTIONS.branching, 90, 1);
    expect(segments).toHaveLength(3);
    
    // Seg 0: (0,0,0) -> (0,1,0)
    // Seg 1: from (0,1,0) rotated +90deg (Yaw Z) -> (-1,1,0)
    expect(segments[1].start.x).toBeCloseTo(0);
    expect(segments[1].start.y).toBeCloseTo(1);
    expect(segments[1].end.x).toBeCloseTo(-1);
    expect(segments[1].end.y).toBeCloseTo(1);

    // Seg 2: from (0,1,0) rotated -90deg (Yaw Z) -> (1,1,0)
    expect(segments[2].start.x).toBeCloseTo(0);
    expect(segments[2].start.y).toBeCloseTo(1);
    expect(segments[2].end.x).toBeCloseTo(1);
    expect(segments[2].end.y).toBeCloseTo(1);
  });

  it('should handle rotations for all axes', () => {
    const angle = 90;
    const step = 1;

    // Test '-' (Yaw -Z)
    const segMinus = Turtle.calculatePath('F-F', angle, step);
    expect(segMinus[1].end.x).toBeCloseTo(1); // Opposite of + which was -1

    // Test '&' (Pitch X)
    const segAmpersand = Turtle.calculatePath('F&F', angle, step);
    // Initial (0,1,0) rotated 90 around (1,0,0) -> (0,0,1)
    expect(segAmpersand[1].end.z).toBeCloseTo(1);

    // Test '^' (Pitch -X)
    const segCaret = Turtle.calculatePath('F^F', angle, step);
    // Initial (0,1,0) rotated 90 around (-1,0,0) -> (0,0,-1)
    expect(segCaret[1].end.z).toBeCloseTo(-1);

    // Test '\' (Roll Y)
    const segBackslash = Turtle.calculatePath('F\\F', angle, step);
    // Initial (0,1,0) rotated 90 around (0,1,0) -> remains (0,1,0) but quaternion changes
    // Let's check a movement after roll: 'F\+F'
    const segRollYaw = Turtle.calculatePath('F\\+F', angle, step);
    // Initial (0,1,0) -> Roll Y 90deg -> Yaw Z 90deg
    // Rotation order in Three.js currentQuaternion.multiply(q) is local.
    // facing (0,1,0) --RollY--> facing (0,1,0), localZ=(1,0,0) --YawZ(local)--> facing (0,0,1)
    expect(segRollYaw[1].end.z).toBeCloseTo(1);

    // Test '/' (Roll -Y)
    const segSlash = Turtle.calculatePath('F/+F', angle, step);
    // Roll -Y 90deg -> Yaw Z 90deg
    // facing (0,1,0) --Roll-Y--> facing (0,1,0), localZ=(-1,0,0) --YawZ(local)--> facing (0,0,-1)
    expect(segSlash[1].end.z).toBeCloseTo(-1);
  });

  it('should handle empty instructions', () => {
    const segments = Turtle.calculatePath('', 25, 1);
    expect(segments).toHaveLength(0);
  });
});