import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import { Add, Api } from '@mui/icons-material';
import { PostsList } from '@/components';
import { useRealPosts, useCreateRealPost, useUpdateRealPost, useDeleteRealPost } from '../hooks/useRealApi';
import { Post, CreatePostForm, UpdatePostForm, PostFormData, SnackbarState } from '@/types';

export const RealApiPostsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    body: '',
    userId: 1,
  });

  // Real API queries and mutations (using axios instead of MSW)
  const { data: posts, isLoading, error } = useRealPosts();
  const createPostMutation = useCreateRealPost();
  const updatePostMutation = useUpdateRealPost();
  const deletePostMutation = useDeleteRealPost();

  const handleOpenDialog = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        body: post.body,
        userId: post.userId,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        body: '',
        userId: 1,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPost(null);
    setFormData({
      title: '',
      body: '',
      userId: 1,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingPost) {
        // Update existing post via real API
        const updateData: UpdatePostForm = {
          id: editingPost.id,
          title: formData.title,
          body: formData.body,
          userId: formData.userId,
        };
        await updatePostMutation.mutateAsync(updateData);
        setSnackbar({ open: true, message: 'Post updated via real API!', severity: 'success' });
      } else {
        // Create new post via real API
        const createData: CreatePostForm = {
          title: formData.title,
          body: formData.body,
          userId: formData.userId,
        };
        await createPostMutation.mutateAsync(createData);
        setSnackbar({ open: true, message: 'Post created via real API!', severity: 'success' });
      }
      handleCloseDialog();
    } catch {
      setSnackbar({ 
        open: true, 
        message: `Failed to ${editingPost ? 'update' : 'create'} post via real API`, 
        severity: 'error' 
      });
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}" via real API?`)) {
      try {
        await deletePostMutation.mutateAsync(post.id);
        setSnackbar({ open: true, message: 'Post deleted via real API!', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to delete post via real API', severity: 'error' });
      }
    }
  };

  const handleViewPost = (post: Post) => {
    alert(`Viewing post from real API: ${post.title}\n\n${post.body}`);
  };

  const isSubmitDisabled = !formData.title.trim() || !formData.body.trim();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
            Real API Posts Management
          </Typography>
          <Chip 
            icon={<Api />} 
            label="Live JSONPlaceholder API" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        <Typography variant="h6" color="text.secondary">
          Same MVC architecture, but using real axios HTTP calls instead of MSW
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Data fetched from: https://jsonplaceholder.typicode.com/posts
        </Typography>
      </Box>

      <PostsList
        posts={posts}
        isLoading={isLoading}
        error={error ? String(error) : null}
        title="Posts from Real API"
        onViewPost={handleViewPost}
        onEditPost={handleOpenDialog}
        onDeletePost={handleDeletePost}
      />

      <Fab
        color="primary"
        aria-label="add post"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingPost ? 'Edit Post' : 'Create New Post'}
            <Chip size="small" label="Real API" color="primary" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="User ID"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) || 1 })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isSubmitDisabled || createPostMutation.isLoading || updatePostMutation.isLoading}
          >
            {editingPost ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
