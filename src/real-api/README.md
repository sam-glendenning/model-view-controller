# Real API Implementation

This directory contains a complete implementation of the MVC pattern using **real axios HTTP calls** instead of MSW (Mock Service Worker). This demonstrates how to test axios-based services using Jest mocking.

## Key Differences from MSW Implementation

| Aspect | MSW Implementation | Real API Implementation |
|--------|-------------------|-------------------------|
| **HTTP Calls** | Intercepted by MSW | Real axios requests to JSONPlaceholder API |
| **Testing Strategy** | MSW handlers | Jest mocks of service methods |
| **Network Layer** | Mock browser requests | Actual HTTP calls with axios interceptors |
| **Error Handling** | MSW error responses | Real network errors + axios error handling |
| **Development** | Works offline | Requires internet connection |

## Directory Structure

```
src/real-api/
├── services/
│   └── realApiService.ts      # Axios-based API service
├── hooks/
│   └── useRealApi.ts          # TanStack Query hooks
├── pages/
│   └── RealApiPostsPage.tsx   # Demo page component
├── __tests__/
│   ├── realApiService.test.ts # Jest tests with service mocking
│   └── useRealApi.test.tsx    # React hooks tests
└── index.ts                   # Module exports
```

## Key Features

### 🌐 Real HTTP Calls
- Uses axios to make real HTTP requests to `https://jsonplaceholder.typicode.com`
- Proper error handling for network failures and HTTP errors
- Request/response interceptors for logging and debugging

### 🧪 Jest-Based Testing
- **Service Tests**: Mock the entire service module using `jest.mock()`
- **Hook Tests**: Mock service methods to test React Query integration
- **Assert Method Calls**: Verify exact parameters passed to axios calls
- **Error Scenarios**: Test both network errors and HTTP error responses

### 🔄 Same UI Components
- Reuses existing `PostsList`, form components, and Material-UI elements
- Same TypeScript types and interfaces
- Identical user experience with visual indicators showing "Real API" usage

## Testing Strategy

### Service Layer Testing (`realApiService.test.ts`)

```typescript
// Mock the entire service module
jest.mock('../services/realApiService', () => ({
  realApiService: {
    getPosts: jest.fn(),
    createPost: jest.fn(),
    deletePost: jest.fn(),
    // ... other methods
  },
}));

// Test that service methods are called with correct parameters
expect(mockedRealApiService.createPost).toHaveBeenCalledWith({
  title: 'New Post',
  body: 'Post content',
  userId: 1,
});
```

### React Hooks Testing (`useRealApi.test.tsx`)

```typescript
// Mock service and test TanStack Query integration
mockedRealApiService.getPosts.mockResolvedValueOnce(mockData);

const { result } = renderHook(() => useRealPosts(), {
  wrapper: createWrapper(),
});

await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});
```

## Comparison with MSW Approach

### MSW Testing (Original)
```typescript
// MSW intercepts actual HTTP calls
http.get('https://jsonplaceholder.typicode.com/posts', () => {
  return HttpResponse.json(mockPosts);
});

// Tests make real HTTP calls that get intercepted
const response = await apiService.getPosts();
```

### Jest Mocking (Real API)
```typescript
// Jest mocks the service methods directly
mockedRealApiService.getPosts.mockResolvedValueOnce(mockPosts);

// Tests verify service method calls and parameters
expect(mockedRealApiService.getPosts).toHaveBeenCalledWith();
```

## Usage Examples

### Basic Service Usage

```typescript
import { realApiService } from '@/real-api';

// Fetch posts from real API
const posts = await realApiService.getPosts();

// Create new post
const newPost = await realApiService.createPost({
  title: 'My Post',
  body: 'Post content',
  userId: 1,
});
```

### React Hook Usage

```typescript
import { useRealPosts, useCreateRealPost } from '@/real-api';

function MyComponent() {
  const { data: posts, isLoading } = useRealPosts();
  const createPost = useCreateRealPost();

  const handleCreate = () => {
    createPost.mutate({
      title: 'New Post',
      body: 'Content',
      userId: 1,
    });
  };

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Benefits of This Approach

### ✅ Advantages
- **Real Network Behavior**: Tests actual HTTP client configuration
- **Direct Method Testing**: Verify exact service method calls and parameters
- **Simpler Mocking**: No need to set up MSW handlers for tests
- **Real Error Handling**: Test actual axios error scenarios
- **Fast Tests**: No network overhead in tests

### ⚠️ Trade-offs
- **No Request/Response Interception Testing**: Can't test the actual HTTP request format
- **Service-Level Mocking**: Tests mock at a higher abstraction level
- **Network Dependency**: Real usage requires internet connection
- **Less Integration**: Service and HTTP client are tested separately

## Running Tests

```bash
# Run all real-api tests
npm test -- --testPathPattern="real-api"

# Run specific test files
npm test -- realApiService.test.ts
npm test -- useRealApi.test.tsx
```

## Integration with Existing Codebase

The real-api implementation coexists with the original MSW-based implementation:

- **Shared Types**: Both implementations use the same TypeScript interfaces
- **Shared Components**: Both use the same UI components and hooks pattern
- **Separate Directories**: Clean separation allows comparison and choice
- **Same Architecture**: Both follow the MVC pattern with service/hook/component layers

This demonstrates how the same application architecture can support different API strategies based on testing and development needs.
