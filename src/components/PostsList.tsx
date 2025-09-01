import React from 'react';
import { Grid, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { PostCard } from './PostCard';
import { Post } from '@/types';

interface PostsListProps {
  posts?: Post[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  onViewPost?: (post: Post) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (post: Post) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export const PostsList: React.FC<PostsListProps> = ({
  posts = [],
  isLoading = false,
  error = null,
  title = 'Posts',
  onViewPost,
  onEditPost,
  onDeletePost,
  showActions = true,
  emptyMessage = 'No posts found',
}) => {
  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Alert severity="error">
          Error loading posts: {error}
        </Alert>
      </Box>
    );
  }

  const renderLoadingSkeletons = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <PostCard isLoading={true} showActions={showActions} />
      </Grid>
    ));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 0, flexGrow: 1 }}>
          {title}
        </Typography>
        {isLoading && (
          <CircularProgress size={24} sx={{ ml: 2 }} />
        )}
      </Box>

      <Grid container spacing={2}>
        {isLoading && renderLoadingSkeletons()}
        
        {!isLoading && posts.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              {emptyMessage}
            </Alert>
          </Grid>
        )}
        
        {!isLoading && posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard
              post={post}
              onView={onViewPost}
              onEdit={onEditPost}
              onDelete={onDeletePost}
              showActions={showActions}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
