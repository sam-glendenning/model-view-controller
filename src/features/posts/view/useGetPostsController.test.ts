import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useGetPostsController } from './useGetPostsController';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

describe('useGetPostsController', () => {
  const createHook = () =>
    renderHook(() => useGetPostsController(), { wrapper: createWrapper() });

  beforeEach(() => {});

  it('should load posts on mount', async () => {
    const { result } = createHook();

    expect(result.current.postsLoading).toBe(true);
    expect(result.current.posts).toBeUndefined();
    expect(result.current.postsError).toBeNull();

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    expect(result.current.posts).toHaveLength(5);
    expect(result.current.posts![0]).toEqual(
      expect.objectContaining({
        id: '1',
        title: 'Test Post Title',
        body: 'This is a test post body with some content to display.',
      })
    );
  });

  it('should manage snackbar state correctly', async () => {
    const { result } = createHook();

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    // Initial snackbar state
    expect(result.current.snackbar.open).toBe(false);
    expect(result.current.snackbar.message).toBe('');
    expect(result.current.snackbar.severity).toBe('success');

    // Show success message
    act(() => {
      result.current.showSuccessMessage('Test success message');
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe('Test success message');
    expect(result.current.snackbar.severity).toBe('success');

    // Close snackbar
    act(() => {
      result.current.closeSnackbar();
    });

    expect(result.current.snackbar.open).toBe(false);

    // Show error message
    act(() => {
      result.current.showErrorMessage('Test error message');
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe('Test error message');
    expect(result.current.snackbar.severity).toBe('error');
  });

  it('should handle post deletion callback', async () => {
    const { result } = createHook();

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    expect(result.current.posts).toHaveLength(5);

    // Simulate post deletion
    act(() => {
      result.current.onPostDeleted({
        id: '1',
        userId: 1,
        title: 'Test Post Title',
        body: 'This is a test post body with some content to display.',
      });
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe(
      'Post 1 deleted successfully!'
    );
    expect(result.current.snackbar.severity).toBe('success');
  });

  it('should handle post update callback', async () => {
    const { result } = createHook();

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    // Simulate post update
    act(() => {
      result.current.onPostUpdated({
        id: '1',
        userId: 1,
        title: 'Updated Test Post Title',
        body: 'This is an updated test post body.',
      });
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe(
      'Post 1 updated successfully!'
    );
    expect(result.current.snackbar.severity).toBe('success');
  });

  it('should handle post creation callback', async () => {
    const { result } = createHook();

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    // Simulate post creation
    act(() => {
      result.current.onPostCreated({
        id: '4',
        userId: 1,
        title: 'New Test Post',
        body: 'This is a newly created test post.',
      });
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe(
      'Post 4 created successfully!'
    );
    expect(result.current.snackbar.severity).toBe('success');
  });
});
