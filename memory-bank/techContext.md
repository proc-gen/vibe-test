# Tech Context: 3D L-System Visualizer

## Technology Stack
- **Language**: TypeScript (Strict typing enforced)
- **Bundler/Dev Server**: Vite
- **3D Engine**: Three.js
- **Testing Framework**: Vitest
- **Environment**: Browser (DOM based UI)

## Development Setup
- **Runtime**: Node.js
- **Execution**: `npm run dev` for local development, `npm test` for running the suite.
- **Build Process**: TypeScript compilation followed by Vite bundling.

## Technical Constraints & Decisions
- **Rendering Path**: The project uses `THREE.LineSegments` with a single `BufferGeometry`. This is chosen over creating thousands of individual line objects to minimize draw calls and maintain high FPS during real-time updates.
- **Coordinate System**: Standard Three.js coordinate system (Y-up). The Turtle's initial direction is set to $(0, 1, 0)$.
- **Rotations**: Quaternions are used for all rotations in `Turtle.ts` to avoid Euler angle pitfalls and simplify the implementation of arbitrary axis rotations ($\text{Yaw}, \text{Pitch}, \text{Roll}$).

## Dependencies
- `three`: Core 3D engine.
- `@types/three`: Type definitions for Three.js.
- `vitest`: Unit testing.
- `jsdom`: Mocked browser environment for testing DOM-dependent code.