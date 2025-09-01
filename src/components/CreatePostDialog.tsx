import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import React, { useCallback } from 'react';
import { useCreatePostController } from '@/controllers/useCreatePostController';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const {
    formData,
    isSubmitDisabled,
    handleClose,
    updateTitle,
    updateBody,
    updateUserId,
    submitForm,
  } = useCreatePostController({
    onClose,
    onSuccess,
    onError,
  });

  const handleSubmit = useCallback(async () => {
    await submitForm();
  }, [submitForm]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
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
            value={formData.title}
            onChange={e => updateTitle(e.target.value)}
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
            onChange={e => updateBody(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="User ID"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.userId}
            onChange={e => updateUserId(parseInt(e.target.value) ?? 1)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
