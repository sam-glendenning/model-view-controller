import { http, HttpResponse } from 'msw';
import type { Post, User } from '@/shared/types';
import { mockUsers, mockPosts } from './data';
import { v4 as uuidv4 } from 'uuid';

// Create isolated copies for each test handler call to prevent mutations
const getIsolatedMockPosts = (): Post[] =>
  JSON.parse(JSON.stringify(mockPosts));
const getIsolatedMockUsers = (): User[] =>
  JSON.parse(JSON.stringify(mockUsers));

// Test handlers with no delay and NO shared state mutations
export const testHandlers = [
  // Users
  http.get('https://jsonplaceholder.typicode.com/users', async () => {
    return HttpResponse.json(getIsolatedMockUsers());
  }),

  http.get(
    'https://jsonplaceholder.typicode.com/users/:id',
    async ({ params }) => {
      const id = parseInt(params['id'] as string);
      const users = getIsolatedMockUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(user);
    },
  ),

  // Posts
  http.get(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      const posts = getIsolatedMockPosts();

      if (userId) {
        const filteredPosts = posts.filter(p => p.userId === parseInt(userId));
        return HttpResponse.json(filteredPosts);
      }

      return HttpResponse.json(posts);
    },
  ),

  http.get(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params }) => {
      const id = params['id'] as string;
      const posts = getIsolatedMockPosts();
      const post = posts.find(p => p.id === id);

      if (!post) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(post);
    },
  ),

  http.post(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      const newPost = (await request.json()) as Omit<Post, 'id'>;
      // Generate a unique UUID for the new post
      const post: Post = {
        ...newPost,
        id: uuidv4(),
      };

      // Return the new post WITHOUT mutating global state
      return HttpResponse.json(post, { status: 201 });
    },
  ),

  http.put(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params, request }) => {
      const id = params['id'] as string;
      const updatedData = (await request.json()) as Partial<Post>;
      const posts = getIsolatedMockPosts();
      const postIndex = posts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      // Create updated post WITHOUT mutating global state
      const updatedPost = { ...posts[postIndex], ...updatedData };
      return HttpResponse.json(updatedPost);
    },
  ),

  http.delete(
    'https://jsonplaceholder.typicode.com/posts/:id',
    async ({ params }) => {
      const id = params['id'] as string;
      const posts = getIsolatedMockPosts();
      const postIndex = posts.findIndex(p => p.id === id);

      if (postIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      // Return success WITHOUT mutating global state
      return new HttpResponse(null, { status: 200 });
    },
  ),
];
