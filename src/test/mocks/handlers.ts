import { http, HttpResponse } from 'msw';
import { User, Post } from '@/types';

// Mock data
const mockUsers: User[] = [
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

const mockPosts: Post[] = [
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
];

// Request handlers
export const handlers = [
  // Users
  http.get('https://jsonplaceholder.typicode.com/users', () => {
    return HttpResponse.json(mockUsers);
  }),

  http.get('https://jsonplaceholder.typicode.com/users/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // Posts
  http.get('https://jsonplaceholder.typicode.com/posts', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      const filteredPosts = mockPosts.filter(
        p => p.userId === parseInt(userId),
      );
      return HttpResponse.json(filteredPosts);
    }

    return HttpResponse.json(mockPosts);
  }),

  http.get('https://jsonplaceholder.typicode.com/posts/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const post = mockPosts.find(p => p.id === id);

    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  http.post(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      const newPost = (await request.json()) as Omit<Post, 'id'>;
      // Generate a unique ID that doesn't conflict with existing posts
      const maxId = Math.max(...mockPosts.map(p => p.id));
      const post: Post = {
        ...newPost,
        id: maxId + 1,
      };

      mockPosts.push(post);
      return HttpResponse.json(post, { status: 201 });
    },
  ),

  http.put(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params, request }) => {
      const id = parseInt(params.id as string);
      const updatedData = (await request.json()) as Partial<Post>;
      const postIndex = mockPosts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockPosts[postIndex] = { ...mockPosts[postIndex], ...updatedData };
      return HttpResponse.json(mockPosts[postIndex]);
    },
  ),

  http.delete(
    'https://jsonplaceholder.typicode.com/posts/:id',
    ({ params }) => {
      const id = parseInt(params.id as string);
      const postIndex = mockPosts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockPosts.splice(postIndex, 1);
      return new HttpResponse(null, { status: 200 });
    },
  ),
];
