# 🎥 Video Hosting Platform — Backend

A **production-style backend for a video hosting platform inspired by YouTube**, built using **Node.js, Express.js, MongoDB, and Mongoose**.

This project demonstrates how to build a scalable backend with modern authentication, authorization, media handling, database relationships, and RESTful APIs. It includes features such as user authentication, video uploads, likes, dislikes, comments, replies, subscriptions, watch history, and more.

The project follows standard backend development practices including **JWT authentication, access & refresh tokens, bcrypt password hashing, middleware-based authorization, centralized error handling, and reusable API utilities**.

---

## 🚀 Features

### 👤 Authentication & User Management

* User registration
* User login/logout
* JWT-based authentication
* Access token & refresh token
* Password hashing using bcrypt
* Change current password
* Update account details
* Update profile avatar
* Update cover image
* Get current logged-in user
* Get user channel profile

### 🎬 Video Management

* Upload videos
* Upload video thumbnails
* Update video information
* Delete videos
* Fetch videos
* Get video details
* Watch history management

### 👍 Engagement

* Like videos
* Dislike videos
* Remove likes/dislikes
* Comment on videos
* Reply to comments
* Like comments
* Manage comments

### 🔔 Subscription System

* Subscribe to channels
* Unsubscribe from channels
* Get subscriber information
* Manage channel subscriptions

### 🔐 Security

* JWT authentication
* Access token & refresh token mechanism
* Password hashing with bcrypt
* Protected routes
* Authentication middleware
* Authorization checks
* Secure password handling
* Environment variables for sensitive configuration

### 🛠️ Backend Architecture

* RESTful API architecture
* MVC-style project structure
* Custom API response handling
* Centralized error handling
* Async error handling
* Reusable middleware
* MongoDB relationships using Mongoose
* Aggregation pipelines
* Pagination
* File upload handling

---

## 🧑‍💻 Tech Stack

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| **Node.js**    | JavaScript runtime             |
| **Express.js** | Backend web framework          |
| **MongoDB**    | NoSQL database                 |
| **Mongoose**   | MongoDB ODM                    |
| **JWT**        | Authentication & authorization |
| **bcrypt**     | Password hashing               |
| **Multer**     | File upload handling           |
| **Cloudinary** | Video/image storage            |
| **REST API**   | API architecture               |
| **JavaScript** | Backend programming language   |

---

## 📁 Project Structure

```text
backend/
│
├── src/
│   │
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   └── subscription.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   └── subscription.model.js
│   │
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   └── subscription.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   │
│   ├── db/
│   │   └── database.js
│   │
│   ├── app.js
│   └── index.js
│
├── public/
│   └── temp/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

> Project structure may change as new features are added.

---

## 🔐 Authentication Flow

The project uses **JWT-based authentication with access and refresh tokens**.

```text
User Login
    │
    ▼
Validate Credentials
    │
    ▼
Generate Access Token
    │
    ├──────────────► Client
    │
    ▼
Generate Refresh Token
    │
    ▼
Store Refresh Token
```

For protected routes:

```text
Client Request
      │
      ▼
Access Token
      │
      ▼
JWT Middleware
      │
      ▼
Verify Token
      │
      ▼
Identify User
      │
      ▼
Protected Controller
```

---

## 🔑 Password Security

Passwords are **never stored as plain text**.

During registration:

```text
Plain Password
      ↓
bcrypt
      ↓
Hashed Password
      ↓
MongoDB
```

During login:

```text
User Password
      ↓
bcrypt.compare()
      ↓
Stored Hash
      ↓
Valid / Invalid
```

---

## 🗄️ Database

MongoDB is used as the primary database with Mongoose as the ODM.

Main collections include:

```text
users
videos
comments
likes
subscriptions
```

Relationships between collections are handled using **MongoDB ObjectId references and Mongoose population**.

Aggregation pipelines are also used for complex operations such as:

* Video statistics
* Subscriber counts
* Like/dislike counts
* Comment statistics
* User/channel information
* Watch history

---

## ☁️ Media Upload

The project uses **Multer** for handling multipart/form-data uploads.

```text
Client
  │
  │ Video/Image
  ▼
Multer
  │
  ▼
Temporary Local Storage
  │
  ▼
Cloudinary
  │
  ▼
Media URL
  │
  ▼
MongoDB
```

The database stores the required media information/URLs while the actual media files are stored in cloud storage.

---

## 📡 API

The backend follows a **RESTful API architecture**.

Example endpoints:

### Authentication

```http
POST /api/v1/user/register
POST /api/v1/user/login
POST /api/v1/user/logout
POST /api/v1/user/refresh-token
POST /api/v1/user/change-password
```

### User

```http
GET   /api/v1/user/current-user
PATCH /api/v1/user/update-details
PATCH /api/v1/user/avatar
PATCH /api/v1/user/cover-image
GET   /api/v1/user/channel/:username
GET   /api/v1/user/history
```

Additional endpoints are available for videos, comments, likes, and subscriptions.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
```

### 2. Navigate to the project

```bash
cd your-repository
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env`

Add the required environment variables:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit your `.env` file or expose your API keys and secrets.

### 5. Start development server

```bash
npm run dev
```

The server will start on:

```text
http://localhost:8000
```

---

## 🧪 API Testing

The APIs can be tested using tools such as:

* Postman
* Thunder Client
* Insomnia

Authentication-protected endpoints require a valid JWT access token.

Example:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 📚 What I Learned

This project helped me understand and implement:

* Node.js backend development
* Express.js
* RESTful API development
* MongoDB & Mongoose
* Database schema design
* MongoDB aggregation pipelines
* JWT authentication
* Access & refresh token architecture
* Password hashing with bcrypt
* Middleware
* Authentication & authorization
* File uploads
* Cloudinary integration
* MongoDB relationships
* API error handling
* Async error handling
* CRUD operations
* API testing with Postman
* Backend project architecture

---

## 🛣️ Future Improvements

Planned improvements include:

* [ ] Search functionality
* [ ] Video recommendations
* [ ] Video categories
* [ ] Trending videos
* [ ] Advanced pagination
* [ ] Improved video analytics
* [ ] Notification system
* [ ] Email verification
* [ ] Forgot/reset password
* [ ] Rate limiting
* [ ] API documentation with Swagger
* [ ] Production deployment
* [ ] Automated testing

---

## 🎯 Project Goal

The main goal of this project is to build a **complete real-world backend system** while understanding how different backend technologies work together.

Rather than creating isolated APIs, the project focuses on implementing a complete workflow involving:

```text
Authentication
      ↓
Authorization
      ↓
Database
      ↓
Media Upload
      ↓
Business Logic
      ↓
REST APIs
      ↓
User Interaction
```

---

## 👨‍💻 Author

**Nikhil Singh Kiroula**

B.Tech — Computer Science & Engineering

Built as a full-stack backend learning project to understand real-world backend development and scalable API architecture.

---

## ⭐ Support

If you found this project useful for learning backend development, consider giving the repository a ⭐.

---

### 📄 License

This project is intended for educational and learning purposes.
