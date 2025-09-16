import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
} from '@mui/material';
import { Cancel, Delete, Save } from '@mui/icons-material';
import type { Post } from '@/shared/types';

export interface PostEditComponentProps {
  postData: Post;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  onUserIdChange: (userId: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isSaveButtonDisabled: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const PostEditComponent: React.FC<PostEditComponentProps> = ({
  postData,
  onTitleChange,
  onBodyChange,
  onUserIdChange,
  onSave,
  onCancel,
  onDelete,
  isSaveButtonDisabled,
  isUpdating,
  isDeleting,
}) => {
  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box>
          <TextField
            fullWidth
            label="Title"
            value={postData.title}
            onChange={e => {
              onTitleChange(e.target.value);
            }}
            sx={{ mb: 2 }}
            disabled={isUpdating}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={postData.body}
            onChange={e => {
              onBodyChange(e.target.value);
            }}
            sx={{ mb: 2 }}
            disabled={isUpdating}
          />
          <TextField
            fullWidth
            label="User ID"
            type="number"
            value={postData.userId}
            onChange={e => {
              const parsed = parseInt(e.target.value);
              onUserIdChange(Number.isNaN(parsed) ? 1 : parsed);
            }}
            disabled={isUpdating}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={isUpdating ? <CircularProgress size={16} /> : <Save />}
            onClick={onSave}
            variant="contained"
            color="primary"
            disabled={isSaveButtonDisabled}
            size="small"
          >
            Save
          </Button>
          <Button
            startIcon={<Cancel />}
            onClick={onCancel}
            variant="outlined"
            disabled={isUpdating}
            size="small"
          >
            Cancel
          </Button>
        </Box>

        <Button
          startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
          onClick={onDelete}
          variant="outlined"
          color="error"
          disabled={isUpdating || isDeleting}
          size="small"
          aria-label="delete post"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
