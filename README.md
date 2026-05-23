# User CRUD Operation API

A secure, production-ready REST API for user management with authentication using TypeScript, Express.js, and PostgreSQL.

## 📋 Project Description

This is a complete CRUD (Create, Read, Update, Delete) application built with modern technologies. It provides:

- **User Management**: Full CRUD operations for users
- **Authentication**: User registration and JWT-based login
- **User Profiles**: Profile management linked to users
- **Security**: Password hashing with bcryptjs, password removal from responses
- **Logging**: Request logging to file
- **Database**: PostgreSQL with automatic table initialization

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm or yarn
- PostgreSQL database

### Installation

```bash
# Clone or navigate to project
cd user-crud-operation

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/crud_db
# PORT=5000
# JWT_SECRET=your_secret_key_here

# Start development server
npm run dev
```

Server runs on `http://localhost:5000` by default.

---

## 📦 Packages Installed

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework for REST API |
| `pg` | ^8.20.0 | PostgreSQL database driver |
| `bcryptjs` | ^3.0.3 | Password hashing & encryption |
| `jsonwebtoken` | ^9.0.3 | JWT token generation & verification |
| `dotenv` | ^17.4.2 | Load environment variables |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `cookie-parser` | ^1.4.6 | Parse HTTP request cookies |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^6.0.3 | TypeScript compiler |
| `tsx` | ^4.22.1 | TypeScript file executor |
| `@types/express` | ^5.0.6 | Express type definitions |
| `@types/pg` | ^8.20.0 | PostgreSQL type definitions |
| `@types/jsonwebtoken` | ^9.0.10 | JWT type definitions |
| `@types/cors` | ^2.8.17 | CORS type definitions |

### Installation Command
```bash
npm install express pg bcryptjs jsonwebtoken dotenv cors cookie-parser
npm install -D typescript tsx @types/express @types/pg @types/jsonwebtoken @types/cors
```

---

## 📁 File Structure

```
user-crud-operation/
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server entry point
│   │
│   ├── config/
│   │   └── index.ts                # Environment configuration
│   │
│   ├── db/
│   │   └── index.ts                # PostgreSQL pool & initialization
│   │
│   ├── types/
│   │   └── index.ts                # Global TypeScript types & role definitions
│   │
│   ├── utility/
│   │   └── sendResponse.ts         # Standardized API response utility
│   │
│   └── modules/
│       ├── user/
│       │   ├── user.controller.ts  # Request handlers
│       │   ├── user.service.ts     # Business logic
│       │   ├── user.interface.ts   # TypeScript interfaces
│       │   └── user.route.ts       # Route definitions
│       │
│       ├── auth/
│       │   ├── auth.controller.ts  # Auth request handlers
│       │   ├── auth.service.ts     # Auth business logic
│       │   ├── auth.interface.ts   # Auth interfaces
│       │   └── auth.route.ts       # Auth routes
│       │
│       ├── profile/
│       │   ├── profile.controller.ts
│       │   ├── profile.service.ts
│       │   ├── profile.interface.ts
│       │   └── profile.route.ts
│       │
│       └── middleware/
│           ├── auth.ts             # JWT authentication & RBAC middleware
│           ├── globalErrorHandler.ts # Global error handling
│           ├── logger.ts           # Request logging middleware
│           └── index.d.ts          # Middleware type definitions
│
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Project dependencies
├── .env                            # Environment variables (create locally)
├── .env.example                    # Environment template
├── README.md                       # This file
└── logger.txt                      # Request logs (auto-generated)
```

---

## 🛠️ Implementation Details

### 1. **Configuration** (`src/config/index.ts`)
- Loads environment variables using `dotenv`
- Exports database connection string, port, and JWT secret
- Uses `process.cwd()` for absolute paths

```typescript
const config = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  secretKey: process.env.JWT_SECRET,
};
```

### 2. **Types & Role Definitions** (`src/types/index.ts`)
- Global TypeScript types for the application
- Role-based access control (RBAC) definitions

```typescript
export const USER_ROLE = {
  admin: "admin",
  user: "user",
  agent: "agent",
} as const;

export type ROLES = "admin" | "user" | "agent";
```

### 3. **Utility Functions** (`src/utility/sendResponse.ts`)
- Standardized API response format
- Generic type support for consistent responses

```typescript
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error,
  });
};
```

### 4. **Middleware** (`src/modules/middleware/`)

#### **Authentication Middleware** (`auth.ts`)
- JWT token verification
- Role-based access control (RBAC)
- User validation and activation check
- Supports role-based route protection

