import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { PostComponent } from '@/components/PostComponent';
import { usePostsController } from '@/controllers/usePostsController';
import { CreatePostDialog } from '@/components/CreatePostDialog';

export const PostsPage: React.FC = () => {
  const {
    posts,
    postsLoading,
    postsError,
    snackbar,
    closeSnackbar,
    showSuccessMessage,
    showErrorMessage,
    onPostDeleted,
    onPostUpdated,
  } = usePostsController();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  if (postsLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
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

      <Box>
        {posts?.map((post) => (
          <PostComponent
            key={post.id}
            post={post}
            onPostDeleted={onPostDeleted}
            onPostUpdated={onPostUpdated}
          />
        ))}
      </Box>

      <Fab
        color="primary"
        aria-label="add post"
        onClick={handleOpenCreateDialog}
      >
        <Add />
      </Fab>

      <CreatePostDialog 
        isOpen={isCreateDialogOpen} 
        onClose={handleCloseCreateDialog}
        onSuccess={showSuccessMessage}
        onError={showErrorMessage}
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
