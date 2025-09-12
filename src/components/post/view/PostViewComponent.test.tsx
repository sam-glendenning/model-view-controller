import { render } from '@testing-library/react';
import {
  PostViewComponent,
  type PostViewComponentProps,
} from './PostViewComponent';

describe('PostViewComponent', () => {
  it('renders correctly', () => {
    const props: PostViewComponentProps = {
      postData: {
        id: 1,
        userId: 1,
        title: 'Test Post Title',
        body: 'This is a test post body with some content to display.',
      },
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      isDeleting: false,
    };
    const { asFragment } = render(<PostViewComponent {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
