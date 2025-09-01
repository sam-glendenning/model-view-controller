# Testing Documentation

This document outlines the comprehensive testing strategy implemented for our MVC React demo application.

## Testing Architecture Overview

Our testing strategy follows the same MVC pattern as our application:

### **Model Layer Testing**
- **MSW (Mock Service Worker)**: Mocks external API calls
- **Mock Data**: Consistent test data across all test suites
- **API Error Simulation**: Tests error handling scenarios

### **View Layer Testing**
- **Snapshot Tests**: Ensure UI consistency and catch unintended changes
- **Component Unit Tests**: Test component behavior in isolation
- **Loading/Error State Tests**: Verify proper state handling

### **Controller Layer Testing**
- **Custom Hook Tests**: Test business logic and data flow
- **React Query Integration**: Test caching and mutation behavior
- **Error Handling**: Test hook error states and recovery

### **Integration Testing**
- **User Flow Tests**: End-to-end user interactions
- **API Integration**: Full data flow from UI to API and back
- **Real User Scenarios**: Click, type, submit workflows

## Testing Stack

- **Vitest**: Modern, fast test runner with excellent TypeScript support
- **React Testing Library**: Component testing with focus on user behavior
- **@testing-library/react-hooks**: Hook testing utilities
- **MSW (Mock Service Worker)**: API mocking for reliable tests
- **@testing-library/user-event**: Realistic user interaction simulation

## Test Organization

```
src/
├── components/__tests__/     # Dumb UI component tests
│   ├── PostCard.test.tsx
│   ├── UserCard.test.tsx
│   ├── PostsList.test.tsx
│   └── UsersList.test.tsx
├── hooks/__tests__/          # Controller layer tests
│   └── hooks.test.tsx
├── pages/__tests__/          # Integration tests
│   ├── PostsPage.integration.test.tsx
│   └── UsersPage.integration.test.tsx
└── test/                     # Test utilities and setup
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── handlers.ts
        └── server.ts
```

## Test Categories

### 1. Snapshot Tests
**Purpose**: Catch unintended UI changes and ensure component consistency

**Example**:
```typescript
it('renders populated post card correctly', () => {
  const { container } = render(
    <PostCard post={mockPost} showActions={true} />
  );
  expect(container.firstChild).toMatchSnapshot();
});
```

**Coverage**:
- ✅ PostCard with full data
- ✅ UserCard with full data
- ✅ PostsList with data
- ✅ UsersList with data
- ✅ Compact vs. detailed views
- ✅ With and without actions

### 2. Component Unit Tests
**Purpose**: Test component behavior, props, and edge cases

**Example**:
```typescript
it('calls onDelete when delete button is clicked', async () => {
  const user = userEvent.setup();
  const onDelete = vi.fn();
  
  render(<PostCard post={mockPost} onDelete={onDelete} />);
  
  const deleteButton = screen.getByLabelText('delete post');
  await user.click(deleteButton);
  
  expect(onDelete).toHaveBeenCalledWith(mockPost);
});
```

**Coverage**:
- ✅ Loading states (skeletons)
- ✅ Error states (no data messages)
- ✅ Action button interactions
- ✅ Prop handling
- ✅ Conditional rendering

### 3. Hook Tests (Controller Layer)
**Purpose**: Test business logic, data fetching, and state management

**Example**:
```typescript
it('should create post successfully', async () => {
  const { result } = renderHook(() => useCreatePost(), {
    wrapper: createWrapper(),
  });

  const newPostData = {
    title: 'New Test Post',
    body: 'Test content',
    userId: 1,
  };

  result.current.mutate(newPostData);

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toMatchObject(newPostData);
});
```

**Coverage**:
- ✅ Data fetching (GET operations)
- ✅ Mutations (POST, PUT, DELETE)
- ✅ Error handling
- ✅ Cache management
- ✅ Loading states
- ✅ Query key patterns

### 4. Integration Tests
**Purpose**: Test complete user workflows and real interactions

