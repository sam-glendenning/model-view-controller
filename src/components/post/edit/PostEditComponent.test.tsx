import { render } from '@testing-library/react';
import {
  PostEditComponent,
  type PostEditComponentProps,
} from './PostEditComponent';
import { mockPosts } from '@/mocks/data';
import type { Post } from '@/types';

describe('PostEditComponent', () => {
  let mockPost: Post;

  beforeEach(() => {
    mockPost = { ...mockPosts[0] };
  });

  it('renders correctly', () => {
    const props: PostEditComponentProps = {
      formData: mockPost,
      onTitleChange: jest.fn(),
      onBodyChange: jest.fn(),
      onUserIdChange: jest.fn(),
      onSave: jest.fn(),
      onCancel: jest.fn(),
      onDelete: jest.fn(),
      isSaveButtonDisabled: false,
      isUpdating: false,
      isDeleting: false,
    };

    const { asFragment } = render(<PostEditComponent {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
