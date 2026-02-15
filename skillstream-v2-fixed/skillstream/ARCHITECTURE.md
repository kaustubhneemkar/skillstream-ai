# SkillStream - Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SKILLSTREAM PLATFORM                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │   Auth       │  │  Dashboard   │      │
│  │   Page       │  │   Pages      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Asset      │  │   Learning   │  │   Admin      │      │
│  │   Catalog    │  │   Module     │  │   Panel      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌────────────────────────────────────────────────┐         │
│  │          API Service Layer (axios)              │         │
│  │  - Auth  - Assets  - Employees  - Paths        │         │
│  └────────────────────────────────────────────────┘         │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST API
                            │ JSON
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────┐         │
│  │               API Routes Layer                  │         │
│  │  /auth  /assets  /employees  /learning-paths   │         │
│  │  /admin                                         │         │
│  └────────────────────────────────────────────────┘         │
│                            │                                  │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────┐         │
│  │           Middleware Layer                      │         │
│  │  - JWT Authentication                           │         │
│  │  - Admin Authorization                          │         │
│  │  - Error Handling                               │         │
│  └────────────────────────────────────────────────┘         │
│                            │                                  │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────┐         │
│  │          Business Logic Layer                   │         │
│  │                                                 │         │
│  │  ┌──────────────────────────────────┐          │         │
│  │  │   Adaptive Learning Engine        │          │         │
│  │  │  - Path Generation Algorithm      │          │         │
│  │  │  - Scoring & Ranking              │          │         │
│  │  │  - Real-Time Adaptation           │          │         │
│  │  │  - Performance Analytics          │          │         │
│  │  └──────────────────────────────────┘          │         │
│  │                                                 │         │
│  └────────────────────────────────────────────────┘         │
│                            │                                  │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────┐         │
│  │          Data Access Layer                      │         │
│  │  - In-Memory Database (Map-based)              │         │
│  │  - Users, Employees, Assets                     │         │
│  │  - Learning Paths, Progress, Scores            │         │
│  └────────────────────────────────────────────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### User
```javascript
{
  id: UUID,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  role: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Employee
```javascript
{
  id: UUID,
  userId: UUID (FK),
  name: String,
  email: String,
  role: String,
  department: String,
  skillLevel: Enum ['Beginner', 'Intermediate', 'Advanced'],
  learningPreference: Enum ['Visual', 'Text', 'Hands-on'],
  background: Array<String>,
  strengths: Array<String>,
  gaps: Array<String>,
  preferredFormats: Array<String>,
  completionRate: Float (0-1),
  averageScore: Number,
  totalHoursSpent: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Asset
```javascript
{
  id: UUID,
  title: String,
  description: Text,
  category: Enum ['Cloud', 'AI', 'DevOps', 'Cybersecurity'],
  difficulty: Enum ['Beginner', 'Intermediate', 'Advanced'],
  format: Enum ['Video', 'Text', 'Interactive'],
  duration: Number (minutes),
  url: String,
  thumbnail: String (URL),
  tags: Array<String>,
  prerequisites: Array<String> (asset titles),
  createdAt: Date,
  updatedAt: Date
}
```

### LearningPath
```javascript
{
  id: UUID,
  employeeId: UUID (FK),
  category: String,
  modules: Array<Asset>,
  totalModules: Number,
  totalDuration: Number (minutes),
  estimatedWeeks: Number,
  difficulty: Enum ['Beginner', 'Intermediate', 'Advanced'],
  status: Enum ['active', 'completed', 'paused'],
  adaptations: Array<Adaptation>,
  createdAt: Date,
  lastAdapted: Date
}
```

### Progress
```javascript
{
  employeeId: UUID,
  assetId: UUID,
  percentComplete: Number (0-100),
  timeSpent: Number (minutes),
  lastUpdated: Date
}
```

### Score
```javascript
{
  id: UUID,
  employeeId: UUID,
  assetId: UUID,
  score: Number,
  maxScore: Number,
  timeTaken: Number (minutes),
  timestamp: Date
}
```

## Adaptive Learning Algorithm

### 1. Initial Path Generation

**Input:**
- Employee profile (skill level, preferences, background)
- Target category (e.g., "Cloud")

**Process:**
1. Fetch all assets in target category
2. Score each asset based on employee fit
3. Sort assets by score (descending)
4. Build sequence respecting prerequisites
5. Smooth difficulty progression

**Scoring Formula:**
```
Asset Score = 
  (Format Match Score × 0.30) +
  (Difficulty Match Score × 0.40) +
  (Background Match Score × 0.20) +
  (Gap Coverage Score × 0.10)

Where:
- Format Match: 30 points if preferred format
- Difficulty Match: 
  * Beginner: Beginner=40, Intermediate=20, Advanced=5
  * Intermediate: Beginner=15, Intermediate=40, Advanced=25
  * Advanced: Beginner=5, Intermediate=20, Advanced=40
- Background Match: 20 points if tags align with background
- Gap Coverage: 10 points if asset addresses identified gaps
```

### 2. Real-Time Adaptation

**Triggers:**
- After every 5 completed modules
- Manual adaptation request
- Admin intervention

**Adaptation Logic:**

```javascript
if (averageScore < 70) {
  // Struggling - add support
  actions: [
    'Add beginner-level prerequisites',
    'Insert easier alternative modules',
    'Switch to preferred learning format',
    'Add remedial content for struggling topics'
  ]
}

if (averageScore > 85) {
  // Excelling - accelerate
  actions: [
    'Remove beginner modules',
    'Skip redundant intermediate content',
    'Add advanced challenge modules',
    'Introduce related advanced topics'
  ]
}

if (completionSpeed > 1.5x expected) {
  // Fast learner - expand
  actions: [
    'Add supplementary content',
    'Introduce adjacent skill areas',
    'Recommend advanced certifications'
  ]
}
```

### 3. Performance Analytics

**Metrics Calculated:**
- Average score (all-time and recent)
- Completion rate (%)
- Time per module
- Strength topics (avg score > 80)
- Weakness topics (avg score < 70)
- Learning velocity (modules per week)

## Security Features

### Authentication
- JWT token-based authentication
- bcrypt password hashing (10 rounds)
- 24-hour token expiration
- Secure HTTP-only approach (production ready)

### Authorization
- Role-based access control (RBAC)
- Admin-only endpoints protected
- Employee data isolation
- API endpoint protection

### Data Protection
- Password never returned in API responses
- Token validation on every request
- Input sanitization
- Error message sanitization (no stack traces in production)

## Performance Optimizations

### Backend
- In-memory data storage (fast reads/writes)
- Efficient Map-based data structures
- Minimal database queries (future: connection pooling)
- Async/await for non-blocking operations

### Frontend
- React lazy loading for code splitting
- Memoized components
- Optimized re-renders
- Image optimization
- CSS animations over JS animations

## Scalability Considerations

### Current Implementation (Demo)
- In-memory storage: Fast but limited to single server
- Suitable for: Demos, POCs, small teams (<100 users)

### Production Migration Path

1. **Database Layer:**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Add connection pooling
   - Implement caching (Redis)

2. **API Layer:**
   - Add rate limiting
   - Implement pagination
   - Add GraphQL for flexible queries

3. **Frontend:**
   - CDN for static assets
   - Server-side rendering (Next.js)
   - Progressive Web App (PWA)

4. **Infrastructure:**
   - Load balancing (multiple API servers)
   - Kubernetes for container orchestration
   - Monitoring (DataDog, New Relic)
   - Logging (ELK stack)

## Technology Stack

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js 4.x
- **Authentication:** jsonwebtoken, bcryptjs
- **Data:** In-memory Maps (production: PostgreSQL/MongoDB)

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Styling:** Custom CSS (CSS Variables)

### Development
- **Package Manager:** npm
- **Code Style:** ESLint (React app default)
- **Version Control:** Git

## API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-02-15T05:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "timestamp": "2024-02-15T05:00:00.000Z"
}
```

### Pagination (Future)
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Testing Strategy (Future Enhancement)

### Backend Tests
- Unit tests: Jest
- API tests: Supertest
- Coverage: >80%

### Frontend Tests
- Component tests: React Testing Library
- E2E tests: Cypress
- Accessibility: axe-core

## Deployment Architecture (Production)

```
                    ┌──────────────┐
                    │   Cloudflare │
                    │      CDN      │
                    └───────┬──────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼──────┐        ┌──────▼──────┐
        │   Frontend    │        │   Backend   │
        │   (Vercel/    │        │   (Heroku/  │
        │   Netlify)    │        │   AWS)      │
        └───────────────┘        └──────┬──────┘
                                        │
                                 ┌──────▼──────┐
                                 │  PostgreSQL │
                                 │   Database  │
                                 └─────────────┘
```

## Monitoring & Observability (Future)

- **APM:** DataDog / New Relic
- **Logging:** Winston + ELK Stack
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics / Mixpanel
- **Uptime:** Pingdom / UptimeRobot

---

**For implementation details, see the codebase in backend/ and frontend/ directories.**
