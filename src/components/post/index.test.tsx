import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import PostComponent from './index';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { mockPosts } from '@/mocks/data';

describe('Post component', () => {
  const mockOnPostDeleted = jest.fn();
  const mockOnPostUpdated = jest.fn();
  let user: UserEvent;

  const createView = () =>
    render(
      <PostComponent
        postData={mockPosts[0]}
        onPostDeleted={mockOnPostDeleted}
        onPostUpdated={mockOnPostUpdated}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  it('should enable editing mode when edit button is clicked', async () => {
    createView();

    const editButton = screen.getByRole('button', { name: 'edit post' });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
  });

  it('should cancel editing when cancel button is clicked', async () => {
    createView();

    const editButton = screen.getByRole('button', { name: 'edit post' });
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'edit post' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Save' }),
      ).not.toBeInTheDocument();
    });
  });

  // TODO don't use window global?
  it.skip('should call delete function when delete button is clicked', async () => {
    createView();

    const deleteButton = screen.getByRole('button', { name: 'delete post' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockOnPostDeleted).toHaveBeenCalledTimes(1);
    });
  });

  it('should update form details and save changes when save button is clicked', async () => {
    createView();

    const editButton = screen.getByRole('button', { name: 'edit post' });
    await user.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'Title' }),
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
        }),
      );
    });

    // Wait for the component to return to view mode
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'edit post' }),
      ).toBeInTheDocument();
    });
  });
});
