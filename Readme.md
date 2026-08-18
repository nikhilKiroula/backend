# 🎥 VideoTube — Backend

A **complete backend for a video hosting platform inspired by YouTube**, built using **Node.js, Express.js, MongoDB, and Mongoose**.

This project is designed to understand and implement real-world backend development practices such as **RESTful APIs, JWT authentication, access and refresh tokens, password hashing, protected routes, file uploads, cloud media storage, MongoDB relationships, aggregation pipelines, pagination, centralized error handling, and reusable middleware**.

The goal of this project is to build a scalable backend that can power a complete video-sharing platform with users, videos, comments, likes, subscriptions, watch history, and other related functionality.

---

## 🚀 Features

### 👤 User Authentication & Account Management

* User registration
* User login
* User logout
* JWT-based authentication
* Access token & refresh token
* Protected routes
* Change password
* Update account details
* Update avatar
* Update cover image
* Get current logged-in user
* Get user channel profile
* Watch history

### 🎬 Video Platform

* Video upload
* Video thumbnail upload
* Video management
* Video-related database operations
* Video ownership using MongoDB references
* Cloud-based media storage

### 💬 Social Features

* Comments
* Replies
* Likes
* Dislikes
* Comment interactions
* Channel subscriptions
* Subscribe / unsubscribe functionality

### 🔐 Security

* JWT authentication
* Access & refresh token mechanism
* Password hashing with bcrypt
* Protected API routes
* Authentication middleware
* Environment variables for sensitive credentials
* Secure password comparison

### ⚙️ Backend Practices

* RESTful API architecture
* MVC-style separation
* Async request handling
* Custom `ApiError`
* Custom `ApiResponse`
* Centralized error handling
* Reusable middleware
* MongoDB relationships
* Mongoose models & schemas
* MongoDB aggregation pipelines
* Pagination using `mongoose-aggregate-paginate-v2`
* Multipart file handling with Multer
* Cloudinary integration

---

## 🛠️ Tech Stack

| Technology                         | Purpose                         |
| ---------------------------------- | ------------------------------- |
| **Node.js**                        | JavaScript runtime              |
| **Express.js**                     | Backend framework               |
| **MongoDB**                        | NoSQL database                  |
| **Mongoose**                       | MongoDB ODM                     |
| **JWT**                            | Authentication & authorization  |
| **bcrypt**                         | Password hashing                |
| **Cloudinary**                     | Cloud media storage             |
| **Multer**                         | File upload handling            |
| **CORS**                           | Cross-origin request handling   |
| **Cookie Parser**                  | Cookie handling                 |
| **dotenv**                         | Environment variable management |
| **mongoose-aggregate-paginate-v2** | Aggregation-based pagination    |
| **Nodemon**                        | Development server auto-restart |
| **Prettier**                       | Code formatting                 |

---

## 📁 Project Structure

```text
backend/
│
├── public/
│   └── temp/
│
├── src/
│   │
│   ├── controllers/
│   │   └── ...
│   │
│   ├── db/
│   │   └── ...
│   │
│   ├── middlewares/
│   │   └── ...
│   │
│   ├── models/
│   │   └── ...
│   │
│   ├── routes/
│   │   └── ...
│   │
│   ├── utils/
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

The project follows a modular structure where routes handle endpoints, controllers contain business logic, models define database schemas, middleware handles reusable request processing, and utilities contain reusable helper functionality.

---

# 🏗️ Backend Architecture

The general request flow of the application is:

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
   ├── Authentication
   ├── File Upload
   └── Validation / Processing
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
API Response
   │
   ▼
Client
```

---

# 🔐 Authentication

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
 ▼
Generate Access Token
 │
 ├──────────────► Client
 │
 ▼
Generate Refresh Token
 │
 ▼
Authentication State
```

For protected routes:

```text
Client Request
      │
      ▼
Access Token
      │
      ▼
verifyJWT Middleware
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

Example protected endpoint:

```http
POST /api/v1/user/change-password
```

The request passes through JWT verification before reaching the controller.

---

# 🔑 Password Security

User passwords are never stored as plain text.

