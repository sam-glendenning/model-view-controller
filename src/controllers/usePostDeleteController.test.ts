import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { usePostDeleteController } from './usePostDeleteController';
import { mockPosts } from '@/mocks/data';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

const mockOnPostDeleted = jest.fn();

const mockPost = {
  id: 1,
  userId: 1,
  title: 'Test Post Title',
  body: 'This is a test post body with some content to display.',
};

describe('usePostDeleteController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock posts data
    mockPosts.splice(
      0,
      mockPosts.length,
      ...[
        mockPost,
        {
          id: 2,
          userId: 1,
          title: 'Another Test Post',
          body: 'This is another test post with different content.',
        },
      ],
    );
  });

  it.only('should handle successful post deletion', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        usePostDeleteController({
          postData: mockPost,
          onPostDeleted: mockOnPostDeleted,
        }),
      { wrapper },
    );

    await waitFor(async () => {
      await result.current.deletePost();
    });

    expect(mockOnPostDeleted).toHaveBeenCalled();
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
        usePostDeleteController({
          postData: mockPost,
          onPostDeleted: mockOnPostDeleted,
        }),
      { wrapper },
    );

    await expect(
      act(async () => {
        await result.current.deletePost();
      }),
    ).rejects.toThrow();

    expect(mockOnPostDeleted).not.toHaveBeenCalled();

    // Reset handlers
    server.resetHandlers();
  });
});
