import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Post,
  GetPostsParams,
  UsersQueryResponse,
  PostsQueryResponse,
  UpdatePostMutationResponse,
  DeletePostMutationResponse,
} from '@/shared/types';

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
      config => {
        return config;
      },
      error => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      error => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
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
  };

  // Post endpoints
  getPosts = async (params?: GetPostsParams): Promise<PostsQueryResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.userId)
        queryParams.append('userId', params.userId.toString());
      if (params?.limit) queryParams.append('_limit', params.limit.toString());
      if (params?.page) queryParams.append('_page', params.page.toString());

      const url = `/posts${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await this.api.get<PostsQueryResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  createPost = async (postData: Omit<Post, 'id'>): Promise<Post> => {
    try {
      const response = await this.api.post<Post>('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  updatePost = async (postData: Post): Promise<UpdatePostMutationResponse> => {
    try {
      const { id, ...updateData } = postData;
      const response = await this.api.put<UpdatePostMutationResponse>(
        `/posts/${id}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${postData.id}:`, error);
      throw error;
    }
  };

  deletePost = async (id: string): Promise<DeletePostMutationResponse> => {
    try {
      await this.api.delete(`/posts/${id}`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  };
}

// Export a singleton instance
export const apiService = new ApiService();
