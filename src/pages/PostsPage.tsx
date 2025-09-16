import React from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Fab,
  Snackbar,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Post from '@/features/posts';
import { useGetPostsController } from '@/features/posts/view/useGetPostsController';
import { CreatePostDialog } from '@/features/posts/create/CreatePostDialog';
import { useCreatePostController } from '@/features/posts/create/useCreatePostController';

export const PostsPage: React.FC = () => {
  const {
    posts,
    postsLoading,
    postsError,
    snackbar,
    closeSnackbar,
    showErrorMessage,
    onPostDeleted,
    onPostUpdated,
    onPostCreated,
  } = useGetPostsController();

  const {
    postData,
    isCreatePostDialogOpen,
    hideCreatePostDialog,
    updateTitle,
    updateBody,
    updateUserId,
    confirmCreate,
    isCreating,
    showCreatePostDialog,
  } = useCreatePostController({
    onPostCreated,
    onPostCreationError: (_error: Error) =>
      showErrorMessage('Failed to create post'),
  });

  if (postsLoading) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 4, display: 'flex', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (postsError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading posts: {postsError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Posts Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Demonstrating MVC architecture with React, TanStack Query, and
          Material-UI
        </Typography>
      </Box>

      {posts && posts.length > 0 && (
        <Box>
          {posts.map(post => (
            <Post
              key={post.id}
              postData={post}
              onPostDeleted={onPostDeleted}
              onPostUpdated={onPostUpdated}
            />
          ))}
        </Box>
      )}

      <Fab color="primary" aria-label="add post" onClick={showCreatePostDialog}>
        <Add />
      </Fab>

      <CreatePostDialog
        open={isCreatePostDialogOpen}
        onClose={hideCreatePostDialog}
        postData={postData}
        onTitleChange={updateTitle}
        onBodyChange={updateBody}
        onUserIdChange={updateUserId}
        onSubmit={confirmCreate}
        isCreating={isCreating}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
