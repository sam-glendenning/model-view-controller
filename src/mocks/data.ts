import type { Post, User } from '@/shared/types';

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
    id: '1',
    userId: 1,
    title: 'Test Post Title',
    body: 'This is a test post body with some content to display.',
  },
  {
    id: '2',
    userId: 1,
    title: 'Another Test Post',
    body: 'This is another test post with different content.',
  },
  {
    id: '3',
    userId: 2,
    title: "Jane's Post",
    body: 'A post written by Jane Smith about various topics.',
  },
  {
    id: '4',
    userId: 1,
    title: 'Understanding React Hooks',
    body: 'React Hooks have revolutionized how we write components. This post explores the most commonly used hooks and their practical applications.',
  },
  {
    id: '5',
    userId: 2,
    title: 'Building Scalable APIs',
    body: 'A comprehensive guide to building APIs that can handle growth and maintain performance as your application scales.',
  },
];
