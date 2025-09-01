import { http, HttpResponse, delay } from 'msw';
import { User, Post, Comment } from '@/types';

// Mock data
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0123',
    website: 'johndoe.com',
    company: {
      name: 'Doe Enterprises',
      catchPhrase: 'Innovation at its best',
      bs: 'synergistic solutions',
    },
    address: {
      street: '123 Main St',
      suite: 'Apt 1',
      city: 'Anytown',
      zipcode: '12345',
      geo: {
        lat: '40.7128',
        lng: '-74.0060',
      },
    },
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0456',
    website: 'janesmith.com',
    company: {
      name: 'Smith & Co',
      catchPhrase: 'Quality first',
      bs: 'scalable platforms',
    },
    address: {
      street: '456 Oak Ave',
      suite: 'Suite 200',
      city: 'Other City',
      zipcode: '67890',
      geo: {
        lat: '34.0522',
        lng: '-118.2437',
      },
    },
  },
];

export const mockPosts: Post[] = [
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
    title: 'Jane\'s Post',
    body: 'A post written by Jane Smith about various topics.',
  },
  {
    id: 4,
    userId: 1,
    title: 'Understanding React Hooks',
    body: 'React Hooks have revolutionized how we write components. This post explores the most commonly used hooks and their practical applications.',
  },
  {
    id: 5,
    userId: 2,
    title: 'Building Scalable APIs',
    body: 'A comprehensive guide to building APIs that can handle growth and maintain performance as your application scales.',
  },
];

export const mockComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    name: 'Great introduction!',
    email: 'sarah@example.com',
    body: 'This is a really helpful introduction to React Hooks. The examples are clear and easy to follow.',
  },
  {
    id: 2,
    postId: 1,
    name: 'Question about useEffect',
    email: 'mike@example.com',
    body: 'I have a question about the dependency array in useEffect. When should I include functions?',
  },
  {
    id: 3,
    postId: 2,
    name: 'TypeScript fan',
    email: 'alex@example.com',
    body: 'TypeScript has been a game-changer for our team. These tips will definitely help us improve our codebase.',
  },
  {
    id: 4,
    postId: 3,
    name: 'API design insights',
    email: 'jessica@example.com',
    body: 'The section about versioning strategies was particularly insightful. We\'re implementing similar approaches.',
  },
];

// Artificial delay function
const artificialDelay = () => delay(1000);

// Request handlers with artificial delays
export const handlers = [
  // Users
  http.get('https://jsonplaceholder.typicode.com/users', async () => {
    await artificialDelay();
    return HttpResponse.json(mockUsers);
  }),

  http.get('https://jsonplaceholder.typicode.com/users/:id', async ({ params }) => {
    await artificialDelay();
    const id = parseInt(params.id as string);
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(user);
  }),

  // Posts
  http.get('https://jsonplaceholder.typicode.com/posts', async ({ request }) => {
    await artificialDelay();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      const filteredPosts = mockPosts.filter(p => p.userId === parseInt(userId));
      return HttpResponse.json(filteredPosts);
    }
    
    return HttpResponse.json(mockPosts);
  }),

  http.get('https://jsonplaceholder.typicode.com/posts/:id', async ({ params }) => {
    await artificialDelay();
    const id = parseInt(params.id as string);
    const post = mockPosts.find(p => p.id === id);
    
    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(post);
  }),

  http.post('https://jsonplaceholder.typicode.com/posts', async ({ request }) => {
    await artificialDelay();
    const newPost = await request.json() as Omit<Post, 'id'>;
    // Generate a unique ID that doesn't conflict with existing posts
    const maxId = Math.max(...mockPosts.map(p => p.id));
    const post: Post = {
      ...newPost,
      id: maxId + 1,
    };
    
    mockPosts.push(post);
    return HttpResponse.json(post, { status: 201 });
  }),

  http.put('https://jsonplaceholder.typicode.com/posts/:id', async ({ params, request }) => {
    await artificialDelay();
    const id = parseInt(params.id as string);
    const updatedData = await request.json() as Partial<Post>;
    const postIndex = mockPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockPosts[postIndex] = { ...mockPosts[postIndex], ...updatedData };
    return HttpResponse.json(mockPosts[postIndex]);
  }),

  http.delete('https://jsonplaceholder.typicode.com/posts/:id', async ({ params }) => {
    await artificialDelay();
    const id = parseInt(params.id as string);
    const postIndex = mockPosts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockPosts.splice(postIndex, 1);
    return new HttpResponse(null, { status: 200 });
  }),

  // Comments
  http.get('https://jsonplaceholder.typicode.com/comments', async ({ request }) => {
    await artificialDelay();
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    
    if (postId) {
      const filteredComments = mockComments.filter(c => c.postId === parseInt(postId));
      return HttpResponse.json(filteredComments);
    }
    
    return HttpResponse.json(mockComments);
  }),
];
