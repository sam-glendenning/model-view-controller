import { renderHook, act } from '@testing-library/react-hooks';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { useUpdatePostController } from './useUpdatePostController';
import { mockPosts } from '@/mocks/data';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

describe('useUpdatePostController', () => {
  const mockOnPostUpdated = jest.fn();
  const mockPost = mockPosts[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with post data', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUpdatePostController({
          postData: mockPost,
          onPostUpdated: mockOnPostUpdated,
        }),
      { wrapper },
    );

    expect(result.current.formData).toEqual({
      id: 1,
      title: 'Test Post Title',
      body: 'This is a test post body with some content to display.',
      userId: 1,
    });
    expect(result.current.isEditingPost).toBe(false);
  });

  it('should enable and disable editing mode', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUpdatePostController({
          postData: mockPost,
          onPostUpdated: mockOnPostUpdated,
        }),
      { wrapper },
    );

    expect(result.current.isEditingPost).toBe(false);

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.isEditingPost).toBe(true);

    act(() => {
      result.current.cancelEditing();
    });

    expect(result.current.isEditingPost).toBe(false);
  });

  it('should update form fields correctly', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUpdatePostController({
          postData: mockPost,
          onPostUpdated: mockOnPostUpdated,
        }),
      { wrapper },
    );

    act(() => {
      result.current.startEditing();
    });

    act(() => {
      result.current.updateTitle('New Title');
    });

    expect(result.current.formData.title).toBe('New Title');

    act(() => {
      result.current.updateBody('New Body');
    });

    expect(result.current.formData.body).toBe('New Body');

    act(() => {
      result.current.updateUserId(2);
    });

    expect(result.current.formData.userId).toBe(2);
  });

  it('should handle successful form submission', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUpdatePostController({
          postData: mockPost,
          onPostUpdated: mockOnPostUpdated,
        }),
      { wrapper },
    );

    act(() => {
      result.current.startEditing();
      result.current.updateTitle('Updated Title');
      result.current.updateBody('Updated Body');
    });

    await act(async () => {
      await result.current.updatePost();
    });

    expect(mockOnPostUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Updated Title',
        body: 'Updated Body',
      }),
    );
    expect(result.current.isEditingPost).toBe(false);
  });

  it('should handle form submission error', async () => {
    const mockOnPostUpdateError = jest.fn();

    server.use(
      http.put('https://jsonplaceholder.typicode.com/posts/1', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUpdatePostController({
          postData: mockPost,
          onPostUpdated: mockOnPostUpdated,
          onPostUpdateError: mockOnPostUpdateError,
        }),
      { wrapper },
    );

    act(() => {
      result.current.startEditing();
      result.current.updateTitle('Updated Title');
    });

    await act(async () => {
      await result.current.updatePost();
    });

    expect(mockOnPostUpdated).not.toHaveBeenCalled();
    expect(mockOnPostUpdateError).toHaveBeenCalledWith(expect.any(Error));

    // Reset handlers
    server.resetHandlers();
  });

  it('should disable submit when form is invalid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUpdatePostController({
          postData: mockPost,
          onPostUpdated: mockOnPostUpdated,
        }),
      { wrapper },
    );

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.isSaveButtonDisabled).toBe(false);

    act(() => {
      result.current.updateTitle('');
    });

    expect(result.current.isSaveButtonDisabled).toBe(true);

    act(() => {
      result.current.updateTitle('Valid Title');
      result.current.updateBody('');
    });

    expect(result.current.isSaveButtonDisabled).toBe(true);
  });
});
