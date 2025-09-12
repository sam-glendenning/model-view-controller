import { renderHook, act } from '@testing-library/react-hooks';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { useCreatePostController } from './useCreatePostController';
import { mockPosts } from '@/mocks/data';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();
const mockOnClose = jest.fn();

describe('useCreatePostController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      ],
    );
  });

  it('should initialize with default form data', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useCreatePostController({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onClose: mockOnClose,
        }),
      { wrapper },
    );

    expect(result.current.formData).toEqual({
      title: '',
      body: '',
      userId: 1,
    });
    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it('should update form fields correctly', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useCreatePostController({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onClose: mockOnClose,
        }),
      { wrapper },
    );

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

  it('should enable submit when form is valid', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useCreatePostController({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onClose: mockOnClose,
        }),
      { wrapper },
    );

    expect(result.current.isSubmitDisabled).toBe(true);

    act(() => {
      result.current.updateTitle('Valid Title');
    });

    expect(result.current.isSubmitDisabled).toBe(true); // Still disabled - need body too

    act(() => {
      result.current.updateBody('Valid Body');
    });

    expect(result.current.isSubmitDisabled).toBe(false);
  });

  it('should handle successful form submission', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useCreatePostController({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onClose: mockOnClose,
        }),
      { wrapper },
    );

    act(() => {
      result.current.updateTitle('Test Title');
      result.current.updateBody('Test Body');
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockOnSuccess).toHaveBeenCalledWith('Post created successfully!');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle form submission error', async () => {
    // Mock a network error
    const errorHandlers = [
      http.post('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    ];

    server.use(...errorHandlers);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useCreatePostController({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onClose: mockOnClose,
        }),
      { wrapper },
    );

    act(() => {
      result.current.updateTitle('Test Title');
      result.current.updateBody('Test Body');
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockOnError).toHaveBeenCalledWith('Failed to create post');
    expect(mockOnClose).toHaveBeenCalled();

    // Reset handlers
    server.resetHandlers();
  });

  it('should handle close action', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useCreatePostController({
          onSuccess: mockOnSuccess,
          onError: mockOnError,
          onClose: mockOnClose,
        }),
      { wrapper },
    );

    act(() => {
      result.current.handleClose();
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
});
