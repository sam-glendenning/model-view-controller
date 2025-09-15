import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import type { Post } from '@/types';

interface CreatePostDialogProps {
  // Dialog state
  open: boolean;
  onClose: () => void;

  // Form data
  postData: Post;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
  onUserIdChange: (userId: number) => void;

  // Actions
  onSubmit: () => Promise<void>;
  isCreating: boolean;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  open,
  onClose,
  postData,
  onTitleChange,
  onBodyChange,
  onUserIdChange,
  onSubmit,
  isCreating,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={postData.title}
            onChange={e => onTitleChange(e.target.value)}
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
            value={postData.body}
            onChange={e => onBodyChange(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="User ID"
            type="number"
            fullWidth
            variant="outlined"
            value={postData.userId}
            onChange={e => onUserIdChange(parseInt(e.target.value) ?? 1)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isCreating}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
