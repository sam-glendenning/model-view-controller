import React from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { UserCard } from './UserCard';
import type { User } from './types';

interface UsersListProps {
  users?: User[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  compact?: boolean;
  emptyMessage?: string;
}

export const UsersList: React.FC<UsersListProps> = ({
  users = [],
  isLoading = false,
  error = null,
  title = 'Users',
  compact = false,
  emptyMessage = 'No users found',
}) => {
  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Alert severity="error">Error loading users: {error}</Alert>
      </Box>
    );
  }

  const renderLoadingSkeletons = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <Grid
        size={{ xs: 12, sm: 6, md: compact ? 6 : 4 }}
        key={`skeleton-${String(index)}`}
      >
        <UserCard isLoading={true} compact={compact} />
      </Grid>
    ));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {isLoading && renderLoadingSkeletons()}

        {!isLoading && users.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">{emptyMessage}</Alert>
          </Grid>
        )}

        {!isLoading &&
          users.map(user => (
            <Grid size={{ xs: 12, sm: 6, md: compact ? 6 : 4 }} key={user.id}>
              <UserCard user={user} compact={compact} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
