# Product Context: 3D L-System Visualizer

## Why this project exists
L-Systems (Lindenmayer systems) are powerful tools for modeling the growth processes of plant development and creating self-similar fractals. Traditionally, these are visualized in 2D; however, moving to 3D allows for more natural representations of organic structures and complex spatial exploration.

## Problems it solves
- **Complexity of Procedural Generation**: Simplifies the process of creating complex organic shapes by using string rewriting rules.
- **Rotation Management**: Solves the "Gimbal Lock" problem in 3D space by utilizing quaternions for the Turtle's rotation, ensuring smooth and predictable movements along any axis.
- **Immediate Feedback**: Provides a real-time loop where changing a single character in a rule instantly updates the visual output.

## How it should work (User Experience)
1. The user opens the application to find a 3D canvas containing an initial L-System structure.
2. A side panel provides input fields for:
    - **Axiom**: The starting string.
    - **Rules**: Production rules in the format `Key -> Value` (e.g., `F -> FF`).
    - **Iterations**: How many times to apply the rules.
    - **Angle**: The rotation angle applied when encountering rotation symbols.
3. As the user types or modifies these values, the visualizer automatically clears the previous structure and renders the new one.
4. The user can rotate, pan, and zoom into the 3D model using an Orbit Controller to inspect the generated geometry.

## User Experience Goals
- **Responsiveness**: The gap between input change and render should be minimal.
- **Intuitive Control**: Standard L-System symbols (like `+`, `-`, `[`, `]`) should behave as expected, extended into 3D space (`&`, `^`, `\`, `/`).
- **Visual Clarity**: High contrast colors and a clean dark theme to make the procedural geometry stand out.