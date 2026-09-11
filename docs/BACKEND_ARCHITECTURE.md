# 24/7Box / Netafrica Backend Architecture Contract

## Purpose

The Node.js backend is the primary business-logic and application-data authority for 24/7Box. Firebase Authentication proves the identity of the main account owner. MySQL stores application data. Cloudinary stores media files.

```text
Firebase Authentication
        |
        | Firebase ID token
        v
React / Vite
        |
        | Authorization: Bearer <id-token>
        v
Node.js + Express
        |
        +--> Firebase Admin: verify token
        |
        +--> MySQL / Sequelize: application data
        |
        +--> Cloudinary: signed media upload / delivery
```

Do not duplicate password authentication in MySQL. Do not store movie/poster binaries in MySQL.

## Recommended backend structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── firebaseAdmin.js
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── modules/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── content/
│   │   ├── genres/
│   │   ├── library/
│   │   ├── playback/
│   │   ├── search/
│   │   ├── recommendations/
│   │   └── admin/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── package.json
```

Each module should use controller -> service -> repository -> model separation.

## Authentication

Every private request from React includes:

```http
Authorization: Bearer <firebase-id-token>
```

Middleware verifies:

```js
const decoded = await admin.auth().verifyIdToken(token);
req.auth = {
  firebaseUid: decoded.uid,
  email: decoded.email,
};
```

Then resolve the application user from `users.firebase_uid`.

## Roles

Main application user roles:

- USER
- ADMIN
- SUPER_ADMIN

Subprofiles are **not** Firebase users. They belong to one account.

## MySQL tables

### users

- id
- firebase_uid UNIQUE
- email
- display_name
- role
- subscription_status
- status
- created_at
- updated_at

### profiles

- id
- user_id FK
- name
- avatar_url
- age_group
- is_kids
- preferred_language
- subtitle_language
- maturity_level
- autoplay_next_episode
- autoplay_previews
- created_at
- updated_at

Server-side rule: maximum 4 profiles per account.

### content

Shared movie/series metadata:

- id
- type: MOVIE | SERIES
- title
- slug UNIQUE
- description
- release_year
- release_date
- maturity_rating
- runtime_minutes
- poster_url
- backdrop_url
- logo_url
- trailer_url
- quality
- status: DRAFT | PUBLISHED | ARCHIVED
- is_featured
- trending_score
- created_at
- updated_at

### genres / content_genres

Many-to-many genre relationship.

### series / seasons / episodes

Series-specific hierarchy.

### my_list

- id
- profile_id
- content_id
- created_at
- UNIQUE(profile_id, content_id)

### likes

- id
- profile_id
- content_id
- rating: LIKE | DISLIKE
- created_at
- UNIQUE(profile_id, content_id)

### playback_progress

- id
- profile_id
- content_id
- episode_id nullable
- position_seconds
- duration_seconds
- percentage
- updated_at

### watch_history

- id
- profile_id
- content_id
- episode_id nullable
- watched_at
- completed

### search_history

- id
- profile_id
- query
- searched_at

### notifications

- id
- user_id / profile_id
- title
- body
- read_at
- created_at

### admin_activity_logs

Record content publication, edits, deletes and important administrative actions.

## Maturity filtering

Never send restricted content to a profile and then hide it in React.

Recommended mapping:

- KIDS_7 -> content rating <= 7
- TEEN_13 -> <= 13
- TEEN_16 -> <= 16
- 18_PLUS -> <= 18

All catalog, search, recommendation and home-feed queries must apply this server-side.

## API contract expected by frontend

### Account / profile

```http
GET    /api/me
GET    /api/profiles
POST   /api/profiles
PATCH  /api/profiles/:profileId
DELETE /api/profiles/:profileId
```

### Personalized discovery

```http
GET /api/profiles/:profileId/home
```

Example:

```json
{
  "success": true,
  "data": {
    "featured": {
      "id": 17,
      "slug": "midnight-protocol",
      "type": "MOVIE",
      "title": "Midnight Protocol",
      "description": "...",
      "year": 2026,
      "maturityRating": 16,
      "runtimeLabel": "2h 08m",
      "quality": "4K",
      "genres": ["Sci-Fi", "Thriller"],
      "matchScore": 98,
      "posterUrl": "https://res.cloudinary.com/...",
      "backdropUrl": "https://res.cloudinary.com/...",
      "logoUrl": "",
      "inMyList": true
    },
    "rows": [
      {
        "id": "continue-watching",
        "title": "Continue Watching for Patrick",
        "variant": "continue",
        "items": []
      },
      {
        "id": "recommended",
        "title": "Recommended for You",
        "variant": "standard",
        "items": []
      },
      {
        "id": "top-ten",
        "title": "Top 10 on 24/7Box Today",
        "variant": "top10",
        "items": []
      }
    ]
  }
}
```

### Catalog

```http
GET /api/content/movies?profileId=
GET /api/content/series?profileId=
GET /api/content/:slug?profileId=
GET /api/search?q=&profileId=
```

### Library and engagement

```http
GET    /api/profiles/:profileId/library
POST   /api/profiles/:profileId/my-list/:contentId
DELETE /api/profiles/:profileId/my-list/:contentId
POST   /api/profiles/:profileId/likes/:contentId
PUT    /api/profiles/:profileId/progress/:contentId
GET    /api/profiles/:profileId/continue-watching
```

The frontend expects all successful endpoints to use:

```json
{
  "success": true,
  "data": {}
}
```

Errors should use:

```json
{
  "success": false,
  "message": "Readable error",
  "code": "OPTIONAL_MACHINE_CODE"
}
```

## Simple recommendation v1

Start deterministic before using ML:

```text
score =
  preferredGenreMatch * 4
  + likedGenreSimilarity * 3
  + trendingScore * 2
  + recencyScore * 1
```

Exclude:
- content above maturity level
- archived/unpublished content
- titles explicitly disliked when appropriate

Use watch completion, My List and searches later.

## Admin CMS

Admin features:

- Dashboard
- Movies
- Series
- Seasons
- Episodes
- Genres
- Featured content
- Media library
- Users
- Notifications
- Analytics
- Activity logs

Admin API:

```http
GET    /api/admin/dashboard
GET    /api/admin/users

POST   /api/admin/content
PATCH  /api/admin/content/:id
DELETE /api/admin/content/:id

POST   /api/admin/series
POST   /api/admin/seasons
POST   /api/admin/episodes
POST   /api/admin/genres
```

Protect with:

```text
authenticate
-> authorize("ADMIN", "SUPER_ADMIN")
-> validate
-> controller
```

## Cloudinary

Frontend profile avatars may use an unsigned upload preset during development.

Admin content uploads should use signed uploads:

```text
Admin UI
-> request upload signature from Node
-> Node signs request with Cloudinary secret
-> browser uploads directly to Cloudinary
-> secure_url/public_id returned
-> save metadata in MySQL
```

Never put `CLOUDINARY_API_SECRET` in Vite.

Store `secure_url` and `public_id` in MySQL, not image binaries.

## Frontend switch-over

The included frontend patch currently defaults to demo/current Firebase profile storage:

```env
VITE_USE_BACKEND=false
```

When these endpoints are implemented and tested:

```env
VITE_USE_BACKEND=true
VITE_API_URL=http://localhost:5000/api
```

The UI components do not need to be rewritten because the demo payload intentionally mirrors this API contract.
