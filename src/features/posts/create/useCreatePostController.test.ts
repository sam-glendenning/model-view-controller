import { act, renderHook } from '@testing-library/react-hooks';
import { HttpResponse, http } from 'msw';
import { server } from '@/test/mocks/server';
import { useCreatePostController } from './useCreatePostController';
import { createControllerHookWrapper as createWrapper } from '@/test/utils';

describe('useCreatePostController', () => {
  const mockOnPostCreated = jest.fn();

  const createHook = () =>
    renderHook(
      () =>
        useCreatePostController({
          onPostCreated: mockOnPostCreated,
        }),
      { wrapper: createWrapper() }
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialise with correct default state', () => {
    const { result } = createHook();

    expect(result.current.isCreatePostDialogOpen).toBe(false);
    expect(result.current.isCreating).toBe(false);
  });

  it('allows the user to open and close the dialog', () => {
    const { result } = createHook();

    expect(result.current.isCreatePostDialogOpen).toBe(false);

    act(() => {
      result.current.showCreatePostDialog();
    });

    expect(result.current.isCreatePostDialogOpen).toBe(true);

    act(() => {
      result.current.hideCreatePostDialog();
    });

    expect(result.current.isCreatePostDialogOpen).toBe(false);
  });

  it('handles creating a post', async () => {
    const { result } = createHook();

    act(() => {
      result.current.showCreatePostDialog();
    });
    expect(result.current.isCreatePostDialogOpen).toBe(true);

    act(() => {
      result.current.updateTitle('Test Title');
      result.current.updateBody('Test Body');
      result.current.updateUserId(1);
    });

    await act(async () => {
      await result.current.confirmCreate();
    });

    expect(mockOnPostCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Title',
        body: 'Test Body',
        userId: 1,
      })
    );
    expect(result.current.isCreatePostDialogOpen).toBe(false);

    // Check we reset back to the default values
    expect(result.current.postData).toEqual(
      expect.objectContaining({ title: '', body: '', userId: 1 })
    );
  });

  it('should handle form submission error', async () => {
    const mockOnPostCreationError = jest.fn();

    server.use(
      http.post('https://jsonplaceholder.typicode.com/posts', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHook(
      () =>
        useCreatePostController({
          onPostCreationError: mockOnPostCreationError,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.showCreatePostDialog();
      result.current.updateTitle('Updated Title');
      result.current.updateBody('Updated Content');
      result.current.updateUserId(2);
    });

    await act(async () => {
      await result.current.confirmCreate();
    });

    expect(mockOnPostCreationError).toHaveBeenCalledWith(expect.any(Error));

    // Reset handlers
    server.resetHandlers();
  });

  it('should disable submit when form is invalid', () => {
    const { result } = createHook();

    act(() => {
      result.current.showCreatePostDialog();
    });

    // No data yet so it is disabled
    expect(result.current.isCreateButtonDisabled).toBe(true);

    act(() => {
      result.current.updateTitle('Valid title');
    });

    expect(result.current.isCreateButtonDisabled).toBe(true);

    act(() => {
      result.current.updateBody('Valid body');
    });

    expect(result.current.isCreateButtonDisabled).toBe(false);
  });
});
