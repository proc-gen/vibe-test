# System Patterns: 3D L-System Visualizer

## Architecture Overview
The project follows a linear data pipeline where the output of one stage serves as the input for the next, ensuring clear separation between logic and rendering.

`User Input` $\rightarrow$ `LSystem (Generator)` $\rightarrow$ `Turtle (Interpreter)` $\rightarrow$ `Visualizer (Renderer)`

## Component Breakdown

### 1. L-System Generator (`src/lsystem.ts`)
- **Responsibility**: String rewriting based on grammar rules.
- **Key Pattern**: Iterative replacement. It takes an axiom and applies a set of production rules for a specified number of iterations.
- **Data Structure**: Uses a simple mapping `Record<string, string>` for rules.

### 2. Turtle Interpreter (`src/turtle.ts`)
- **Responsibility**: Translating the resulting L-System string into spatial coordinates.
- **Key Pattern**: State Machine / Virtual Cursor.
- **3D Rotation Strategy**: Utilizes **Quaternions** instead of Euler angles to avoid Gimbal Lock and ensure consistent rotation across all axes (Yaw, Pitch, Roll).
- **Stack Mechanism**: Implements a stack (`[` and `]`) to save and restore the Turtle's position and orientation, enabling branching structures like trees.

### 3. Visualizer (`src/visualizer.ts`)
- **Responsibility**: Rendering the calculated paths into a 3D scene.
- **Key Pattern**: Multi-strategy rendering.
    - **Line segments**: Uses `THREE.LineSegments` for high performance and simple structure.
    - **Volumetric meshes**: Uses `THREE.InstancedMesh` with various geometries (`CylinderGeometry`, `CapsuleGeometry`, `BoxGeometry`) to render volumetric representations of the L-System paths efficiently.
- **Camera Model**: Uses an `OrthographicCamera` to maintain consistent scale regardless of distance, which is often preferred for procedural architectural/organic structures.

## Critical Implementation Paths
- **Input Loop**: The `main.ts` file coordinates the flow. Any input change triggers a full re-generation and re-render cycle.
- **Geometry Generation**: 
    - Turtle calculates path $\rightarrow$ array of `{start, end}` vectors.
    - Visualizer converts these to `Float32Array` for Three.js attributes.