```typescript
const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Verify JWT token
    // 2. Get user from database
    // 3. Check if user is active
    // 4. Verify user role (if required)
    // 5. Pass user to next middleware
  };
};

// Usage: router.get("/admin", auth("admin"), controllerFn)
```

#### **Global Error Handler** (`globalErrorHandler.ts`)
- Centralized error handling for all routes
- Logs errors to console
- Returns consistent error response format

```typescript
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
```

#### **Logger Middleware** (`logger.ts`)
- Logs all incoming requests
- Writes to `logger.txt` file
- Records timestamp, HTTP method, and URL

```typescript
const logger = (req: Request, res: Response, next: NextFunction) => {
  const logPath = path.join(process.cwd(), "logger.txt");
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  fs.appendFile(logPath, log + "\n", (err) => {
    if (err) console.error("Failed to write to log file:", err);
  });
  next();
};
```

### 5. **Database Setup** (`src/db/index.ts`)
- Creates PostgreSQL connection pool
- Auto-initializes two tables on startup:
  - **users**: id, name, email, password, age, is_active, created_at, updated_at
  - **profiles**: id, user_id, bio, address, phone, gender, created_at, updated_at
- Handles cascading deletes (profiles deleted when user is deleted)

### 6. **Express App** (`src/app.ts`)
- Middleware setup with proper order:
  1. JSON/URL-encoded parsing
  2. CORS configuration
  3. Request logging
  4. Cookie parsing (for refresh tokens)
  5. Routes
  6. Global error handler
- CORS enabled for frontend communication (configurable origin)
- Cookie middleware for HTTP-only cookie handling
- Routes mounted:
  - `/api/users` - User CRUD operations
  - `/api/auth` - Authentication (register/login/refresh-token)
  - `/api/profile` - User profiles

**CORS Configuration**
```typescript
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL (update as needed)
  optionsSuccessStatus: 200,
  credentials: true // Allow cookies in cross-origin requests
};

app.use(cors(corsOptions));
```

**Middleware Order**
```typescript
app.use(express.json());                      // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cors(corsOptions));                   // CORS
app.use(logger);                              // Log requests
app.use(CookieParser());                      // Parse cookies
app.use("/api/users", userRoute);             // User routes
app.use("/api/profile", profileRoute);        // Profile routes
app.use("/api/auth", authRoute);              // Auth routes
app.use(globalErrorHandler);                  // Error handling
```

### 7. **User Module** (`src/modules/user/`)
**Controller**: Handles HTTP requests and responses
```typescript
- createUser(POST)
- getAllUsers(GET)
- getSingleUser(GET /:id)
- updateUser(PUT /:id)
- deleteUser(DELETE /:id)
```

**Service**: Contains business logic
```typescript
- Password hashing with bcrypt (12 salt rounds)
- Password removal from all responses
- Database operations with prepared statements
- Error handling
```

**Interface**: Type safety
```typescript
interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  is_active?: boolean;
}
```

### 8. **Auth Module** (`src/modules/auth/`)

#### **Token System**
The application uses a **dual-token system** for enhanced security:

**Access Token (Short-lived)**
- Expiration: 1 day
- Stored in: Response body
- Usage: Sent in Authorization header for protected routes
- Purpose: Grants temporary access to API resources

**Refresh Token (Long-lived)**
- Expiration: 7 days
- Stored in: HTTP-only cookie (secure & inaccessible to JavaScript)
- Usage: Used to generate new access tokens
- Purpose: Allows user to stay logged in without re-entering credentials

#### **Registration (`POST /api/auth/register`)**
- Validates email uniqueness
- Hashes password with bcryptjs (12 salt rounds)
- Creates user in database
- Generates both access and refresh tokens
- Stores refresh token in HTTP-only cookie
- Returns JWT token + user data (password excluded)

```json
Response {
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  },
  "Set-Cookie": "refreshToken=eyJhbGciOiJIUzI1NiIs...; HttpOnly; SameSite=lax"
}
```

#### **Login (`POST /api/auth/login`)**
- Finds user by email
- Compares password with bcrypt
- Generates both access and refresh tokens
- Stores refresh token in HTTP-only cookie
- Returns tokens without password

```json
Response {
  "success": true,
  "message": "Login successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### **Refresh Token (`POST /api/auth/refresh-token`)**
- Retrieves refresh token from HTTP-only cookie
- Verifies token signature
- Fetches user from database
- Checks if user is still active
- Generates new access token
- Returns new access token

```json
Request: {
  "Cookie": "refreshToken=eyJhbGciOiJIUzI1NiIs..."
}

