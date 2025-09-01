import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import {
  usePostController,
  UsePostControllerProps,
} from '@/controllers/usePostController';

interface PostComponentProps extends UsePostControllerProps {
  elevation?: number;
  sx?: object;
}

export const PostComponent: React.FC<PostComponentProps> = ({
  post,
  onPostDeleted,
  onPostUpdated,
  elevation = 2,
  sx = {},
}) => {
  const {
    isEditing,
    formData,
    snackbar,
    isSubmitDisabled,
    isLoading,
    startEditing,
    cancelEditing,
    updateFormField,
    savePost,
    deletePost,
    closeSnackbar,
  } = usePostController({ post, onPostDeleted, onPostUpdated });

  return (
    <>
      <Card elevation={elevation} sx={{ mb: 2, ...sx }}>
        <CardContent>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={e => updateFormField('title', e.target.value)}
                sx={{ mb: 2 }}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={4}
                value={formData.body}
                onChange={e => updateFormField('body', e.target.value)}
                sx={{ mb: 2 }}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="User ID"
                type="number"
                value={formData.userId}
                onChange={e =>
                  updateFormField('userId', parseInt(e.target.value) || 1)
                }
                disabled={isLoading}
              />
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ flexGrow: 1, pr: 2 }}
                >
                  {post.title}
                </Typography>
                <Chip
                  label={`Post #${post.id}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {post.body}
              </Typography>

              <Chip
                label={`User ${post.userId}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={
                  isLoading ? <CircularProgress size={16} /> : <Save />
                }
                onClick={savePost}
                variant="contained"
                color="primary"
                disabled={isSubmitDisabled || isLoading}
                size="small"
              >
                Save
              </Button>
              <Button
                startIcon={<Cancel />}
                onClick={cancelEditing}
                variant="outlined"
                disabled={isLoading}
                size="small"
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Edit />}
                onClick={startEditing}
                variant="outlined"
                color="primary"
                size="small"
                aria-label="edit post"
              >
                Edit
              </Button>
            </Box>
          )}

          <Button
            startIcon={isLoading ? <CircularProgress size={16} /> : <Delete />}
            onClick={deletePost}
            variant="outlined"
            color="error"
            disabled={isLoading}
            size="small"
            aria-label="delete post"
          >
            Delete
          </Button>
        </CardActions>
      </Card>

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
    </>
  );
};
