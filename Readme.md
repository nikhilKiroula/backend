# 🎥 VideoTube — Backend

A **complete backend for a video-sharing platform inspired by YouTube**, built with **Node.js, Express.js, MongoDB, and Mongoose**.

This project focuses on real-world backend development concepts including **RESTful APIs, JWT authentication, access and refresh tokens, authorization, password hashing, protected routes, file uploads, Cloudinary storage, MongoDB relationships, aggregation pipelines, pagination, centralized error handling, and reusable middleware**.

The backend now covers the core platform functionality for **users, videos, comments, likes, subscriptions, playlists, tweets, watch history, and creator dashboard statistics**.

---

## 🚀 Project Status

> ✅ **Core Backend Complete — Controllers, routes, database models, authentication, cloud media handling, social features, playlists, tweets, and dashboard functionality have been implemented and tested using Postman.**

---

# ✨ Features

## 👤 User Authentication & Account Management

- User registration
- User login
- User logout
- JWT-based authentication
- Access token & refresh token
- Protected routes
- Change password
- Update account details
- Update avatar
- Update cover image
- Get current logged-in user
- Get user channel profile
- Watch history
- User authentication and authorization through middleware

## 🎬 Video Platform

- Video upload
- Video thumbnail upload
- Fetch individual videos
- Fetch videos with pagination
- Update video details
- Update video thumbnail
- Delete videos
- Video ownership validation
- Video view tracking
- Cloudinary video storage
- Cloudinary thumbnail storage
- Old Cloudinary media cleanup when media is replaced/deleted
- MongoDB references between videos and users

## 💬 Comments

- Add comments to videos
- Fetch video comments
- Update comments
- Delete comments
- Comment ownership validation
- Pagination for comment listing
- User references through MongoDB

## ❤️ Likes

- Like / unlike videos
- Like / unlike comments
- Like / unlike tweets
- Fetch liked videos
- Fetch liked comments
- Fetch liked tweets
- Prevent duplicate like records
- Paginated like listing

## 🔔 Subscriptions

- Subscribe / unsubscribe from channels
- Get subscribers of a channel
- Get channels subscribed to by a user
- Subscription ownership/reference handling

## 🐦 Tweets

- Create tweets
- Fetch tweets of a user
- Update tweets
- Delete tweets
- Tweet ownership authorization
- Tweet content validation
- Tweets integrated with the like system

## 📂 Playlists

- Create playlists
- Fetch a playlist by ID
- Fetch playlists created by a user
- Update playlist name and description
- Delete playlists
- Add videos to playlists
- Remove videos from playlists
- Playlist ownership validation
- Store video references inside playlists

## 📊 Creator Dashboard

- Get channel statistics
- Total uploaded videos
- Total video views
- Total video likes
- Total subscribers
- Fetch all videos uploaded by the authenticated channel
- Latest channel videos sorted by creation date

## 🔐 Security

- JWT authentication
- Access & refresh token mechanism
- Password hashing with bcrypt
- Protected API routes
- Authorization checks for user-owned resources
- Authentication middleware
- Environment variables for sensitive credentials
- Secure password comparison
- ObjectId validation
- Input validation
- Centralized error handling

## ⚙️ Backend Practices

- RESTful API architecture
- MVC-style separation
- Async request handling
- Custom `ApiError`
- Custom `ApiResponse`
- `asyncHandler` utility
- Reusable middleware
- MongoDB relationships
- Mongoose models & schemas
- MongoDB aggregation pipelines
- Aggregation pagination using `mongoose-aggregate-paginate-v2`
- Multipart file handling with Multer
- Cloudinary integration
- CRUD operations
- Ownership-based authorization
- Consistent API response structure

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Backend framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication & authorization |
| **bcrypt** | Password hashing |
| **Cloudinary** | Cloud media storage |
| **Multer** | Multipart file upload handling |
| **CORS** | Cross-origin request handling |
| **Cookie Parser** | Cookie handling |
| **dotenv** | Environment variable management |
| **mongoose-aggregate-paginate-v2** | Aggregation-based pagination |
| **Nodemon** | Development server auto-restart |
| **Prettier** | Code formatting |

---

# 📁 Project Structure

```text
backend/
│
├── public/
│   └── temp/
│
├── src/
│   │
│   ├── controllers/
│   │   ├── dashboard.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── video.controller.js
│   │   └── ...
│   │
│   ├── db/
│   │   └── ...
│   │
│   ├── middlewares/
│   │   └── ...
│   │
│   ├── models/
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── video.model.js
│   │   └── ...
│   │
│   ├── routes/
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── ...
│   │
│   ├── app.js
│   ├── constants.js
│   └── index.js
│
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json
├── package-lock.json
└── README.md
```

The project follows a modular architecture where:

