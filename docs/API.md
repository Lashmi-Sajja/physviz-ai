# API Documentation

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Parse Physics Problem

**Endpoint:** `/api/parse`

**Method:** `POST`

**Description:** Accepts a physics word problem and returns structured parameters for visualization.

**Request Body:**
```json
{
  "problem": "A ball is thrown straight up with a speed of 10 m/s"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scenario": "vertical_projectile",
    "object": "ball",
    "initial_velocity": 10,
    "angle": 90,
    "gravity": 9.8,
    "initial_height": 0
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Unable to parse problem statement"
}
```

### 2. Health Check

**Endpoint:** `/api/health`

**Method:** `GET`

**Description:** Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Supported Scenarios

### 1. Vertical Projectile
**Keywords:** thrown up, thrown upward, vertical, straight up

**Parameters:**
- `initial_velocity`: Speed in m/s
- `angle`: 90 degrees
- `gravity`: 9.8 m/s²
- `initial_height`: Starting height in meters

### 2. Projectile Motion
**Keywords:** thrown at angle, launched, projectile

**Parameters:**
- `initial_velocity`: Speed in m/s
- `angle`: Launch angle in degrees
- `gravity`: 9.8 m/s²
- `initial_height`: Starting height in meters

### 3. Free Fall
**Keywords:** dropped, falls, free fall

**Parameters:**
- `initial_velocity`: 0 m/s
- `gravity`: 9.8 m/s²
- `initial_height`: Starting height in meters

### 4. Horizontal Motion
**Keywords:** horizontal, slides, moves horizontally

**Parameters:**
- `initial_velocity`: Speed in m/s
- `friction`: Coefficient (if applicable)

## Example Requests

### cURL
```bash
curl -X POST http://localhost:5000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"problem": "A ball is thrown straight up with a speed of 10 m/s"}'
```

### JavaScript (Fetch)
```javascript
fetch('http://localhost:5000/api/parse', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    problem: 'A ball is thrown straight up with a speed of 10 m/s'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Python (Requests)
```python
import requests

response = requests.post(
    'http://localhost:5000/api/parse',
    json={'problem': 'A ball is thrown straight up with a speed of 10 m/s'}
)
print(response.json())
```

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Invalid input |
| 500  | Internal Server Error - API or processing error |

## Rate Limiting
No rate limiting for hackathon prototype.
