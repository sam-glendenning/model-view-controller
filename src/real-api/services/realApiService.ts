import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Post,
  User,
  Comment,
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
  DeletePostMutationResponse,
  ApiError
} from '@/types';

class RealApiService {
  private api: AxiosInstance;

  constructor() {
    // Initialize axios instance for real API calls
    this.api = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors for logging
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🌐 Real API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🚨 Real API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ Real API Response: ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Real API Error:', error.response?.data || error.message);
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: unknown): ApiError {
    // Type guard for axios errors
    if (this.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        return {
          message: error.response.data?.message || error.response.statusText || 'API Error',
          status: error.response.status,
          code: error.code,
        };
      }
      
      if (error.request) {
        // Request made but no response received
        return {
          message: 'Network Error - No response received',
          code: error.code,
        };
      }
    }

    // Generic error fallback
    const errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    return {
      message: errorMessage,
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
    };
  }

  private isAxiosError(error: unknown): error is { 
    response?: { status: number; statusText: string; data?: { message?: string } }; 
    request?: unknown; 
    code?: string; 
  } {
    return (
      typeof error === 'object' && 
      error !== null && 
      ('response' in error || 'request' in error)
    );
  }  // Posts API
  async getPosts(params?: GetPostsParams): Promise<PostsQueryResponse> {
    try {
      const response: AxiosResponse<Post[]> = await this.api.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getPost(id: number): Promise<PostQueryResponse> {
    try {
      const response: AxiosResponse<Post> = await this.api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  }

  async createPost(data: CreatePostForm): Promise<CreatePostMutationResponse> {
    try {
      const response: AxiosResponse<Post> = await this.api.post('/posts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async updatePost(data: UpdatePostForm): Promise<UpdatePostMutationResponse> {
    try {
      const response: AxiosResponse<Post> = await this.api.put(`/posts/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${data.id}:`, error);
      throw error;
    }
  }

  async deletePost(id: number): Promise<DeletePostMutationResponse> {
    try {
      await this.api.delete(`/posts/${id}`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }

  // Users API
  async getUsers(): Promise<UsersQueryResponse> {
    try {
      const response: AxiosResponse<User[]> = await this.api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUser(id: number): Promise<UserQueryResponse> {
    try {
      const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  // Comments API
  async getComments(params?: GetCommentsParams): Promise<CommentsQueryResponse> {
    try {
      const response: AxiosResponse<Comment[]> = await this.api.get('/comments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async getPostComments(postId: number): Promise<CommentsQueryResponse> {
    try {
      const response: AxiosResponse<Comment[]> = await this.api.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }
}

export const realApiService = new RealApiService();
export default realApiService;