Response: {
  "success": true,
  "message": "Access token generated successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### **JWT Payload** (in both tokens)
```typescript
{
  id: number,
  name: string,
  email: string,
  role: string,
  is_active: boolean
}
```

#### **Cookie Security Settings**
```typescript
res.cookie("refreshToken", refreshToken, {
  secure: false,        // Set to true in production (HTTPS only)
  httpOnly: true,       // Prevents JavaScript access (XSS protection)
  sameSite: "lax",      // CSRF protection (adjust based on needs)
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

---

## 🔐 Security Features

✅ **Password Security**
- Passwords hashed with bcryptjs (12 salt rounds)
- One-way encryption (cannot be reversed)
- Hashed password stored in database

✅ **API Response Security**
- Passwords completely removed from all API responses
- Custom `omitPassword()` function removes password field from user objects
- Applied to all endpoints: create, read, update, delete

✅ **Authentication & Authorization**
- JWT tokens with 1-day expiration
- Email validation prevents duplicate registration
- Password comparison using bcrypt.compare()
- **Role-Based Access Control (RBAC)**: Three roles (admin, user, agent)
- Protected routes require valid JWT token
- User activation status check (inactive users cannot access protected routes)

✅ **Error Handling**
- Global error handler middleware catches all application errors
- Centralized error logging
- Consistent error response format

✅ **Database Security**
- Parameterized queries prevent SQL injection
- User emails must be unique (database constraint)
- Cascading delete prevents orphaned records

✅ **Logging & Monitoring**
- Request logging middleware tracks all API calls
- Logs include timestamp, HTTP method, and URL
- Writes to `logger.txt` for audit trails

---

## 📡 API Endpoints

### User Management
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|-----------|
| POST | `/api/users` | Create new user | Public |
| GET | `/api/users` | Get all users | JWT + Admin |
| GET | `/api/users/:id` | Get user by ID | JWT |
| PUT | `/api/users/:id` | Update user | JWT + Owner/Admin |
| DELETE | `/api/users/:id` | Delete user | JWT + Admin |

### Authentication
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user & get tokens | Public |
| POST | `/api/auth/refresh-token` | Generate new access token | Refresh Token Cookie |

### Profiles
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|-----------|
| POST | `/api/profile` | Create user profile | JWT |
| GET | `/api/profile/:id` | Get profile | JWT |
| PUT | `/api/profile/:id` | Update profile | JWT + Owner/Admin |
| DELETE | `/api/profile/:id` | Delete profile | JWT + Admin |

### Role-Based Access Control
- **admin**: Full access to all resources, can manage other users
- **user**: Standard user access, can manage own profile
- **agent**: Limited access, for service agents

### Usage with Authentication Middleware
```typescript
// Public route
router.post("/register", authController.registerUser);

// Protected route (any authenticated user)
router.get("/", auth(), userController.getAllUsers);

// Role-restricted route (admin only)
router.delete("/:id", auth("admin"), userController.deleteUser);

// Role-restricted route (admin or agent)
router.put("/:id", auth("admin", "agent"), userController.updateUser);
```

---

## 🔑 Token Management & Flow

### Complete Token Lifecycle

```
1. User Registers/Logs In
        ↓
2. Server generates Access Token (1d) + Refresh Token (7d)
        ↓
3. Access Token → Response body (for API requests)
4. Refresh Token → HTTP-only Cookie (for token refresh)
        ↓
5. Client uses Access Token in Authorization header
        ↓
6. After 1 day (Access Token expires)
        ↓
7. Client calls /refresh-token endpoint
        ↓
8. Server validates Refresh Token from cookie
        ↓
9. Server returns new Access Token
        ↓
10. Client continues using API with new token
```

### How to Use Tokens

#### **1. Login and Get Tokens**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt
```

Response includes:
- `accessToken` in body (use immediately)
- `refreshToken` in HTTP-only cookie (stored automatically if using browser/cookies)

#### **2. Use Access Token for Protected Routes**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **3. Refresh Access Token (After Expiry)**
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -b cookies.txt
```

Response:
```json
{
  "success": true,
  "message": "Access token generated successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Token Security Best Practices

✅ **Access Token**
- Keep short-lived (1 day)
- Store in memory or response body
- Include in every API request

✅ **Refresh Token**
- Keep long-lived (7+ days)
- Store in HTTP-only cookie (not localStorage)
- Never expose to JavaScript
- Only used to refresh access token

✅ **Prevention Mechanisms**
- **XSS Protection**: HTTP-only cookies prevent JavaScript theft
- **CSRF Protection**: SameSite=lax prevents cross-site requests
- **Token Rotation**: New access token on each refresh
- **User Verification**: Check user is still active on refresh

---

### How to Use the Auth Middleware

The `auth` middleware protects routes and enforces role-based access control:

```typescript
import auth from "../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

// Public route (no auth required)
router.post("/register", userController.createUser);

// Protected route (any authenticated user)
router.get("/", auth(), userController.getAllUsers);

// Role-restricted (admin only)
router.delete("/:id", auth("admin"), userController.deleteUser);

// Role-restricted (admin or agent)
router.put("/:id", auth("admin", "agent"), userController.updateUser);

export const userRoute = router;
```

### How Auth Middleware Works

1. **Token Extraction**: Gets JWT from `Authorization` header
2. **Token Verification**: Verifies JWT signature using secret key
3. **User Lookup**: Fetches user from database by email
4. **Activation Check**: Ensures user is active (`is_active = true`)
5. **Role Check**: Verifies user has required role(s) (if specified)
6. **User Assignment**: Attaches user data to `req.user` for next handler

### Example Protected Request

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response Format

All API responses follow a standardized format:

**Success Response (200)**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...]
}
```

**Error Response (400/401/403/500)**
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

---

## ⚠️ Error Handling

The application uses a **global error handler middleware** to manage all errors:

1. **Catches all errors** from route handlers and middleware
2. **Logs error stack** to console for debugging
3. **Returns consistent error response** with status code and message
4. **Prevents server crash** by gracefully handling exceptions

### Error Types & HTTP Status Codes
| Status | Meaning |
|--------|---------|
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

---

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "is_active": true
    }
  }
}
```

