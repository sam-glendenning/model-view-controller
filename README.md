# MVC React Demo

A demonstration of **Model-View-Controller (MVC)** architecture pattern implemented with modern React technologies.

## 🏗️ Architecture Overview

This project showcases how to implement the MVC pattern in React applications:

### **Model Layer**
- **Data Models**: TypeScript interfaces in `src/types/`
- **API Services**: Axios-based API client in `src/services/`
- **Data Logic**: Centralized API calls and data transformation

### **View Layer**
- **Dumb Components**: Pure UI components in `src/components/`
- **Pages**: Page-level components in `src/pages/`
- **Presentation Logic**: Only concerned with displaying data and capturing user input

### **Controller Layer**
- **Custom Hooks**: Business logic and state management in `src/hooks/`
- **TanStack Query**: Data fetching, caching, and synchronization
- **State Management**: Handles data flow between Model and View

## 🛠️ Tech Stack

- **React** 17.0.2 - UI library
- **TypeScript** 5 - Type safety
- **Material-UI** 5 - Component library
- **TanStack Query** v4 - Server state management
- **Axios** v1 - HTTP client
- **Jest** v29 - Testing framework
- **React Testing Library** 12 - Component testing
- **MSW** v2 - API mocking
- **Yarn** 4 - Package manager
- **Vite** - Build tool and dev server

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn 4

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn dev        # Uses mock API with artificial delays
   yarn dev:mock   # Explicitly use mock API  
   yarn dev:api    # Use real JSONPlaceholder API
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 🔶 Mock API

This project includes a **Mock Service Worker (MSW)** setup that intercepts API requests and returns mock data with artificial delays to simulate real-world network conditions.

### Features
- **500ms Artificial Delay**: All requests have a realistic delay
- **Persistent Data**: Mock data persists during the session
- **Visual Indicator**: Orange badge shows when mock API is active
- **Full CRUD Operations**: Create, read, update, and delete operations
- **Error Simulation**: Proper HTTP status codes and error responses

### Usage

#### Development with Mock API (Default)
```bash
yarn dev        # or yarn dev:mock
```
- All API requests intercepted by MSW
- 500ms delay on all responses
- Rich mock data with realistic content
- Perfect for development and testing

#### Development with Real API
```bash
yarn dev:api
```
- Connects to real JSONPlaceholder API
- No artificial delays
- Real external data

### Mock Data

The mock API includes:
- **5 Posts** with realistic tech content
- **2 Users** with complete profile information
- **4 Comments** with engaging discussions
- **Full CRUD Support** for posts

### Configuration

Mock API behavior is controlled by environment variables:
- `.env.development` - Sets `VITE_USE_MOCK_API=true`
- `.env.production` - Sets `VITE_USE_MOCK_API=false`

## 📁 Project Structure

```
src/
├── components/          # View Layer - Dumb UI components
│   ├── PostCard.tsx
│   ├── PostsList.tsx
│   ├── UserCard.tsx
│   ├── UsersList.tsx
│   └── index.ts
├── hooks/              # Controller Layer - Custom hooks
│   └── index.ts
├── pages/              # View Layer - Page components
│   ├── PostsPage.tsx
│   ├── UsersPage.tsx
│   └── index.ts
├── services/           # Model Layer - API services
│   └── api.ts
├── types/              # Model Layer - Data models
│   └── index.ts
├── test/               # Test files
│   ├── setup.ts
│   └── hooks.test.tsx
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🔄 MVC Implementation Details

### Model Layer (`src/types/`, `src/services/`)
- **Types**: Defines data structures for User, Post, Comment, and API responses
- **API Service**: Centralized HTTP client with interceptors and error handling
- **Data Validation**: TypeScript ensures type safety across the application

### View Layer (`src/components/`, `src/pages/`)
- **Pure Components**: No business logic, only presentation
- **Props-based**: Receive data and callbacks from parent components
- **Material-UI**: Consistent design system and accessibility

### Controller Layer (`src/hooks/`)
- **Custom Hooks**: Encapsulate business logic and data fetching
- **TanStack Query**: Handles caching, background updates, and error states
- **State Management**: Manages loading states, errors, and data synchronization

## 🧪 Testing

Run tests:
```bash
yarn test
```

Run tests with UI:
```bash
yarn test:ui
```

## 📋 Available Scripts

### Development
- `yarn dev` - Start development server with mock API
- `yarn dev:mock` - Explicitly start with mock API (500ms delays)
- `yarn dev:api` - Start with real JSONPlaceholder API

### Building
- `yarn build` - Build for production
- `yarn preview` - Preview production build

### Testing
- `yarn test` - Run Jest tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn test:components` - Run only component tests
- `yarn test:hooks` - Run only hook tests
- `yarn test:integration` - Run only integration tests

### Code Quality
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript compiler

## 🌟 Features

### Posts Management
- View all posts in a responsive grid
- Create new posts with validation
- Edit existing posts
- Delete posts with confirmation
- Real-time UI updates with optimistic updates

### Users Directory
- Browse all users
- View detailed user information
- Responsive card layout

### Technical Features
- **Dark/Light Theme**: Toggle between themes
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and progress indicators
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript coverage
- **Testing**: Unit tests for hooks and components

## 🎯 Learning Objectives

This demo helps understand:

1. **Separation of Concerns**: Clear boundaries between data, presentation, and business logic
2. **React Patterns**: Custom hooks, compound components, and render props
3. **State Management**: Server state vs. client state management
4. **TypeScript**: Advanced type patterns and generic constraints
5. **Testing**: Testing strategies for different layers of the application

## 🔄 Data Flow

```
User Interaction (View) 
    ↓
Custom Hook (Controller)
    ↓
API Service (Model)
    ↓
External API
    ↓
API Service (Model)
    ↓
Custom Hook (Controller)
    ↓
Component Re-render (View)
```

## 🤝 Contributing

This is a demo project, but feel free to:
- Report issues
- Suggest improvements
- Fork and experiment
- Use as a learning resource

## 📄 License

MIT License - feel free to use this project for learning and development.