- **Routes** define API endpoints.
- **Middleware** handles authentication, file uploads, and request processing.
- **Controllers** contain business logic.
- **Models** define MongoDB schemas and relationships.
- **Utilities** provide reusable helpers and standardized responses/errors.

---

# 🏗️ Backend Architecture

The general request flow is:

```text
Client
   │
   ▼
HTTP Request
   │
   ▼
Express Route
   │
   ▼
Middleware
   │
   ├── JWT Authentication
   ├── File Upload
   └── Request Processing
   │
   ▼
Controller
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
   │
   ▼
Controller Response
   │
   ▼
ApiResponse
   │
   ▼
Client
```

---

# 🔐 Authentication & Authorization

The project uses **JWT-based authentication with access and refresh tokens**.

### Authentication Flow

```text
User
 │
 ▼
Login
 │
 ▼
Validate Credentials
 │
 ├── Access Token
 │
 └── Refresh Token
 │
 ▼
Authenticated Request
 │
 ▼
verifyJWT Middleware
 │
 ▼
Verify Token
 │
 ▼
Attach User to req.user
 │
 ▼
Protected Controller
```

Protected controllers use:

```js
req.user._id
```

to identify the currently authenticated user.

This is also used for ownership checks such as:

```text
User
 ├── Can update own video
 ├── Can delete own video
 ├── Can update own comment
 ├── Can delete own comment
 ├── Can update own tweet
 ├── Can delete own tweet
 └── Can manage own playlist
```

---

# 🔑 Password Security

Passwords are never stored as plain text.

They are hashed using **bcrypt** before being stored in MongoDB.

```text
Plain Password
      │
      ▼
bcrypt
      │
      ▼
Password Hash
      │
      ▼
MongoDB
```

During login:

```text
Entered Password
      │
      ▼
bcrypt.compare()
      │
      ▼
Stored Password Hash
      │
      ▼
Valid / Invalid
```

---

# ☁️ File Upload & Cloudinary Architecture

The project uses **Multer** for multipart/form-data uploads and **Cloudinary** for cloud media storage.

```text
Client
  │
  │ Image / Video
  ▼
Multer
  │
  ▼
Temporary File
  │
  ▼
Cloudinary
  │
  ├── Video URL
  └── Thumbnail URL
  │
  ▼
MongoDB
```

When video thumbnails or other Cloudinary media are replaced/deleted, the old Cloudinary resource can also be removed using its `public_id`.

---

# 🗄️ MongoDB & Mongoose

MongoDB is the primary database and Mongoose is used as the ODM.

Main entities include:

```text
User
  ↓
users collection

Video
  ↓
videos collection

Comment
  ↓
comments collection

Like
  ↓
likes collection

Subscription
  ↓
subscriptions collection

Playlist
  ↓
playlists collection

Tweet
  ↓
tweets collection
```

Relationships are handled using MongoDB `ObjectId` references and Mongoose features such as `populate()`.

Examples:

```text
User ───────► Video
User ───────► Comment
User ───────► Like
User ───────► Subscription
User ───────► Playlist
User ───────► Tweet
Playlist ───► Video
```

---

# 📊 Aggregation & Pagination

MongoDB aggregation pipelines are used when operations require filtering, grouping, calculating, sorting, joining, or transforming data.

Example:

```js
const result = await User.aggregate([
    {
        $match: {
            isActive: true
        }
    },
    {
        $sort: {
            createdAt: -1
        }
    }
]);
```

The project also uses:

```text
mongoose-aggregate-paginate-v2
```

for paginated aggregation queries.

Pagination is used for data such as videos, comments, likes, and other potentially large collections.

---

# 📡 RESTful API

The backend follows a RESTful API architecture.

## 👤 User APIs

```http
POST   /api/v1/user/register
POST   /api/v1/user/login
POST   /api/v1/user/logout
POST   /api/v1/user/refresh-token
POST   /api/v1/user/change-password

GET    /api/v1/user/current-user
GET    /api/v1/user/channel/:username
GET    /api/v1/user/history

PATCH  /api/v1/user/update-details
PATCH  /api/v1/user/avatar
PATCH  /api/v1/user/cover-image
```

## 🎬 Video APIs

```http
POST   /api/v1/videos/
GET    /api/v1/videos/
GET    /api/v1/videos/:videoId
PATCH  /api/v1/videos/:videoId
DELETE /api/v1/videos/:videoId
```

## 💬 Comment APIs

```http
POST   /api/v1/comments/:videoId
GET    /api/v1/comments/:videoId
PATCH  /api/v1/comments/c/:commentId
DELETE /api/v1/comments/c/:commentId
```

## ❤️ Like APIs

```http
POST   /api/v1/likes/toggle/v/:videoId
POST   /api/v1/likes/toggle/c/:commentId
POST   /api/v1/likes/toggle/t/:tweetId

GET    /api/v1/likes/videos
GET    /api/v1/likes/comments
GET    /api/v1/likes/tweets
```

