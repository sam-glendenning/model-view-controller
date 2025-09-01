import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  CreatePostForm, 
  UpdatePostForm,
  GetPostsParams,
  GetCommentsParams,
  UsersQueryResponse,
  UserQueryResponse,
  PostsQueryResponse,
  PostQueryResponse,
  CommentsQueryResponse,
  CreatePostMutationResponse,
  UpdatePostMutationResponse,
  DeletePostMutationResponse
} from '@/types';
import { transformToApiError, isValidPostId, isValidUserId } from '@/utils';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Initialize axios instance
    this.api = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ Response from ${response.config.url}: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // User endpoints
  getUsers = async (): Promise<UsersQueryResponse> => {
    try {
      const response = await this.api.get<UsersQueryResponse>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  getUserById = async (id: number): Promise<UserQueryResponse> => {
    if (!isValidUserId(id)) {
      throw new Error('Invalid user ID provided');
    }
    
    try {
      const response = await this.api.get<UserQueryResponse>(`/users/${id}`);
      return response.data;
    } catch (error) {
      const apiError = transformToApiError(error);
      console.error(`Error fetching user ${id}:`, apiError);
      throw error;
    }
  }

  // Post endpoints
  getPosts = async (params?: GetPostsParams): Promise<PostsQueryResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append('userId', params.userId.toString());
      if (params?.limit) queryParams.append('_limit', params.limit.toString());
      if (params?.page) queryParams.append('_page', params.page.toString());
      
      const url = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.api.get<PostsQueryResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  getPostById = async (id: number): Promise<PostQueryResponse> => {
    if (!isValidPostId(id)) {
      throw new Error('Invalid post ID provided');
    }
    
    try {
      const response = await this.api.get<PostQueryResponse>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      const apiError = transformToApiError(error);
      console.error(`Error fetching post ${id}:`, apiError);
      throw error;
    }
  }

  getPostsByUserId = async (userId: number): Promise<PostsQueryResponse> => {
    if (!isValidUserId(userId)) {
      throw new Error('Invalid user ID provided');
    }
    
    try {
      const response = await this.api.get<PostsQueryResponse>(`/posts?userId=${userId}`);
      return response.data;
    } catch (error) {
      const apiError = transformToApiError(error);
      console.error(`Error fetching posts for user ${userId}:`, apiError);
      throw error;
    }
  }

  createPost = async (postData: CreatePostForm): Promise<CreatePostMutationResponse> => {
    try {
      const response = await this.api.post<CreatePostMutationResponse>('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  updatePost = async (postData: UpdatePostForm): Promise<UpdatePostMutationResponse> => {
    try {
      const { id, ...updateData } = postData;
      const response = await this.api.put<UpdatePostMutationResponse>(`/posts/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${postData.id}:`, error);
      throw error;
    }
  }

  deletePost = async (id: number): Promise<DeletePostMutationResponse> => {
    try {
      await this.api.delete(`/posts/${id}`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }

  // Comment endpoints
  getComments = async (params?: GetCommentsParams): Promise<CommentsQueryResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.postId) queryParams.append('postId', params.postId.toString());
      if (params?.limit) queryParams.append('_limit', params.limit.toString());
      if (params?.page) queryParams.append('_page', params.page.toString());
      
      const url = `/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.api.get<CommentsQueryResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  getCommentsByPostId = async (postId: number): Promise<CommentsQueryResponse> => {
    try {
      const response = await this.api.get<CommentsQueryResponse>(`/comments?postId=${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
