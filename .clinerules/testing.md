# Testing Standards

Like coding standards, automated testing should be done in a way that is coherent across the entire project

## Test Files
- When creating a test file, do not make changes to the implementation
- If there are bugs in the implementation, let me know so I can determine what change needs to be made

## Mocks
- Since this project doesn't make any calls to external sources via web requests, mocking so something doesn't need to be instanced should be avoided

## Test Everything
- If there's a conditional statement, the true and false paths should each have an `it` block in the test file
- If there's a switch/case block, then every case statement should be tested, likely via `it.each` or `describe.each`

## Each file has its own test file
- For example, `map.ts` will have a corresponding test file of `map.test.ts`
- Do not combine multiple implementation files into the same test file

## Test Data
- Test data that can be used across tests, like a basic map, should be placed in `src\tests\fixtures`
- This promotes coherence and consistency across tests
- If there's a data fixture that exists for the type you're looking for, ask for clarification on whether a new fixture should be created or if the existing one should be modified to include your use-case