**Example**:
```typescript
it('should create a new post successfully', async () => {
  const user = userEvent.setup();
  render(<PostsPage />);

  // Wait for page load
  await waitFor(() => {
    expect(screen.getByText('All Posts')).toBeInTheDocument();
  });

  // Open create dialog
  const addButton = screen.getByLabelText('add post');
  await user.click(addButton);

  // Fill form
  await user.type(screen.getByLabelText('Title'), 'Test Post');
  await user.type(screen.getByLabelText('Content'), 'Test content');

  // Submit
  const createButton = screen.getByRole('button', { name: 'Create' });
  await user.click(createButton);

  // Verify success
  await waitFor(() => {
    expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
  });
});
```

**Coverage**:
- ✅ Create post flow
- ✅ Edit post flow
- ✅ Delete post flow
- ✅ View post flow
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Success feedback

## Mock Service Worker (MSW) Setup

Our MSW configuration provides realistic API mocking:

### Mock Data
- **Users**: Complete user objects with company, address
- **Posts**: Post objects with titles and content
- **Comments**: Comment objects linked to posts

### API Endpoints
- `GET /users` - Returns all mock users
- `GET /users/:id` - Returns specific user
- `GET /posts` - Returns all posts (with userId filtering)
- `GET /posts/:id` - Returns specific post
- `POST /posts` - Creates new post
- `PUT /posts/:id` - Updates existing post
- `DELETE /posts/:id` - Deletes post
- `GET /comments` - Returns comments (with postId filtering)

### Error Simulation
Tests can override MSW handlers to simulate:
- Network errors (500, 404)
- Timeout scenarios
- Malformed data responses

## Running Tests

### All Tests
```bash
yarn test:run
```

### Specific Test Categories
```bash
yarn test:components    # Component tests only
yarn test:hooks        # Hook tests only
yarn test:integration  # Integration tests only
```

### With Coverage
```bash
yarn test:coverage
```

### Watch Mode
```bash
yarn test:watch
```

### UI Mode
```bash
yarn test:ui
```

## Test Utilities

### Custom Render Function
Provides all necessary providers for testing:
```typescript
import { render } from '@/test/utils';

// Automatically includes:
// - QueryClientProvider
// - ThemeProvider
// - CssBaseline
```

### Test Query Client
Optimized for testing with:
- No retries
- No cache persistence
- Immediate stale time

## Coverage Goals

Our tests aim for:
- **90%+ Line Coverage**: Most code paths tested
- **80%+ Branch Coverage**: Error conditions and edge cases
- **100% Critical Path Coverage**: All user workflows tested
- **Snapshot Coverage**: All component variations captured

## Best Practices

### Component Tests
- Test behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Test user interactions, not internal state
- Mock only external dependencies

### Hook Tests
- Test with realistic providers
- Verify both success and error cases
- Test loading states and transitions
- Verify cache behavior

### Integration Tests
- Test complete user workflows
- Use real user interactions (userEvent)
- Verify end-to-end data flow
- Test error recovery

### Snapshot Tests
- Keep snapshots focused and readable
- Update snapshots intentionally
- Review snapshot changes carefully
- Use for component API consistency

## Debugging Tests

### Failed Tests
```bash
# Run specific test file
yarn test PostCard.test.tsx

# Run with verbose output
yarn test --reporter=verbose

# Debug mode
yarn test --no-coverage --reporter=verbose
```

### Test Debugging Tools
- `screen.debug()` - Print current DOM
- `logRoles(container)` - Show available roles
- `screen.getByRole('', { hidden: true })` - Find hidden elements

## Future Enhancements

### Additional Test Types
- **Visual Regression Tests**: Screenshot comparisons
- **Accessibility Tests**: axe-core integration
- **Performance Tests**: Render timing analysis
- **E2E Tests**: Playwright or Cypress

### Test Utilities
- **Custom Matchers**: Domain-specific assertions
- **Test Data Factories**: Dynamic mock data generation
- **Page Object Models**: Reusable test patterns

### CI/CD Integration
- **Parallel Test Execution**: Faster CI feedback
- **Test Result Reporting**: Coverage and trend analysis
- **Automatic Snapshot Updates**: PR-based workflow

## Testing Philosophy

Our testing approach prioritizes:

1. **User-Centric Testing**: Test what users see and do
2. **Confidence Over Coverage**: Quality tests over quantity
3. **Fast Feedback**: Quick test execution for development flow
4. **Maintainable Tests**: Tests that don't break with refactoring
5. **Real Scenarios**: Tests that mirror actual usage

This comprehensive testing strategy ensures our MVC React application is reliable, maintainable, and provides a great user experience.
