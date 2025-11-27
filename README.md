# Zee App - Social Media Application

A modern, full-stack social media application built with React, Vite, and Express.js.

## 🚀 Features

- **User Authentication** - Register, login, and logout with JWT
- **Posts Feed** - View all posts (public access)
- **Create Posts** - Share text and images
- **Like System** - Like and unlike posts
- **Comments** - Comment on posts (protected)
- **Responsive Design** - Works on all devices
- **Modern UI** - Dark theme with purple/pink gradients

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Context API (State Management)

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary (Image Upload)
- Multer

## 📦 Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
```

## 🎯 Usage

1. Start the backend server (runs on port 5000)
2. Start the frontend dev server (runs on port 5173)
3. Open http://localhost:5173 in your browser
4. Register a new account
5. Start posting and interacting!

## 📱 Key Features

### Public Access
- View all posts
- See post likes and comment counts

### Authenticated Users
- Create posts with images
- Like/unlike posts
- View and create comments
- Delete own posts and comments

## 🎨 Design

- Professional dark theme
- Purple (#6366f1) and pink (#ec4899) gradient accents
- Smooth animations and transitions
- Responsive layout
- Modern glassmorphism effects

## 📄 License

MIT

---

Built with ❤️ using React and Express.js
