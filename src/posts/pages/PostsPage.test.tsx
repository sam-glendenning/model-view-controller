import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { render } from '@/test/utils';
import { PostsPage } from './PostsPage';
import { server } from '@/test/mocks/server';
import { HttpResponse, http } from 'msw';

describe('PostsPage Integration Tests', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const createView = () => render(<PostsPage />);

  it('renders correctly', async () => {
    const { container } = createView();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('should show loading state initially', () => {
    createView();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state when API fails', async () => {
    // Mock API failure
    server.use(
      http.get('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    createView();

    await waitFor(() => {
      expect(screen.getByText(/Error loading posts/)).toBeInTheDocument();
    });

    // Reset handlers
    server.resetHandlers();
  });

  it('should create new post', async () => {
    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Open create dialog
    const openCreatePostDialogButton = screen.getByRole('button', {
      name: 'add post',
    });
    await user.click(openCreatePostDialogButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');

    // Fill form
    const titleInput = within(dialog).getByRole('textbox', { name: 'Title' });
    const bodyInput = within(dialog).getByRole('textbox', { name: 'Content' });

    await user.type(titleInput, 'New Test Post');
    await user.type(bodyInput, 'New test post body');

    // Submit form
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    await act(async () => {
      await user.click(createButton);
    });

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/Post .+ created successfully!/)
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Note: In tests with MSW, the new post won't actually appear in the list
    // because MSW handlers use isolated mock data. The important part is that
    // the create flow works and shows the success message.
  });

  it('should edit existing post', async () => {
    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find and click edit button for first post
    const editButtons = screen.getAllByRole('button', { name: 'edit post' });
    expect(editButtons.length).toBeGreaterThan(0);
    await user.click(editButtons[0]!);

    // Edit the title
    const titleInput = screen.getByRole('textbox', { name: 'Title' });
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Test Post Title');

    // Save changes
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await act(async () => {
      await user.click(saveButton);
    });

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/Post 1 updated successfully!/)
      ).toBeInTheDocument();
    });
  });

  it('should delete existing post', async () => {
    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find and click delete button for first post
    const deleteButtons = screen.getAllByRole('button', {
      name: 'delete post',
    });
    expect(deleteButtons.length).toBeGreaterThan(0);
    await user.click(deleteButtons[0]!);

    // Wait for delete confirmation dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Post')).toBeInTheDocument();
    const confirmDeleteButton = within(dialog).getByRole('button', {
      name: 'Confirm',
    });

    // Confirm deletion
    await act(async () => {
      await user.click(confirmDeleteButton);
    });

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/Post 1 deleted successfully!/)
      ).toBeInTheDocument();
    });
  });

  it('should close snackbar when close button is clicked', async () => {
    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Trigger an action to show snackbar (delete post)
    const deleteButtons = screen.getAllByRole('button', {
      name: 'delete post',
    });
    expect(deleteButtons.length).toBeGreaterThan(0);
    await user.click(deleteButtons[0]!);

    // Wait for delete confirmation dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Delete Post')).toBeInTheDocument();
    const confirmDeleteButton = within(dialog).getByRole('button', {
      name: 'Confirm',
    });
    await act(async () => {
      await user.click(confirmDeleteButton);
    });

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/Post 1 deleted successfully!/)
      ).toBeInTheDocument();
    });

    // Close snackbar
    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    // Wait for snackbar to disappear
    await waitFor(() => {
      expect(
        screen.queryByText(/Post 1 deleted successfully!/)
      ).not.toBeInTheDocument();
    });
  });

  it('should handle create post error', async () => {
    // Mock API failure for create
    server.use(
      http.post('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Open create dialog
    const openCreatePostDialogButton = screen.getByRole('button', {
      name: 'add post',
    });
    await user.click(openCreatePostDialogButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');

    // Fill form
    const titleInput = within(dialog).getByRole('textbox', { name: 'Title' });
    const bodyInput = within(dialog).getByRole('textbox', { name: 'Content' });

    await user.type(titleInput, 'New Test Post');
    await user.type(bodyInput, 'New test post body');

    // Submit form
    const createButton = within(dialog).getByRole('button', { name: 'Create' });
    await act(async () => {
      await user.click(createButton);
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to create post')).toBeInTheDocument();
    });

    // Reset handlers
    server.resetHandlers();
  });

  it('should cancel create dialog', async () => {
    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Open create dialog
    const openCreatePostDialogButton = screen.getByRole('button', {
      name: 'add post',
    });
    await user.click(openCreatePostDialogButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');

    // Fill form partially
    const titleInput = within(dialog).getByRole('textbox', { name: 'Title' });
    await user.type(titleInput, 'New Test Post');

    // Cancel the dialog
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Verify dialog is closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should cancel edit operation', async () => {
    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find and click edit button for first post
    const editButtons = screen.getAllByRole('button', { name: 'edit post' });
    expect(editButtons.length).toBeGreaterThan(0);
    await user.click(editButtons[0]!);

    // Edit the title
    const titleInput = screen.getByRole('textbox', { name: 'Title' });
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Test Post Title');

    // Cancel editing
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Verify we're back to view mode (edit button should be visible again)
    await waitFor(() => {
      expect(
        screen.getAllByRole('button', { name: 'edit post' }).length
      ).toBeGreaterThan(0);
    });
  });

  it('should handle delayed loading states in create dialog', async () => {
    // Mock delayed API response
    server.use(
      http.post('https://jsonplaceholder.typicode.com/posts', async () => {
        // Add delay to test loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        return HttpResponse.json({
          id: '123456789',
          title: 'New Test Post',
          body: 'New test post body',
          userId: 1,
        });
      })
    );

    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Open create dialog
    const openCreatePostDialogButton = screen.getByRole('button', {
      name: 'add post',
    });
    await user.click(openCreatePostDialogButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');

    // Fill form
    const titleInput = within(dialog).getByRole('textbox', { name: 'Title' });
    const bodyInput = within(dialog).getByRole('textbox', { name: 'Content' });

    await user.type(titleInput, 'New Test Post');
    await user.type(bodyInput, 'New test post body');

    // Submit form and check loading state
    const createButton = within(dialog).getByRole('button', { name: 'Create' });

    await act(async () => {
      await user.click(createButton);
    });

    // Check that button shows loading state (disabled)
    expect(createButton).toBeDisabled();

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText(/Post .+ created successfully!/)
      ).toBeInTheDocument();
    });

    // Reset handlers
    server.resetHandlers();
  });

  it('should handle empty post list state', async () => {
    // Mock empty API response
    server.use(
      http.get('https://jsonplaceholder.typicode.com/posts', () => {
        return HttpResponse.json([]);
      })
    );

    createView();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Should not show any posts
    expect(screen.queryByText('Test Post Title')).not.toBeInTheDocument();

    // Should still show the add post button
    expect(
      screen.getByRole('button', { name: 'add post' })
    ).toBeInTheDocument();

    // Reset handlers
    server.resetHandlers();
  });
});
