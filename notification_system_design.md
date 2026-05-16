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