### Login User
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)** - Includes both tokens
```json
{
  "success": true,
  "message": "Login successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0..."
  }
}
```

**Cookies Set Automatically:**
```
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; SameSite=lax
```

### Refresh Access Token
```bash
POST /api/auth/refresh-token

# Refresh token is sent automatically in cookies if using browser
# Or include the cookie header if using curl
```

**Response (201)** - New access token
```json
{
  "success": true,
  "message": "Access token generated successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0..."
  }
}
```

### Get All Users (Protected - Requires Access Token)
```bash
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200)** - ✅ No passwords returned
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "is_active": true,
      "created_at": "2026-05-22T10:47:33.338Z",
      "updated_at": "2026-05-22T10:47:33.338Z"
    }
  ]
}
```

---

## 🚀 Running the Project

```bash
# Development mode (with live reload)
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

---

## 📋 Environment Variables (.env)

Create `.env` file in project root:

```env
# Database
CONNECTION_STRING=postgresql://user:password@localhost:5432/crud_db

# Server
PORT=5000

# JWT Access Token (short-lived)
JWT_SECRET=your_access_token_secret_key_here_change_in_production
ACCESS_TOKEN_EXPIRY=1d

# JWT Refresh Token (long-lived)
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here_change_in_production
REFRESH_TOKEN_EXPIRY=7d
```

**Security Tips:**
- Use **different secrets** for access and refresh tokens
- Generate strong random secrets (min 32 characters)
- Never commit `.env` file to Git
- Use environment-specific secrets in production

---

## 🔧 TypeScript Configuration

- **Strict Mode**: `true` (strict type checking)
- **Target**: ESNext (modern JavaScript)
- **Module**: ESNext
- **Source Maps**: Enabled for debugging
- **Isolated Modules**: For better compilation

---

## 📚 Technologies Used

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Runtime**: Node.js

---

## 🎯 Current Features & Status

### ✅ Implemented
- [x] User CRUD operations
- [x] User authentication (register/login)
- [x] **Dual-token system** (Access + Refresh tokens)
- [x] **Token refresh endpoint** to generate new access tokens
- [x] **HTTP-only cookies** for secure token storage
- [x] Role-Based Access Control (RBAC)
- [x] JWT token generation & verification
- [x] Password hashing with bcryptjs
- [x] Password removal from responses
- [x] Database integration with PostgreSQL
- [x] Global error handling middleware
- [x] Request logging middleware
- [x] Standardized API response format
- [x] User activation status check
- [x] Cookie security (HttpOnly, SameSite, Secure flags)

### 🔄 Future Enhancements
- [ ] Add logout endpoint (token blacklist/revocation)
- [ ] Implement email verification on registration
- [ ] Add password reset functionality
- [ ] Add API rate limiting
- [ ] Add request validation middleware
- [ ] Write unit tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement database migrations
- [ ] Add caching layer (Redis)
- [ ] Add two-factor authentication (2FA)
- [ ] Add profile image upload capability
- [ ] Implement soft delete for users
- [ ] Add token blacklist for logout

---

## 📄 License

ISC

---

## 👤 Author

Hasnath Ahmed Tamim

---

## 📞 Support

For issues or questions, please create an issue in the repository.
