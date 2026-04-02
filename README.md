# Banking API with Redis Rate Limiting

A proof-of-concept Banking API built with Node.js, Express, and MongoDB, featuring a robust Redis-backed rate limiting system for enhanced security and performance.

## 🚀 Features

- **Authentication & Authorization**: Secure user registration, login, and token-based access using JWT.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for regular users and administrative actions.
- **Redis Rate Limiting**: Advanced rate limiting middleware using `rate-limiter-flexible` and Redis to prevent brute-force attacks and API abuse.
- **Logging**: Comprehensive structured logging using Winston.
- **Database**: Persistent storage with MongoDB using Mongoose.
- **Error Handling**: Standardized error responses with custom middleware.

## 🛠️ Tech Stack

- **Core**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Cache / Rate Limiting**: Redis
- **Security**: JWT (jsonwebtoken), Argon2 (password hashing)
- **Logging**: Winston
- **Environment**: dotenv

## ⚙️ Prerequisites

- Node.js (v20+ recommended)
- MongoDB instance
- Redis instance

## 🔧 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # OR
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following variables (see `.env.example` for reference):
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   LOG_LEVEL=info
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_EXPIRES_IN=5m
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password
   REDIS_USERNAME=default
   ```

4. **Run the application:**
   *   **Development mode:** `pnpm dev`
   *   **Production mode:** `pnpm start`

## 🛡️ Rate Limiting Implementation

The application uses Redis-backed rate limiting to ensure reliability and scalability across multiple server instances.

- **Granular Control**: Different limits apply to different endpoints:
  - `POST /users/register`: 5 requests per minute
  - `POST /users/login`: 5 requests per minute
  - `GET /users/me`: 100 requests per minute
- **Headers**: Each response includes rate limit metadata:
  - `X-RateLimit-Limit`: Total points allowed
  - `X-RateLimit-Remaining`: Remaining points in current window
  - `X-RateLimit-Reset`: Time when the limit will reset

## 🛣️ API Routes

### Authentication (`/users`)
- `POST /register`: Register a new user
- `POST /login`: Login and receive JWT tokens
- `POST /refresh`: Refresh access token
- `POST /logout`: Invalidate session
- `GET /me`: Get current user profile (requires Auth)
- `GET /admin`: Admin protected route (requires Admin role)

## 📁 Project Structure

```text
├── config/             # Database, Redis, and Logger configuration
├── controllers/        # Route controllers
├── middleware/         # Custom Express middleware (Auth, Error, Rate Limiter)
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── utils/              # Helper functions
├── index.js            # Entry point
└── .env.example        # Environment template
```

## 📄 License

MIT
