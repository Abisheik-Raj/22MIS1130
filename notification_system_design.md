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
