import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { useDeletePostController } from './useDeletePostController';
import { mockPosts } from '@/mocks/data';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

describe('useDeletePostController', () => {
  const mockOnPostDeleted = jest.fn();
  const mockPost = mockPosts[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useDeletePostController({
          postData: mockPost,
          onPostDeleted: mockOnPostDeleted,
        }),
      { wrapper },
    );

    expect(result.current.isDeletePostDialogOpen).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });

  it('should show and hide confirmation dialog', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useDeletePostController({
          postData: mockPost,
          onPostDeleted: mockOnPostDeleted,
        }),
      { wrapper },
    );

    expect(result.current.isDeletePostDialogOpen).toBe(false);

    act(() => {
      result.current.showDeletePostDialog();
    });

    expect(result.current.isDeletePostDialogOpen).toBe(true);

    act(() => {
      result.current.hideDeletePostDialog();
    });

    expect(result.current.isDeletePostDialogOpen).toBe(false);
  });

  it('should handle successful post deletion', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useDeletePostController({
          postData: mockPost,
          onPostDeleted: mockOnPostDeleted,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.confirmDelete();
    });

    await waitFor(() => {
      expect(mockOnPostDeleted).toHaveBeenCalledWith(mockPost);
      expect(result.current.isDeletePostDialogOpen).toBe(false);
    });
  });

  it('should handle post deletion error', async () => {
    // Mock a network error
    const errorHandlers = [
      http.delete('https://jsonplaceholder.typicode.com/posts/1', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    ];

    server.use(...errorHandlers);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useDeletePostController({
          postData: mockPost,
          onPostDeleted: mockOnPostDeleted,
        }),
      { wrapper },
    );

    await expect(
      act(async () => {
        await result.current.confirmDelete();
      }),
    ).rejects.toThrow();

    expect(mockOnPostDeleted).not.toHaveBeenCalled();

    // Reset handlers
    server.resetHandlers();
  });
});
