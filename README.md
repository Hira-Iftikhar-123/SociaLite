# SocialLite Platform

A modern, full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a beautiful pink and black theme.

## 🚀 Features

### Core Features
- **Authentication**
  - User registration and login with JWT
  - Password hashing with bcrypt
  - Protected routes
  - Persistent authentication state

- **Posts**
  - Create, read, update, and delete posts
  - Like/unlike posts
  - Comment on posts
  - Image support for posts
  - Real-time updates

- **User Profiles**
  - View user profiles with posts
  - Edit profile information
  - Upload profile images
  - Follow/unfollow users
  - User statistics

- **Feed**
  - View all posts in chronological order
  - Search and filter posts
  - Responsive design
  - Infinite scroll (ready for implementation)

### Technical Features
- **Frontend**
  - React.js with hooks
  - Zustand for state management
  - React Router for navigation
  - TailwindCSS for styling
  - Responsive design
  - Modern UI/UX with animations

- **Backend**
  - Node.js with Express.js
  - MongoDB with Mongoose
  - JWT authentication
  - RESTful API
  - Input validation
  - Error handling

## 🎨 Design

The application features a modern, dark theme with:
- **Primary Color**: Pink (#ec4899)
- **Background**: Dark grays and blacks
- **Accents**: Pink gradients and highlights
- **Typography**: Clean, modern fonts
- **Animations**: Smooth transitions and hover effects

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/mini-social-media
JWT_SECRET=your-secret-key-here
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Full Stack Setup

From the root directory, you can run both frontend and backend simultaneously:

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
Mini_Social_Media/
├── server/                 # Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── public/            # Static files
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/like/:id` - Like/unlike post
- `POST /api/posts/comment/:id` - Add comment
- `DELETE /api/posts/comment/:id/:comment_id` - Delete comment

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/follow/:id` - Follow/unfollow user
- `GET /api/users/search` - Search users

## 🎯 Usage

1. **Registration/Login**: Create an account or log in to access the platform
2. **Feed**: View and interact with posts from all users
3. **Create Posts**: Share your thoughts with text and optional images
4. **Interact**: Like posts and add comments
5. **Profiles**: View and edit your profile, follow other users
6. **Search**: Find posts and users using the search functionality

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Configure MongoDB connection

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Configure API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Zustand for lightweight state management
- Lucide React for beautiful icons
- React Hot Toast for notifications

---

**Happy coding! 🎉**
