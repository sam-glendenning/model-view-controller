import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { render } from '@/test/utils';
import PostComponent from './index';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { mockPosts } from '@/mocks/data';
import type { Post } from '@/shared/types';

describe('Post component', () => {
  const mockOnPostDeleted = jest.fn();
  const mockOnPostUpdated = jest.fn();
  let user: UserEvent;
  let mockPost: Post;

  const createView = () =>
    render(
      <PostComponent
        postData={mockPost}
        onPostDeleted={mockOnPostDeleted}
        onPostUpdated={mockOnPostUpdated}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    // Create a fresh mock post for each test
    // No need to reset mockPosts array since test handlers use isolated copies
    mockPost = mockPosts[0]!;
  });

  describe('editing', () => {
    it('should enable editing mode when edit button is clicked', async () => {
      createView();

      const editButton = screen.getByRole('button', { name: 'edit post' });
      await user.click(editButton);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
      });
    });

    it('should cancel editing when cancel button is clicked', async () => {
      createView();

      const editButton = screen.getByRole('button', { name: 'edit post' });
      await user.click(editButton);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'edit post' })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: 'Save' })
        ).not.toBeInTheDocument();
      });
    });

    it('should update form details and save changes when save button is clicked', async () => {
      createView();

      const editButton = screen.getByRole('button', { name: 'edit post' });
      await user.click(editButton);

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: 'Title' })
        ).toBeInTheDocument();
      });

      const titleInput = screen.getByRole('textbox', { name: 'Title' });
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      const contentInput = screen.getByRole('textbox', { name: 'Content' });
      await user.clear(contentInput);
      await user.type(contentInput, 'Updated Content');

      const userIdInput = screen.getByRole('spinbutton', { name: 'User ID' });
      fireEvent.change(userIdInput, { target: { value: '2' } });

      const saveButton = screen.getByRole('button', { name: 'Save' });

      await act(async () => {
        await user.click(saveButton);
      });

      await waitFor(() => {
        expect(mockOnPostUpdated).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Updated Title',
            body: 'Updated Content',
            userId: 2,
          })
        );
      });

      // Wait for the component to return to view mode
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'edit post' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('deleting', () => {
    it('should open a confirmation of deletion dialog and delete post when confirm button clicked', async () => {
      createView();

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
      const deleteButton = screen.getByRole('button', { name: 'delete post' });

      await act(async () => {
        await user.click(deleteButton);
      });

      // wait for dialog to appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(
        within(screen.getByRole('dialog')).getByText(
          'Are you sure you want to delete Test Post Title?'
        )
      ).toBeInTheDocument();
      const deleteConfirmButton = within(screen.getByRole('dialog')).getByRole(
        'button',
        { name: 'Confirm' }
      );

      await act(async () => {
        await user.click(deleteConfirmButton);
      });

      await waitFor(() => {
        expect(mockOnPostDeleted).toHaveBeenCalledWith(
          expect.objectContaining({ id: '1' })
        );
      });
    });

    it('should close the confirmation dialog when cancel button is clicked', async () => {
      createView();

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
      const deleteButton = screen.getByRole('button', { name: 'delete post' });
      await user.click(deleteButton);

      // wait for dialog to appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const cancelButton = within(screen.getByRole('dialog')).getByRole(
        'button',
        { name: 'Cancel' }
      );
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
