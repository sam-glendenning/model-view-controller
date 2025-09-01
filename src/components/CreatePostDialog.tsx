import type { CreatePostForm } from '@/types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';

export interface CreatePostDialogProps {
  dialogOpen: boolean;
  closeDialog: () => void;
  formData: CreatePostForm;
  updateFormField: (
    field: 'title' | 'body' | 'userId',
    value: string | number,
  ) => void;
  submitForm: () => void;
  isSubmitDisabled: boolean;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = props => {
  const {
    dialogOpen,
    closeDialog,
    formData,
    updateFormField,
    submitForm,
    isSubmitDisabled,
  } = props;

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
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
            onChange={e => updateFormField('title', e.target.value)}
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
            onChange={e => updateFormField('body', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="User ID"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.userId}
            onChange={e =>
              updateFormField('userId', parseInt(e.target.value) || 1)
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          onClick={submitForm}
          variant="contained"
          disabled={isSubmitDisabled}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
