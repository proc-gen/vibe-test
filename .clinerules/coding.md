# Coding Standards

Code should be coherent across a project and follow strict guidelines

## Types
- Always use types and avoid using `any` and `unknown` at all costs
- For example, use `const pos: Vector2 = {x: 1, y: 1}` instead of `const pos: any = {x:1, y: 1}`

## New files
- When adding new `*.ts` files, always make sure a corresponding `*.test.ts` file is created if it has application logic
- For example, `visualizer.ts` has the test file `visualizer.test.ts`
- Make sure all tests are passing

## Updating files
- Always read the file to see its contents before writing to it. DO NOT BLINDLY OVERWRITE FILES
- If there's an associated `*.test.ts` file, make sure it's updated to test the new logic and that all tests are passing

## Comments
- If it's not complex logic, it doesn't need a comment
- If it's named properly, it doesn't need a comment
- Unless it's to suppress a warning on purpose, it probably doesn't need a comment

## Planning
- Always review your memory when making a plan to review previous context of an area of code
- Always plan on adding/updating test files