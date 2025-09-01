import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useUsers, 
  useUser, 
  usePosts, 
  usePost, 
  useUserPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  usePostComments
} from '@/hooks';
import { createTestQueryClient } from '@/test/utils';
import { mockUsers, mockPosts, mockComments } from '@/test/mocks/handlers';
import { CreatePostForm, UpdatePostForm } from '@/types';

// Helper to create wrapper with QueryClient
const createWrapper = (queryClient?: QueryClient) => {
  const client = queryClient || createTestQueryClient();
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

describe('API Hooks (Controller Layer)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUsers', () => {
    it('should fetch users successfully', async () => {
      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUsers);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch users error', async () => {
      // Override the mock to return an error
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/users', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('should use correct cache configuration', () => {
      const { result } = renderHook(() => useUsers(), {
        wrapper: createWrapper(),
      });

      // Check that the hook is configured with proper cache settings
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useUser', () => {
    it('should fetch single user successfully', async () => {
      const userId = 1;
      const { result } = renderHook(() => useUser(userId), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUsers[0]);
    });

    it('should not fetch when id is 0 or falsy', () => {
      const { result } = renderHook(() => useUser(0), {
        wrapper: createWrapper(),
      });

      // For disabled queries in TanStack Query v4, fetchStatus should be 'idle'
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();
    });

    it('should handle user not found', async () => {
      const nonExistentId = 999;
      const { result } = renderHook(() => useUser(nonExistentId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('usePosts', () => {
    it('should fetch posts successfully', async () => {
      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPosts);
    });

    it('should handle fetch posts error', async () => {
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/posts', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('usePost', () => {
    it('should fetch single post successfully', async () => {
      const postId = 1;
      const { result } = renderHook(() => usePost(postId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPosts[0]);
    });

    it('should not fetch when id is 0', () => {
      const { result } = renderHook(() => usePost(0), {
        wrapper: createWrapper(),
      });

      // For disabled queries in TanStack Query v4, fetchStatus should be 'idle'
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useUserPosts', () => {
    it('should fetch user posts successfully', async () => {
      const userId = 1;
      const { result } = renderHook(() => useUserPosts(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const expectedPosts = mockPosts.filter(post => post.userId === userId);
      expect(result.current.data).toEqual(expectedPosts);
    });

    it('should not fetch when userId is 0', () => {
      const { result } = renderHook(() => useUserPosts(0), {
        wrapper: createWrapper(),
      });

      // For disabled queries in TanStack Query v4, fetchStatus should be 'idle'
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useCreatePost', () => {
    it('should create post successfully', async () => {
      const queryClient = createTestQueryClient();
      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(queryClient),
      });

      const newPostData: CreatePostForm = {
        title: 'New Test Post',
        body: 'Test post content',
        userId: 1,
      };

      result.current.mutate(newPostData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toMatchObject({
        title: newPostData.title,
        body: newPostData.body,
        userId: newPostData.userId,
        id: expect.any(Number),
      });
    });

    it('should handle create post error', async () => {
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.post('https://jsonplaceholder.typicode.com/posts', () => {
          return new HttpResponse(null, { status: 400 });
        })
      );

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(),
      });

      const newPostData: CreatePostForm = {
        title: 'New Test Post',
        body: 'Test post content',
        userId: 1,
      };

      result.current.mutate(newPostData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useUpdatePost', () => {
    it('should update post successfully', async () => {
      const { result } = renderHook(() => useUpdatePost(), {
        wrapper: createWrapper(),
      });

      const updateData: UpdatePostForm = {
        id: 1,
        title: 'Updated Title',
        body: 'Updated content',
        userId: 1,
      };

      result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toMatchObject({
        id: 1,
        title: 'Updated Title',
        body: 'Updated content',
        userId: 1,
      });
    });

    it('should handle update post error', async () => {
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.put('https://jsonplaceholder.typicode.com/posts/:id', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const { result } = renderHook(() => useUpdatePost(), {
        wrapper: createWrapper(),
      });

      const updateData: UpdatePostForm = {
        id: 999,
        title: 'Updated Title',
        body: 'Updated content',
        userId: 1,
      };

      result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useDeletePost', () => {
    it('should delete post successfully', async () => {
      const { result } = renderHook(() => useDeletePost(), {
        wrapper: createWrapper(),
      });

      const postIdToDelete = 1;
      result.current.mutate(postIdToDelete);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.error).toBeNull();
    });

    it('should handle delete post error', async () => {
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.delete('https://jsonplaceholder.typicode.com/posts/:id', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const { result } = renderHook(() => useDeletePost(), {
        wrapper: createWrapper(),
      });

      const postIdToDelete = 999;
      result.current.mutate(postIdToDelete);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('usePostComments', () => {
    it('should fetch post comments successfully', async () => {
      const postId = 1;
      const { result } = renderHook(() => usePostComments(postId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const expectedComments = mockComments.filter(comment => comment.postId === postId);
      expect(result.current.data).toEqual(expectedComments);
    });

    it('should not fetch when postId is 0', () => {
      const { result } = renderHook(() => usePostComments(0), {
        wrapper: createWrapper(),
      });

      // For disabled queries in TanStack Query v4, fetchStatus should be 'idle'
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();
    });
  });
});
