# Profile API Documentation

## Base URL
```
http://127.0.0.1:8000/api/profile
```

**Note:** All profile endpoints require:
- `Authorization: Bearer {token}` header
- Verified email address

---

## Endpoints

### 1. Get My Profile

**Endpoint:** `GET /api/profile/my-profile`

**Headers:**
```
Authorization: Bearer your-token
Accept: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "height": 168.5,
    "weight": 62.5,
    "blood_group": "O+",
    "drug_allergies": "penicillin, sulfa",
    "chronic_diseases": ["diabetes", "hypertension"],
    "one_time_medications": [
      {"name": "Paracetamol", "dosage": "500mg"}
    ],
    "long_term_medications": [
      {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily"}
    ],
    "past_surgeries": "appendectomy 2018",
    "emergency_contact": "John Doe - 01234567890",
    "created_at": "2026-02-15 14:30:00",
    "updated_at": "2026-02-15 14:30:00"
  }
}
```

**Response (404) - No Profile:**
```json
{
  "success": false,
  "message": "Profile not found. Please complete your profile."
}
```

---

### 2. Create or Update Profile

**Endpoint:** `POST /api/profile/create-or-update`

**Headers:**
```
Authorization: Bearer your-token
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "height": 168.5,
  "weight": 62.5,
  "blood_group": "O+",
  "drug_allergies": "penicillin, sulfa",
  "chronic_diseases": ["diabetes", "hypertension"],
  "one_time_medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg"
    }
  ],
  "long_term_medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "twice daily"
    }
  ],
  "past_surgeries": "appendectomy 2018",
  "emergency_contact": "John Doe - 01234567890"
}
```

**Validation Rules:**
- `height`: required | numeric | min:50 | max:300
- `weight`: required | numeric | min:20 | max:500
- `blood_group`: required | in: O+, O-, A+, A-, B+, B-, AB+, AB-
- `drug_allergies`: optional | string | max:1000
- `chronic_diseases`: optional | array of strings
- `one_time_medications`: optional | array of objects {name, dosage}
- `long_term_medications`: optional | array of objects {name, dosage, frequency}
- `past_surgeries`: optional | string | max:2000
- `emergency_contact`: required | string | max:255

**Response (201) - Created:**
```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": { ... }
}
```

**Response (200) - Updated:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "height": ["The height field is required."],
    "blood_group": ["The blood_group must be one of O+, O-, A+, A-, B+, B-, AB+, AB-"]
  }
}
```

---

### 3. Check Profile Status

**Endpoint:** `GET /api/profile/check`

**Headers:**
```
Authorization: Bearer your-token
Accept: application/json
```

**Response (200):**
```json
{
  "success": true,
  "has_profile": true,
  "message": "Profile completed"
}
```

or

```json
{
  "success": true,
  "has_profile": false,
  "message": "Profile not completed"
}
```

---

## Example Flow

### 1. After Login - Check Profile
```bash
GET /api/profile/check
→ has_profile: false
```

### 2. Complete Profile
```bash
POST /api/profile/create-or-update
{
  "height": 168.5,
  "weight": 62.5,
  "blood_group": "O+",
  "emergency_contact": "John Doe - 01234567890"
}
→ 201 Created
```

### 3. View Profile
```bash
GET /api/profile/my-profile
→ 200 OK with profile data
```

### 4. Update Profile
```bash
POST /api/profile/create-or-update
{
  "height": 170,
  "weight": 65,
  ...
}
→ 200 Updated
```

---

## Notes

1. **Authentication Required:** All endpoints require valid Bearer token
2. **Email Verification:** User must verify email before accessing profile
3. **Create or Update:** Same endpoint handles both create and update
4. **JSON Arrays:** chronic_diseases, medications are stored as JSON
5. **Nullable Fields:** drug_allergies, chronic_diseases, medications, past_surgeries are optional

---

## Testing with Postman

### Step 1: Login
```
POST /api/patient/login
{
  "email": "patient@example.com",
  "password": "password123"
}
```
Copy the `token` from response.

### Step 2: Check Profile
```
GET /api/profile/check
Headers: Authorization: Bearer {token}
```

### Step 3: Create Profile
```
POST /api/profile/create-or-update
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json
Body: { ... profile data ... }
```

### Step 4: Get Profile
```
GET /api/profile/my-profile
Headers: Authorization: Bearer {token}
```