Passwords are hashed using **bcrypt** before being stored in MongoDB.

```text
Plain Password
      │
      ▼
bcrypt
      │
      ▼
Hashed Password
      │
      ▼
MongoDB
```

During authentication:

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

# ☁️ File Upload Architecture

The project uses **Multer** for handling multipart/form-data uploads and **Cloudinary** for cloud media storage.

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
  ▼
Cloud Media URL
  │
  ▼
MongoDB
```

MongoDB stores the required media information/URLs while the actual media files are handled through cloud storage.

---

# 🗄️ MongoDB & Mongoose

MongoDB is used as the primary database and Mongoose is used as the ODM.

The project uses separate Mongoose models for different entities.

```text
User Model
    ↓
users collection

Video Model
    ↓
videos collection

Comment Model
    ↓
comments collection

Like Model
    ↓
likes collection

Subscription Model
    ↓
subscriptions collection
```

Relationships between entities are handled using MongoDB `ObjectId` references and Mongoose functionality such as `populate()`.

---

# 📊 Aggregation & Pagination

MongoDB aggregation pipelines are used when simple queries are not enough and the application needs to **filter, group, calculate, sort, join, or transform data**.

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
])
```

The project also uses:

```text
mongoose-aggregate-paginate-v2
```

for pagination with aggregation pipelines.

---

# 📡 RESTful API

The backend follows a RESTful API architecture.

### User APIs

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

Additional API routes are implemented for the platform's video, comment, like, and subscription functionality.

---

# 🧩 Middleware

Middleware is used to handle reusable functionality before requests reach controllers.

Examples include:

* JWT authentication middleware
* File upload middleware
* Request processing
* Error handling

Example protected route:

```js
router.route("/change-password").post(
    verifyJWT,
    changeCurrentPassword
)
```

The request first passes through `verifyJWT` and only then reaches the controller.

---

# 🛡️ Error Handling

The project uses custom utilities for consistent API responses and errors.

Example:

```js
throw new ApiError(
    400,
    "Invalid Old Password"
)
```

Successful responses are handled using a reusable API response structure:

```js
return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
```

This keeps API responses consistent across the application.

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

> Never commit your `.env` file or expose secret keys publicly.

## 5. Start Development Server

```bash
npm run dev
```

The project uses Nodemon for development and starts from:

```text
src/index.js
```

---

# 🧪 API Testing

APIs can be tested using:

* Postman
* Thunder Client
* Insomnia

For protected endpoints, provide a valid access token:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

For file uploads, use:

```text
Body → form-data
```

and provide the required file fields.

---

# 📚 Key Concepts Implemented

This project covers practical implementation of:

* Node.js
* Express.js
* RESTful APIs
* MongoDB
* Mongoose
* Schema & Models
* CRUD operations
* JWT
* Access Tokens
* Refresh Tokens
* bcrypt
* Authentication
* Authorization
* Middleware
* Async Error Handling
* Custom API Errors
* Custom API Responses
* MongoDB Aggregation
* Pagination
* MongoDB Relationships
* Mongoose `populate()`
* File Uploads
* Multer
* Cloudinary
* Cookies
* CORS
* Environment Variables
* API Testing

---

# 🎯 Project Objective

The main objective of this project is to understand how a **real-world backend application is designed and developed**.

Instead of building isolated APIs, this project focuses on connecting multiple backend concepts together:

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
User Interaction
```

The core backend functionality has been implemented, covering authentication, authorization, video management, social features, file uploads, cloud storage, database relationships, and RESTful APIs.

---

## 🚀 Optional Future Enhancements

The core backend functionality has been implemented. The following features can be added in future versions to further extend the platform:

* [ ] Video search and advanced filtering
* [ ] Personalized video recommendations
* [ ] Trending videos system
* [ ] Video categories and tagging
* [ ] Real-time notification system
* [ ] Email verification and account verification
* [ ] Forgot/reset password functionality
* [ ] API documentation with Swagger/OpenAPI
* [ ] Automated unit and integration testing
* [ ] API rate limiting and additional security
* [ ] Production deployment and CI/CD pipeline
* [ ] Advanced video analytics and creator insights

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