## 🔔 Subscription APIs

```http
POST   /api/v1/subscriptions/c/:channelId
GET    /api/v1/subscriptions/c/:channelId
GET    /api/v1/subscriptions/u/:subscriberId
```

## 📂 Playlist APIs

```http
POST   /api/v1/playlist/
GET    /api/v1/playlist/:playlistId
PATCH  /api/v1/playlist/:playlistId
DELETE /api/v1/playlist/:playlistId

PATCH  /api/v1/playlist/add/:videoId/:playlistId
PATCH  /api/v1/playlist/remove/:videoId/:playlistId
GET    /api/v1/playlist/user/:userId
```

## 🐦 Tweet APIs

```http
POST   /api/v1/tweet/
GET    /api/v1/tweet/user/:userId
PATCH  /api/v1/tweet/:tweetId
DELETE /api/v1/tweet/:tweetId
```

## 📊 Dashboard APIs

```http
GET    /api/v1/dashboard/stats
GET    /api/v1/dashboard/videos
```

> **Note:** The exact base URL depends on the server configuration. The examples above assume the application is running with `/api/v1` as the API prefix.

---

# 🧩 Middleware

Middleware is used to handle reusable functionality before requests reach controllers.

Examples include:

- JWT authentication middleware
- File upload middleware
- Request processing
- Centralized error handling

Example:

```js
router.use(verifyJWT);
```

This applies JWT authentication to all routes in that router.

---

# 🛡️ Error Handling

The project uses custom utilities for consistent errors and API responses.

### Custom Error

```js
throw new ApiError(
    400,
    "Invalid video ID"
);
```

### Custom Response

```js
return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "Request completed successfully"
        )
    );
```

This keeps API responses consistent throughout the application.

---

# 🧪 API Testing

The APIs were tested during development using **Postman**.

Testing covered:

- User authentication
- Video creation and management
- Video fetching
- Video pagination
- Comments
- Likes
- Subscriptions
- Playlists
- Tweets
- Dashboard statistics
- Authorization/ownership checks
- Invalid ObjectId handling
- Cloudinary media operations

For file uploads, use:

```text
Body → form-data
```

and provide the required file fields.

For authenticated routes, use the authentication state configured by the project's JWT/cookie flow.

---

# 📚 Key Concepts Implemented

This project provides practical implementation of:

- Node.js
- Express.js
- RESTful APIs
- MongoDB
- Mongoose
- Schema & Models
- CRUD operations
- JWT authentication
- Access Tokens
- Refresh Tokens
- bcrypt
- Authentication
- Authorization
- Protected Routes
- Middleware
- Async Error Handling
- Custom API Errors
- Custom API Responses
- MongoDB Aggregation
- Pagination
- MongoDB Relationships
- Mongoose `populate()`
- ObjectId validation
- Ownership authorization
- File Uploads
- Multer
- Cloudinary
- Cookies
- CORS
- Environment Variables
- API Testing with Postman

---

# 🎯 Project Objective

The main objective of this project was to understand how a **real-world backend application is designed, connected, tested, and structured**.

Instead of building isolated APIs, the project connects multiple backend concepts:

```text
Authentication
      ↓
Authorization
      ↓
Database
      ↓
Business Logic
      ↓
File Upload
      ↓
Cloud Storage
      ↓
REST APIs
      ↓
Social Interactions
      ↓
Creator Dashboard
```

The completed backend demonstrates how a video-sharing platform can manage users, videos, comments, likes, subscriptions, playlists, tweets, and creator analytics using a modular Node.js architecture.

---

# 🚀 Future Enhancements

The core backend is complete. Possible future improvements include:

- [ ] Video search and advanced filtering
- [ ] Personalized video recommendations
- [ ] Trending videos system
- [ ] Video categories and tagging
- [ ] Real-time notification system
- [ ] Email verification
- [ ] Forgot/reset password functionality
- [ ] Swagger / OpenAPI documentation
- [ ] Automated unit and integration testing
- [ ] API rate limiting
- [ ] Production deployment
- [ ] CI/CD pipeline
- [ ] Advanced creator analytics

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/nikhilKiroula/backend.git
```

## 2. Navigate to the Project

```bash
cd backend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment Variables

Create a `.env` file in the root directory.

Example:

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

> Never commit your `.env` file or expose secret credentials publicly.

## 5. Start Development Server

```bash
npm run dev
```

The development server uses Nodemon and starts from:

```text
src/index.js
```

---

# 👨‍💻 Author

**Nikhil Singh Kiroula**

B.Tech — Computer Science & Engineering

GitHub:  
https://github.com/nikhilKiroula

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐.

---

## 📄 License

This project is created for **learning and educational purposes**.
