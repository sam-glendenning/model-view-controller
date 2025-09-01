// Real API module exports
// This module demonstrates using real axios HTTP calls instead of MSW mocking

// Services
export { realApiService } from './services/realApiService';

// Hooks
export {
  useRealPosts,
  useRealPost,
  useCreateRealPost,
  useUpdateRealPost,
  useDeleteRealPost,
  useRealUsers,
  useRealUser,
  useRealComments,
  useRealPostComments,
} from './hooks/useRealApi';

// Pages
export { RealApiPostsPage } from './pages/RealApiPostsPage';

// Types (re-exported from main types for convenience)
export type {
  Post,
  User,
  Comment,
  CreatePostForm,
  UpdatePostForm,
  GetPostsParams,
  GetCommentsParams,
} from '@/types';
