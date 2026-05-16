# Stage 1

## Get Notifications

### Endpoint

```http
GET /api/v1/notifications
```

### Response

```json
{
  "success": true,
  "count": 2,
  "notifications": [
    {
      "id": "n1",
      "title": "title1",
      "message": "message",
      "type": "p1",
      "isRead": false,
      "createdAt": "2026-05-16T10:00:00Z"
    }
  ]
}
```

---

## Create Notification

### Endpoint

```http
POST /api/v1/notifications
```

### Request Body

```json
{
  "title": "n1",
  "message": "message1",
  "type": "event"
}
```

### Response

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

---

## Mark Notification as Read

### Endpoint

```http
PUT /api/v1/notifications/:id/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Delete Notification

### Endpoint

```http
DELETE /api/v1/notifications/:id
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## Get Unread Notification Count

### Endpoint

```http
GET /api/v1/notifications/unread-count
```

### Response

```json
{
  "success": true,
  "unreadCount": 5
}
```

---

## Notification Schema

```json
{
  "id": "string",
  "title": "string",
  "message": "string",
  "type": "placement | event | exam | result | general",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# Stage 2

## Database Choice

MongoDB

---

## Notification Collection Schema

```json
{
  "_id": "ObjectId",
  "title": "string",
  "message": "string",
  "type": "string",
  "isRead": false,
  "userId": "string",
  "createdAt": "timestamp"
}
```

---

## Problems with Increasing Data Volume

- Slower notification retrieval
- Increased database load
- Delayed real-time notification delivery
- High storage usage
- Large unread notification calculations

---

## Solutions

- Add indexes on userId and createdAt
- Use pagination while fetching notifications
- Archive older notifications
- Cache unread notification counts
- Use WebSockets for real-time delivery
- Use database sharding for scaling

---

## Queries

### Create Notification

```js
db.notifications.insertOne({
  title: "n1",
  message: "message1",
  type: "event",
  isRead: false,
  userId: "u1",
  createdAt: new Date(),
});
```

---

### Get Notifications

```js
db.notifications
  .find({
    userId: "u1",
  })
  .sort({
    createdAt: -1,
  })
  .limit(10);
```

---

### Mark Notification as Read

```js
db.notifications.updateOne(
  {
    _id: ObjectId("n1"),
  },
  {
    $set: {
      isRead: true,
    },
  },
);
```

---

### Delete Notification

```js
db.notifications.deleteOne({
  _id: ObjectId("n1"),
});
```

---

### Get Unread Notification Count

```js
db.notifications.countDocuments({
  userId: "u1",
  isRead: false,
});
```

# Stage 3

## Existing Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

---

## Is the Query Accurate?

Yes, the query correctly fetches unread notifications of a student ordered by creation time.

---

## Why is the Query Slow?

- The notifications table contains millions of records
- Full table scans may occur without indexes
- Sorting using ORDER BY on large datasets is expensive
- SELECT \* fetches unnecessary columns
- Increasing notification volume increases query execution time

---

## Improvements

Use indexing on frequently searched columns.

Optimized query:

```sql
SELECT id, title, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

---

## Recommended Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

---

## Likely Computation Cost

Without indexes:

- Time Complexity: O(n)

With indexes:

- Time Complexity: O(log n)

---

## Should Indexes be Added on Every Column?

No.

Adding indexes on every column is inefficient because:

- Indexes increase storage usage
- Insert and update operations become slower
- Many indexes may never be used
- Database maintenance overhead increases

Indexes should only be added on:

- Frequently searched columns
- Sorting columns
- Join columns

---

## Query to Find Students Who Received Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

# Stage 4

## Solution

Fetching notifications from the database on every page load increases database load and slows down the application as the number of users grows. To improve performance, caching, pagination and real-time updates can be used.

---

## Improvements

### 1. Redis Caching

Recent notifications and unread counts can be stored in Redis.

Flow:

- Check cache first
- If cache data exists, return it
- Otherwise fetch from database and update cache

Advantages:

- Faster response time
- Fewer database queries

Disadvantages:

- Extra setup required
- Cache data must be updated properly

---

### 2. Pagination

Instead of loading all notifications, fetch smaller batches.

Example:

```http
GET /api/v1/notifications?page=1&limit=20
```

Advantages:

- Faster queries
- Reduced server load

Disadvantages:

- Multiple requests needed for more data

---

### 3. WebSockets

Use WebSockets to send notifications instantly to connected users instead of repeatedly calling APIs.

Advantages:

- Real-time updates
- Reduces repeated API requests

Disadvantages:

- More complex than normal APIs
- More server memory usage

---

### 4. Lazy Loading

Load notifications only when the notifications section is opened.

Advantages:

- Faster initial page load
- Fewer unnecessary API calls

Disadvantages:

- Small delay when opening notifications

---

### 5. Database Indexing

Indexes can be added on:

- userId
- isRead
- createdAt

Advantages:

- Faster search and sorting

Disadvantages:

- Extra storage required
- Slower insert operations

---

### 6. Archiving Old Notifications

Old notifications can be moved to a separate archive collection/table.

Advantages:

- Faster access to recent notifications
- Reduced active database size

Disadvantages:

- Archived notifications take longer to access

---

## Final Approach

- Use Redis for caching
- Use WebSockets for real-time updates
- Use pagination while fetching notifications
- Use lazy loading in frontend
- Add indexes on frequently queried fields
