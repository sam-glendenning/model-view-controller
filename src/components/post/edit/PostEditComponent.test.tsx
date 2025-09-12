import { render } from '@testing-library/react';
import {
  PostEditComponent,
  type PostEditComponentProps,
} from './PostEditComponent';
import { mockPosts } from '@/mocks/data';

describe('PostEditComponent', () => {
  it('renders correctly', () => {
    const props: PostEditComponentProps = {
      formData: mockPosts[0],
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
