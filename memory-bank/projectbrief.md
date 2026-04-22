# Project Brief: 3D L-System Visualizer

## Core Goal
Create an interactive, real-time 3D visualization tool for Lindenmayer systems (L-Systems). The application allows users to define grammar rules and axioms to generate complex procedural structures (like plants or fractals) and render them in a 3D environment.

## Objectives
- Implement a robust L-System string generation engine.
- Develop a "Turtle" graphics interpreter capable of translating L-System instructions into 3D paths using quaternions for rotation.
- Provide a high-performance 3D renderer using Three.js.
- Create a simple UI for real-time manipulation of axioms, rules, iteration counts, and rotation angles.

## Success Criteria
- Users can input custom grammars and see the result immediately in 3D.
- The visualization supports complex branching structures (using stack-based state saving/restoring).
- The system is fully typed with TypeScript and verified with automated tests.