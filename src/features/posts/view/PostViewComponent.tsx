import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import type { Post } from '@/features/posts/types';

export interface PostViewComponentProps {
  postData: Post;
  onEditClick: () => void;
  onDeleteClick: () => void;
  isDeleting: boolean;
}

export const PostViewComponent: React.FC<PostViewComponentProps> = ({
  postData,
  onEditClick,
  onDeleteClick,
  isDeleting,
}) => {
  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 2 }}>
              {postData.title}
            </Typography>
            <Chip
              label={`Post #${postData.id}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {postData.body}
          </Typography>

          <Chip
            label={`User ${String(postData.userId)}`}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Edit />}
            onClick={onEditClick}
            variant="outlined"
            color="primary"
            size="small"
            aria-label="edit post"
          >
            Edit
          </Button>
        </Box>

        <Button
          startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
          onClick={onDeleteClick}
          variant="outlined"
          color="error"
          disabled={isDeleting}
          size="small"
          aria-label="delete post"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
