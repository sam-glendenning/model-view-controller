import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { usePostsController } from './usePostsController';
import { mockPosts } from '@/mocks/data';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

describe('usePostsController', () => {
  beforeEach(() => {
    // Reset mock posts data
    mockPosts.splice(
      0,
      mockPosts.length,
      ...[
        {
          id: 1,
          userId: 1,
          title: 'Test Post Title',
          body: 'This is a test post body with some content to display.',
        },
        {
          id: 2,
          userId: 1,
          title: 'Another Test Post',
          body: 'This is another test post with different content.',
        },
        {
          id: 3,
          userId: 2,
          title: "Jane's Post",
          body: 'A post written by Jane Smith about various topics.',
        },
      ],
    );
  });

  it('should load posts on mount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => usePostsController(), { wrapper });

    expect(result.current.postsLoading).toBe(true);
    expect(result.current.posts).toBeUndefined();
    expect(result.current.postsError).toBeNull();

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    expect(result.current.posts).toHaveLength(3);
    expect(result.current.posts![0]).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'Test Post Title',
      }),
    );
  });

  it('should manage snackbar state correctly', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => usePostsController(), { wrapper });

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
    const wrapper = createWrapper();
    const { result } = renderHook(() => usePostsController(), { wrapper });

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    expect(result.current.posts).toHaveLength(3);

    // Simulate post deletion
    act(() => {
      result.current.onPostDeleted();
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe('Post deleted successfully!');
    expect(result.current.snackbar.severity).toBe('success');
  });

  it('should handle post update callback', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => usePostsController(), { wrapper });

    await waitFor(() => {
      expect(result.current.postsLoading).toBe(false);
    });

    // Simulate post update
    act(() => {
      result.current.onPostUpdated();
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.message).toBe('Post updated successfully!');
    expect(result.current.snackbar.severity).toBe('success');
  });
});
