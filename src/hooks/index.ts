import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import type { 
  Post, 
  CreatePostForm, 
  UpdatePostForm,
  UsersQueryResponse,
  UserQueryResponse,
  PostsQueryResponse,
  PostQueryResponse,
  CommentsQueryResponse,
  CreatePostMutationResponse,
  UpdatePostMutationResponse,
  DeletePostMutationResponse
} from '@/types';

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  posts: ['posts'] as const,
  post: (id: number) => ['posts', id] as const,
  userPosts: (userId: number) => ['posts', 'user', userId] as const,
  comments: ['comments'] as const,
  postComments: (postId: number) => ['comments', 'post', postId] as const,
};

// User Hooks
export const useUsers = () => {
  return useQuery<UsersQueryResponse, Error>({
    queryKey: queryKeys.users,
    queryFn: () => apiService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUser = (id: number) => {
  return useQuery<UserQueryResponse, Error>({
    queryKey: queryKeys.user(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Post Hooks
export const usePosts = () => {
  return useQuery<PostsQueryResponse, Error>({
    queryKey: queryKeys.posts,
    queryFn: () => apiService.getPosts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePost = (id: number) => {
  return useQuery<PostQueryResponse, Error>({
    queryKey: queryKeys.post(id),
    queryFn: () => apiService.getPostById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

export const useUserPosts = (userId: number) => {
  return useQuery<PostsQueryResponse, Error>({
    queryKey: queryKeys.userPosts(userId),
    queryFn: () => apiService.getPostsByUserId(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

// Post Mutations
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostMutationResponse, Error, CreatePostForm>({
    mutationFn: (postData: CreatePostForm) => apiService.createPost(postData),
    onSuccess: (newPost) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(newPost.userId) });
      
      // Optimistically update the posts cache
      queryClient.setQueryData<Post[]>(queryKeys.posts, (oldPosts) => {
        return oldPosts ? [newPost, ...oldPosts] : [newPost];
      });
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePostMutationResponse, Error, UpdatePostForm>({
    mutationFn: (postData: UpdatePostForm) => apiService.updatePost(postData),
    onSuccess: (updatedPost) => {
      // Update the specific post in cache
      queryClient.setQueryData(queryKeys.post(updatedPost.id), updatedPost);
      
      // Update the post in the posts list
      queryClient.setQueryData<Post[]>(queryKeys.posts, (oldPosts) => {
        return oldPosts?.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
      
      // Update the post in user posts list
      queryClient.setQueryData<Post[]>(queryKeys.userPosts(updatedPost.userId), (oldPosts) => {
        return oldPosts?.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        );
      });
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<DeletePostMutationResponse, Error, number>({
    mutationFn: (id: number) => apiService.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Remove the post from all relevant caches
      queryClient.removeQueries({ queryKey: queryKeys.post(deletedId) });
      
      queryClient.setQueryData<Post[]>(queryKeys.posts, (oldPosts) => {
        return oldPosts?.filter(post => post.id !== deletedId);
      });
      
      // Remove from all user posts caches
      queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
};

// Comment Hooks
export const useComments = () => {
  return useQuery<CommentsQueryResponse, Error>({
    queryKey: queryKeys.comments,
    queryFn: () => apiService.getComments(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePostComments = (postId: number) => {
  return useQuery<CommentsQueryResponse, Error>({
    queryKey: queryKeys.postComments(postId),
    queryFn: () => apiService.getCommentsByPostId(postId),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};
