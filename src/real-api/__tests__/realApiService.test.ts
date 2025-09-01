import { realApiService } from '../services/realApiService';
import { mockPosts, mockUsers } from '@/mocks/handlers';
import type { CreatePostForm } from '@/types';

// Mock the entire service module
jest.mock('../services/realApiService', () => ({
  realApiService: {
    getPosts: jest.fn(),
    getPost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    getUsers: jest.fn(),
    getUser: jest.fn(),
    getPostComments: jest.fn(),
  },
}));

// Get the mocked service
const mockedRealApiService = realApiService as jest.Mocked<typeof realApiService>;

describe('Real API Service with Jest Mocking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Posts', () => {
    it('should call getPosts and return expected data', async () => {
      // Arrange
      const expectedPosts = mockPosts;
      mockedRealApiService.getPosts.mockResolvedValueOnce(expectedPosts);

      // Act
      const result = await realApiService.getPosts();

      // Assert
      expect(mockedRealApiService.getPosts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedPosts);
    });

    it('should call createPost with correct data', async () => {
      // Arrange
      const newPostData: CreatePostForm = {
        title: 'New Test Post',
        body: 'This is a test post body',
        userId: 1,
      };
      const expectedResponse = { ...newPostData, id: 101 };
      mockedRealApiService.createPost.mockResolvedValueOnce(expectedResponse);

      // Act
      const result = await realApiService.createPost(newPostData);

      // Assert
      expect(mockedRealApiService.createPost).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.createPost).toHaveBeenCalledWith(newPostData);
      expect(result).toEqual(expectedResponse);
    });

    it('should call deletePost with correct ID', async () => {
      // Arrange
      const postId = 1;
      mockedRealApiService.deletePost.mockResolvedValueOnce(undefined);

      // Act
      await realApiService.deletePost(postId);

      // Assert
      expect(mockedRealApiService.deletePost).toHaveBeenCalledTimes(1);
      expect(mockedRealApiService.deletePost).toHaveBeenCalledWith(postId);
    });
  });

  describe('Users', () => {
    it('should call getUsers and return expected data', async () => {
      // Arrange
      const expectedUsers = mockUsers;
      mockedRealApiService.getUsers.mockResolvedValueOnce(expectedUsers);

      // Act
      const result = await realApiService.getUsers();

      // Assert
      expect(mockedRealApiService.getUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('Error Handling', () => {
    it('should handle and propagate errors from service methods', async () => {
      // Arrange
      const networkError = new Error('Network Error');
      mockedRealApiService.getPosts.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(realApiService.getPosts()).rejects.toThrow('Network Error');
    });
  });
});
