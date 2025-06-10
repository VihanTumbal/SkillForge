# SkillForge Backend API

Backend API for SkillForge - Developer Skill Tracker & Learning Planner

## 🚀 Features

- **Authentication**: JWT-based user authentication and authorization
- **Skill Management**: CRUD operations for tracking technical skills
- **Learning Goals**: Create and manage learning objectives
- **AI Integration**: Gemini AI-powered learning recommendations
- **Analytics**: Comprehensive statistics and insights
- **Security**: Rate limiting, CORS, input validation, and security headers

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Google Gemini AI** for intelligent recommendations
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📦 Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/skillforge
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
```

5. Build the TypeScript project:

```bash
npm run build
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Skills

- `GET /api/skills` - Get all user skills
- `GET /api/skills/stats` - Get skill statistics
- `GET /api/skills/:id` - Get specific skill
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Learning Goals

- `GET /api/goals` - Get all user goals
- `GET /api/goals/stats` - Get goal statistics
- `GET /api/goals/:id` - Get specific goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `PATCH /api/goals/:id/toggle` - Toggle goal completion
- `DELETE /api/goals/:id` - Delete goal

### AI Recommendations

- `GET /api/ai/insights` - Get AI insights dashboard
- `GET /api/ai/learning-path` - Generate personalized learning path
- `GET /api/ai/skill-suggestions` - Get skill suggestions
- `POST /api/ai/skill-gaps` - Analyze skill gaps for target role
- `GET /api/ai/study-plan/:goalId` - Generate study plan for goal

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Data Models

### User

```typescript
{
  name: string;
  email: string;
  password: string(hashed);
  createdAt: Date;
  updatedAt: Date;
}
```

### Skill

```typescript
{
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Cloud' | 'AI/ML' | 'Testing' | 'Design' | 'Other'
  proficiency: number (1-10)
  description?: string
  userId: ObjectId
  lastUpdated: Date
  createdAt: Date
  updatedAt: Date
}
```

### Learning Goal

```typescript
{
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  priority: 'Low' | 'Medium' | 'High'
  targetDate?: Date
  completed: boolean
  completedAt?: Date
  userId: ObjectId
  skills: ObjectId[]
  createdAt: Date
  updatedAt: Date
}
```

## 🤖 AI Integration

The API integrates with Google's Gemini AI to provide:

- Personalized learning path recommendations
- Skill gap analysis for target roles
- Customized study plans for learning goals
- Intelligent skill suggestions

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers with Helmet
- Input validation and sanitization
- MongoDB injection protection

## 📝 Environment Variables

| Variable         | Description                          | Required           |
| ---------------- | ------------------------------------ | ------------------ |
| `NODE_ENV`       | Environment (development/production) | No                 |
| `PORT`           | Server port                          | No (default: 5000) |
| `MONGODB_URI`    | MongoDB connection string            | Yes                |
| `JWT_SECRET`     | JWT signing secret                   | Yes                |
| `JWT_EXPIRE`     | JWT expiration time                  | No (default: 7d)   |
| `FRONTEND_URL`   | Frontend URL for CORS                | No                 |
| `GEMINI_API_KEY` | Google Gemini AI API key             | Yes                |

## 🚨 Error Handling

The API includes comprehensive error handling:

- Validation errors return 400 with detailed messages
- Authentication errors return 401
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500 with error details (in development)

## 📈 Health Check

Check API health status:

```
GET /api/health
```

Response:

```json
{
  "status": "OK",
  "message": "SkillForge API is running",
  "timestamp": "2025-06-09T10:30:00.000Z"
}
```
