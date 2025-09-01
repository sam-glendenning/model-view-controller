import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostsPage } from '@/pages/PostsPage';
import { render } from '@/test/utils';
import { mockPosts } from '@/test/mocks/handlers';

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

// Mock window.alert
const mockAlert = jest.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true,
});

describe('PostsPage Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  describe('Posts Loading and Display', () => {
    it('should load and display posts on mount', async () => {
      render(<PostsPage />);

      // Should show loading state initially
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Wait for posts to load and loading to disappear
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Should display all mock posts
      await waitFor(() => {
        mockPosts.forEach(post => {
          expect(screen.getByText(post.title)).toBeInTheDocument();
        });
      }, { timeout: 5000 });
    });

    it('should show posts management header', async () => {
      render(<PostsPage />);

      expect(screen.getByText('Posts Management')).toBeInTheDocument();
      expect(screen.getByText('Demonstrating MVC architecture with React, TanStack Query, and Material-UI')).toBeInTheDocument();
    });
  });

  describe('Create Post Flow', () => {
    it('should create a new post successfully', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('All Posts')).toBeInTheDocument();
      });

      // Click the add button
      const addButton = screen.getByLabelText('add post');
      await user.click(addButton);

      // Should open dialog
      expect(screen.getByText('Create New Post')).toBeInTheDocument();

      // Fill in the form
      const titleInput = screen.getByLabelText('Title');
      const contentInput = screen.getByLabelText('Content');
      const userIdInput = screen.getByLabelText('User ID');

      await user.type(titleInput, 'Integration Test Post');
      await user.type(contentInput, 'This post was created during integration testing');
      await user.clear(userIdInput);
      await user.type(userIdInput, '1');

      // Submit the form
      const createButton = screen.getByRole('button', { name: 'Create' });
      await user.click(createButton);

      // Should close dialog and show success message
      await waitFor(() => {
        expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
      });

      // New post should appear in the list
      expect(screen.getByText('Integration Test Post')).toBeInTheDocument();
    });

    it('should not create post with empty fields', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('All Posts')).toBeInTheDocument();
      });

      // Open create dialog
      const addButton = screen.getByLabelText('add post');
      await user.click(addButton);

      // Try to submit without filling fields
      const createButton = screen.getByRole('button', { name: 'Create' });
      expect(createButton).toBeDisabled();
    });

    it('should cancel post creation', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('All Posts')).toBeInTheDocument();
      });

      // Open create dialog
      const addButton = screen.getByLabelText('add post');
      await user.click(addButton);

      // Cancel
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Post Flow', () => {
    it('should edit an existing post successfully', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
      });

      // Click edit button on first post
      const editButtons = screen.getAllByLabelText('edit post');
      await user.click(editButtons[0]);

      // Should open edit dialog with existing data
      expect(screen.getByText('Edit Post')).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockPosts[0].title)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockPosts[0].body)).toBeInTheDocument();

      // Update the title
      const titleInput = screen.getByLabelText('Title');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Test Post Title');

      // Submit the update
      const updateButton = screen.getByRole('button', { name: 'Update' });
      await user.click(updateButton);

      // Should close dialog and show success message
      await waitFor(() => {
        expect(screen.queryByText('Edit Post')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Post updated successfully!')).toBeInTheDocument();
      });

      // Updated title should appear in the list
      expect(screen.getByText('Updated Test Post Title')).toBeInTheDocument();
    });
  });

  describe('Delete Post Flow', () => {
    it('should delete a post successfully', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
      });

      const originalTitle = mockPosts[0].title;

      // Click delete button on first post
      const deleteButtons = screen.getAllByLabelText('delete post');
      await user.click(deleteButtons[0]);

      // Should call window.confirm
      expect(mockConfirm).toHaveBeenCalledWith(`Are you sure you want to delete "${originalTitle}"?`);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Post deleted successfully!')).toBeInTheDocument();
      });

      // Post should be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(originalTitle)).not.toBeInTheDocument();
      });
    });

    it('should cancel delete when user cancels confirmation', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(false);
      
      render(<PostsPage />);

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
      });

      const originalTitle = mockPosts[0].title;

      // Click delete button
      const deleteButtons = screen.getAllByLabelText('delete post');
      await user.click(deleteButtons[0]);

      // Should call confirm but not delete
      expect(mockConfirm).toHaveBeenCalledWith(`Are you sure you want to delete "${originalTitle}"?`);

      // Post should still be in the list
      expect(screen.getByText(originalTitle)).toBeInTheDocument();
    });
  });

  describe('View Post Flow', () => {
    it('should view a post successfully', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for posts to load
      await waitFor(() => {
        expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
      });

      // Click view button on first post
      const viewButtons = screen.getAllByLabelText('view post');
      await user.click(viewButtons[0]);

      // Should call window.alert with post details
      expect(mockAlert).toHaveBeenCalledWith(
        `Viewing post: ${mockPosts[0].title}\n\n${mockPosts[0].body}`
      );
    });
  });

  describe('Error Handling', () => {
    it('should display error when posts fail to load', async () => {
      // Override the mock to return an error
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.get('https://jsonplaceholder.typicode.com/posts', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<PostsPage />);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Error loading posts/)).toBeInTheDocument();
      });
    });

    it('should handle create post error gracefully', async () => {
      const user = userEvent.setup();
      
      // Override the mock to return an error for POST
      const { server } = await import('@/test/mocks/server');
      const { http, HttpResponse } = await import('msw');
      
      server.use(
        http.post('https://jsonplaceholder.typicode.com/posts', () => {
          return new HttpResponse(null, { status: 400 });
        })
      );

      render(<PostsPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('All Posts')).toBeInTheDocument();
      });

      // Open create dialog and fill form
      const addButton = screen.getByLabelText('add post');
      await user.click(addButton);

      const titleInput = screen.getByLabelText('Title');
      const contentInput = screen.getByLabelText('Content');
      
      await user.type(titleInput, 'Error Test Post');
      await user.type(contentInput, 'This should fail');

      // Submit the form
      const createButton = screen.getByRole('button', { name: 'Create' });
      await user.click(createButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Failed to create post')).toBeInTheDocument();
      });
    });
  });

  describe('UI Interactions', () => {
    it('should toggle between loading and loaded states correctly', async () => {
      render(<PostsPage />);

      // Should show loading initially
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Should hide loading after data loads
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Should show posts
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('should close snackbar messages', async () => {
      const user = userEvent.setup();
      render(<PostsPage />);

      // Wait for load and create a post to trigger snackbar
      await waitFor(() => {
        expect(screen.getByText('All Posts')).toBeInTheDocument();
      });

      // Create a post to show success message
      const addButton = screen.getByLabelText('add post');
      await user.click(addButton);

      const titleInput = screen.getByLabelText('Title');
      const contentInput = screen.getByLabelText('Content');
      
      await user.type(titleInput, 'Snackbar Test');
      await user.type(contentInput, 'Testing snackbar close');

      const createButton = screen.getByRole('button', { name: 'Create' });
      await user.click(createButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
      });

      // Close the snackbar
      const closeButton = screen.getByLabelText(/close/i);
      await user.click(closeButton);

      // Snackbar should be closed
      await waitFor(() => {
        expect(screen.queryByText('Post created successfully!')).not.toBeInTheDocument();
      });
    });
  });
});
