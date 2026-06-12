# API Contracts

## Twin CRUD

### Create Twin
**POST** `/api/v1/twins/`
**Request:**
```json
{
  "item": {
    "sku": "string",
    "title": "string",
    "category": "electronics",
    "original_price": 2000,
    "purchase_date": "2026-06-10T00:00:00Z",
    "image_url": "string"
  },
  "customer": {
    "customer_id": "string",
    "pincode": "711101",
    "name": "string"
  }
}
```
**Response:** Full Twin object with `state=ACTIVE`.

### Get Twin
**GET** `/api/v1/twins/{twin_id}`
**Response:** Full Twin object.

### Update Twin State
**PATCH** `/api/v1/twins/{twin_id}/state`
**Request:**
```json
{
  "state": "RETURN_INTENT"
}
```
**Response:** Updated Twin object.

### List Twins
**GET** `/api/v1/twins/`
**Query Parameters:**
- `state` (optional)
- `category` (optional)
- `page` (default: 1)
- `limit` (default: 20)
**Response:** Array of Twin objects.

---

## Prevention

### Check Risk
**POST** `/api/v1/prevention/check-risk`
**Request:**
```json
{
  "items": [
    {
      "sku": "string",
      "category": "fashion",
      "size": "M",
      "quantity": 1
    }
  ],
  "customer_id": "string"
}
```
**Response:**
```json
{
  "risk_score": 0.87,
  "risk_factors": ["size_bracketing", "high_return_category"],
  "nudge_type": "size_suggestion",
  "nudge_message": "string"
}
```

---

## Grading (Member A)

### Grade Item
**POST** `/api/v1/grading/grade`
**Request:** `multipart/form-data` with `twin_id` and list of `photos`
**Response:**
```json
{
  "twin_id": "uuid",
  "grading": { /* grading object */ },
  "valuation": { /* valuation object */ }
}
```

---

## Routing (Member A)

### Route Item
**POST** `/api/v1/routing/route`
**Request:**
```json
{
  "twin_id": "uuid"
}
```
**Response:**
```json
{
  "twin_id": "uuid",
  "routing": { /* routing object */ },
  "credits": { /* credits object */ }
}
```

---

## Marketplace (Member A)

### List Items
**GET** `/api/v1/marketplace/listings`
**Query Parameters:** `category`, `grade`, `page`, `limit`
**Response:**
```json
{
  "listings": [],
  "total": 50,
  "page": 1
}
```

### Get Listing
**GET** `/api/v1/marketplace/listings/{twin_id}`
**Response:** Full Twin object.

### Create Listing
**POST** `/api/v1/marketplace/list`
**Request:**
```json
{
  "twin_id": "uuid"
}
```
**Response:** Updated Twin object with `state=LISTED`.

### Buy Item
**POST** `/api/v1/marketplace/buy`
**Request:**
```json
{
  "twin_id": "uuid",
  "buyer_id": "uuid"
}
```
**Response:** Updated Twin object with `state=SOLD`.

---

## Credits

### Get Customer Credits
**GET** `/api/v1/credits/{customer_id}`
**Response:**
```json
{
  "customer_id": "uuid",
  "total_credits": 350,
  "history": []
}
```

---

## Dashboard

### Get Stats
**GET** `/api/v1/dashboard/stats`
**Response:**
```json
{
  "total_twins": 150,
  "returns_prevented": 23,
  "total_cost_saved": 48500,
  "total_co2_saved_kg": 187.5,
  "items_by_state": {},
  "items_by_route": {}
}
```

### Get Recent Twins
**GET** `/api/v1/dashboard/recent-twins?limit=10`
**Response:**
```json
{
  "twins": []
}
```

---

## Standard Error Format
```json
{
  "error": {
    "code": "TWIN_NOT_FOUND",
    "message": "Twin xyz not found"
  }
}
```
