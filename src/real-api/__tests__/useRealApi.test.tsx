import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealPosts, useCreateRealPost, useDeleteRealPost } from '../hooks/useRealApi';
import { realApiService } from '../services/realApiService';
import type { CreatePostForm } from '@/types';

// Mock the realApiService module
jest.mock('../services/realApiService', () => ({
  realApiService: {
    getPosts: jest.fn(),
    createPost: jest.fn(),
    deletePost: jest.fn(),
  },
}));

const mockedRealApiService = realApiService as jest.Mocked<typeof realApiService>;

// Mock data
const mockPostsData = [
  { id: 1, title: 'Test Post 1', body: 'Body 1', userId: 1 },
  { id: 2, title: 'Test Post 2', body: 'Body 2', userId: 1 },
];

// Helper to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Real API Hooks with Jest Mocking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRealPosts', () => {
    it('should fetch posts using real API service', async () => {
      // Arrange
      mockedRealApiService.getPosts.mockResolvedValueOnce(mockPostsData);

      // Act
      const { result } = renderHook(() => useRealPosts(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedRealApiService.getPosts).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.getPosts).toHaveBeenCalledWith(undefined);
      expect(result.current.data).toEqual(mockPostsData);
    });

    it('should handle errors when API service fails', async () => {
      // Arrange
      const errorMessage = 'API Error';
      mockedRealApiService.getPosts.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useRealPosts(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockedRealApiService.getPosts).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useCreateRealPost', () => {
    it('should create post using real API service', async () => {
      // Arrange
      const newPostData: CreatePostForm = {
        title: 'New Post',
        body: 'New post body',
        userId: 1,
      };
      const createdPost = { ...newPostData, id: 3 };
      mockedRealApiService.createPost.mockResolvedValueOnce(createdPost);

      // Act
      const { result } = renderHook(() => useCreateRealPost(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        result.current.mutate(newPostData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedRealApiService.createPost).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.createPost).toHaveBeenCalledWith(newPostData);
      expect(result.current.data).toEqual(createdPost);
    });

    it('should handle create post errors properly', async () => {
      // Arrange
      const newPostData: CreatePostForm = {
        title: 'New Post',
        body: 'New post body',
        userId: 1,
      };
      const errorMessage = 'Create failed';
      mockedRealApiService.createPost.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useCreateRealPost(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        result.current.mutate(newPostData);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockedRealApiService.createPost).toHaveBeenCalledWith(newPostData);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useDeleteRealPost', () => {
    it('should delete post using real API service', async () => {
      // Arrange
      const postId = 1;
      mockedRealApiService.deletePost.mockResolvedValueOnce(undefined);

      // Act
      const { result } = renderHook(() => useDeleteRealPost(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        result.current.mutate(postId);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedRealApiService.deletePost).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.deletePost).toHaveBeenCalledWith(postId);
    });

    it('should handle delete post errors properly', async () => {
      // Arrange
      const postId = 1;
      const errorMessage = 'Delete failed';
      mockedRealApiService.deletePost.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useDeleteRealPost(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        result.current.mutate(postId);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockedRealApiService.deletePost).toHaveBeenCalledWith(postId);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('Integration testing with multiple API calls', () => {
    it('should demonstrate multiple axios calls being mocked and asserted', async () => {
      // Arrange
      mockedRealApiService.getPosts.mockResolvedValueOnce(mockPostsData);
      mockedRealApiService.createPost.mockResolvedValueOnce({ id: 3, title: 'New', body: 'New body', userId: 1 });
      mockedRealApiService.deletePost.mockResolvedValueOnce(undefined);

      // Act
      const postsHook = renderHook(() => useRealPosts(), { wrapper: createWrapper() });
      const createHook = renderHook(() => useCreateRealPost(), { wrapper: createWrapper() });
      const deleteHook = renderHook(() => useDeleteRealPost(), { wrapper: createWrapper() });

      // Wait for initial posts query
      await waitFor(() => {
        expect(postsHook.result.current.isSuccess).toBe(true);
      });

      // Create a new post
      createHook.result.current.mutate({ title: 'New', body: 'New body', userId: 1 });
      await waitFor(() => {
        expect(createHook.result.current.isSuccess).toBe(true);
      });

      // Delete a post
      deleteHook.result.current.mutate(1);
      await waitFor(() => {
        expect(deleteHook.result.current.isSuccess).toBe(true);
      });

      // Assert all service methods were called correctly
      expect(mockedRealApiService.getPosts).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.createPost).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.deletePost).toHaveBeenCalledTimes(1);
      
      // Verify exact parameters passed to each method
      expect(mockedRealApiService.createPost).toHaveBeenCalledWith({
        title: 'New',
        body: 'New body',
        userId: 1,
      });
      expect(mockedRealApiService.deletePost).toHaveBeenCalledWith(1);
    });
  });
});
