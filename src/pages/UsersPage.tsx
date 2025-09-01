import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { UsersList } from '@/components/UsersList';
import { useUsers } from '@/hooks';

export const UsersPage: React.FC = () => {
  const { data: users = [], isLoading, error } = useUsers();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Users Directory
        </Typography>
        <Typography variant="h6" color="text.secondary">
          View all users in the system
        </Typography>
      </Box>

      <UsersList
        users={users}
        isLoading={isLoading}
        error={error ? String(error) : null}
        title="All Users"
      />
    </Container>
  );
};
