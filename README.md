# TaskFlow — MERN Stack Task Management App

A production-ready, full-stack Task Management application built with the **MERN Stack** (MongoDB, Express.js, React 19, Node.js). Features JWT authentication, full CRUD for tasks, search/filter, priority management, and a polished dark UI.

---

## 📸 Features

- **Authentication** — Register & Login with JWT, bcrypt password hashing
- **Task CRUD** — Create, Read, Update, Delete tasks
- **Status Toggle** — Mark tasks pending ↔ completed
- **Priority Levels** — Low, Medium, High with visual indicators
- **Search** — Debounced search across title & description
- **Filter** — Filter tasks by status (All / Pending / Completed)
- **Stats Dashboard** — Live counts for total, pending, and completed tasks
- **Protected Routes** — Auth-guarded pages via React Context
- **Toast Notifications** — Success & error feedback
- **Responsive** — Mobile-first layout with Tailwind CSS
- **Dark UI** — Professional dark theme

---

## 🗂 Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, GetMe
│   │   └── taskController.js      # CRUD + toggle status
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   └── validateMiddleware.js  # express-validator handler
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password)
│   │   └── Task.js                # Task schema (title, desc, status, priority, userId)
│   ├── routes/
│   │   ├── authRoutes.js          # POST /register, POST /login, GET /me
│   │   └── taskRoutes.js          # GET|POST /, PUT|DELETE /:id, PATCH /:id/status
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   └── StatsCard.jsx
    │   │   └── tasks/
    │   │       ├── TaskCard.jsx
    │   │       ├── TaskModal.jsx
    │   │       ├── DeleteConfirmModal.jsx
    │   │       ├── TaskFilters.jsx
    │   │       └── EmptyState.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state, login, register, logout
    │   ├── hooks/
    │   │   └── useTasks.js        # Task state management hook
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   ├── api.js             # Axios instance + interceptors
    │   │   ├── authService.js     # Auth API calls
    │   │   └── taskService.js     # Task API calls
    │   ├── App.jsx                # Router + protected routes
    │   ├── main.jsx               # Entry point
    │   └── index.css              # Tailwind + custom classes
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB Atlas account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev     # with nodemon (development)
# or
npm start       # production
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Visit **http://localhost:5173**

---

## 🌐 API Reference

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login and get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

### Task Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | ✅ | Get all tasks (supports `?status=&search=`) |
| POST | `/api/tasks` | ✅ | Create a new task |
| PUT | `/api/tasks/:id` | ✅ | Update a task |
| DELETE | `/api/tasks/:id` | ✅ | Delete a task |
| PATCH | `/api/tasks/:id/status` | ✅ | Toggle task status |

### Request/Response Examples

**POST /api/auth/register**
```json
// Request
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }

// Response 201
{ "success": true, "token": "eyJ...", "user": { "id": "...", "name": "John Doe", "email": "john@example.com" } }
```

**POST /api/tasks**
```json
// Request (with Authorization: Bearer <token>)
{ "title": "Design homepage", "description": "Create wireframes", "priority": "high" }

// Response 201
{ "success": true, "task": { "_id": "...", "title": "Design homepage", "status": "pending", ... } }
```

---

## ☁️ Deployment Guide

### Step 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Create a database user (username + strong password)
3. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all — for Render)
4. Get connection string: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/taskflow`

---

### Step 2 — Deploy Backend to Render

1. Push your project to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=<your Atlas connection string>
   JWT_SECRET=<random 64-char string>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Deploy → Copy your Render URL (e.g. `https://taskflow-api.onrender.com`)

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   ```
   VITE_API_URL=https://taskflow-api.onrender.com/api
   ```
4. Deploy → Visit your live app!

---

### Step 4 — Update CORS

After deploying both, update the backend `FRONTEND_URL` env var on Render to your Vercel URL, then redeploy.

---

## 🔐 Security Highlights

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens expire in 7 days
- All task routes verify ownership via `userId`
- Input validation on all endpoints via `express-validator`
- Rate limiting ready (add `express-rate-limit` for production)
- CORS restricted to frontend origin

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router DOM v6 |
| State | React Context API, Custom Hooks |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | express-validator |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Hosting | Vercel (FE) + Render (BE) + MongoDB Atlas (DB) |

---

## 📝 License

MIT — free to use, modify, and distribute.

---

Built with ❤️ using the MERN Stack.
