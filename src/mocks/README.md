# MSW Mock Setup Architecture

This project uses different MSW handler strategies for development vs testing to address different requirements.

## Handler Types

### 1. Runtime Handlers (`handlers.ts`)

**Purpose**: Development experience with persistent data

- **Stateful**: Mutations persist during development session
- **Realistic**: Full CRUD operations modify shared state
- **Session continuity**: Data changes visible across page refreshes

**Usage**:

- Development server (`yarn dev`)
- Manual testing and UI development

### 2. Test Handlers (`testHandlers.ts`)

**Purpose**: Isolated, deterministic testing

- **Stateless**: No mutations to global mock data
- **Isolated**: Each test gets fresh data copies
- **Predictable**: Tests don't affect each other

**Usage**:

- Automated tests (`yarn test`)
- CI/CD pipelines

## Why This Separation?

### The Problem

Originally, both development and tests used the same handlers, which caused:

- **Test pollution**: One test's mutations affected subsequent tests
- **Flaky tests**: Tests passed/failed depending on execution order
- **Hard to debug**: Mysterious state changes between tests

### The Solution

- **Development**: Keep stateful handlers for realistic UX
- **Testing**: Use stateless handlers for test isolation
- **Clean separation**: Different needs, different implementations

## Best Practices

### For Real Applications

In production apps:

- **Development**: Use MSW for consistent development experience
- **Testing**: Use MSW with isolated handlers (like this project)
- **Production**: Real API calls (no MSW)

### Handler Guidelines

- **Runtime handlers**: Mutate shared state for persistence
- **Test handlers**: Return isolated copies, never mutate globals
- **Always**: Deep clone mock data in test handlers
