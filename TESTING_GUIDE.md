# 🧪 Testing Guide - Patient Card Backend

## Quick Test Commands

### 1. Test Public QR Endpoint (No Auth)

```bash
# Test with any patient_id
curl http://127.0.0.1:8000/api/public/patient/UF0001/records

# Test with omar's patient_id
curl http://127.0.0.1:8000/api/public/patient/UF0021/records

# Test with invalid patient_id (should return 404)
curl http://127.0.0.1:8000/api/public/patient/UF9999/records
```

### 2. Test Login (Get Patient ID)

```bash
curl -X POST http://127.0.0.1:8000/api/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "omar@example.com",
    "password": "password123"
  }'
```

### 3. Test Profile Endpoint

```bash
# Replace {TOKEN} with actual token from login
curl http://127.0.0.1:8000/api/profile/my-profile \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🎯 Expected Responses

### ✅ Successful Public QR Response

```json
{
  "success": true,
  "patient": {
    "patient_id": "UF0021",
    "name": "Omar Adel",
    "gender": "Male",
    "blood_type": "ORh+",
    "age": 23,
    "city": "Mansoura"
  },
  "medical_info": {
    "allergies": "None",
    "chronic_diseases": [],
    "current_medications": [],
    "height": 174,
    "weight": 70.7
  },
  "appointments": [],
  "emergency_contact": "N/A"
}
```

### ✅ Successful Login Response

```json
{
  "message": "Patient logged in successfully",
  "user": {
    "id": 21,
    "patient_id": "UF0021",
    "first_name": "Omar",
    "last_name": "Adel",
    "email": "omar@example.com",
    "age": 23,
    "email_verified_at": "2026-02-16T..."
  },
  "token": "1|abc123..."
}
```

### ✅ Successful Profile Response

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 5,
    "user_id": 21,
    "patient_id": "UF0021",
    "name": "Omar Adel",
    "first_name": "Omar",
    "last_name": "Adel",
    "email": "omar@example.com",
    "date_of_birth": "2003-01-01",
    "age": 23,
    "city": "Mansoura",
    "gender": "Male",
    "height": 174,
    "weight": 70.7,
    "blood_group": "ORh+",
    "drug_allergies": null,
    "chronic_diseases": [],
    "one_time_medications": [],
    "long_term_medications": [],
    "past_surgeries": null,
    "emergency_contact": "+20 123 456 7890",
    "created_at": "2026-02-15T...",
    "updated_at": "2026-02-16T..."
  }
}
```

---

## ❌ Error Responses

### 404 - Patient Not Found

```json
{
  "success": false,
  "message": "Patient not found"
}
```

### 401 - Unauthorized

```json
{
  "message": "Unauthenticated."
}
```

### 403 - Email Not Verified

```json
{
  "message": "Please verify your email address..."
}
```

### 429 - Too Many Requests

```json
{
  "message": "Too Many Attempts."
}
```

---

## 🔍 Verify Database

### Check Patient IDs

```sql
-- See all patient IDs
SELECT id, patient_id, first_name, last_name, email 
FROM users 
WHERE type = 'patient' 
ORDER BY id;
```

### Check Profiles

```sql
-- See profiles with new fields
SELECT user_id, date_of_birth, city, gender, blood_group 
FROM profiles;
```

### Verify a Specific User

```sql
-- Check omar's data
SELECT u.id, u.patient_id, u.first_name, u.last_name, u.email,
       p.date_of_birth, p.city, p.gender, p.blood_group
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.patient_id = 'UF0021';
```

---

## 🧪 Postman Collection

### Import This Collection:

```json
{
  "info": {
    "name": "Patient Card API",
    "_postman_id": "patient-card-api",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"omar@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://127.0.0.1:8000/api/patient/login",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "patient", "login"]
        }
      }
    },
    {
      "name": "2. Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "http://127.0.0.1:8000/api/profile/my-profile",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "profile", "my-profile"]
        }
      }
    },
    {
      "name": "3. Public QR Records",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://127.0.0.1:8000/api/public/patient/UF0021/records",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "public", "patient", "UF0021", "records"]
        }
      }
    },
    {
      "name": "4. Update Profile",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"date_of_birth\": \"2003-01-01\",\n  \"city\": \"Mansoura\",\n  \"gender\": \"Male\",\n  \"height\": 174,\n  \"weight\": 70.7,\n  \"blood_group\": \"O+\",\n  \"emergency_contact\": \"+20 123 456 7890\"\n}"
        },
        "url": {
          "raw": "http://127.0.0.1:8000/api/profile/create-or-update",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "profile", "create-or-update"]
        }
      }
    }
  ]
}
```

---

## ✅ Checklist

Test each item and mark when done:

### Authentication
- [ ] Can login with valid credentials
- [ ] Login returns patient_id
- [ ] Login returns token
- [ ] Invalid credentials return 401

### Profile
- [ ] Profile endpoint requires auth
- [ ] Profile returns patient_id
- [ ] Profile returns age (calculated)
- [ ] Profile returns date_of_birth, city, gender
- [ ] Can update profile with new fields

### Public QR Endpoint
- [ ] Works without authentication
- [ ] Returns patient data
- [ ] Returns appointments
- [ ] Returns medical info
- [ ] Returns 404 for invalid patient_id
- [ ] Rate limiting works (20 req/min)

### Patient ID Generation
- [ ] New users get auto-generated patient_id
- [ ] Format is correct (UF0001, UF0021, etc.)
- [ ] All existing users have patient_ids
- [ ] Patient IDs are unique

---

## 🐛 Troubleshooting

### Issue: "Patient not found" for valid ID

**Check:**
```sql
SELECT patient_id FROM users WHERE patient_id = 'UF0021';
```

**Fix if missing:**
```sql
UPDATE users SET patient_id = 'UF0021' WHERE id = 21 AND type = 'patient';
```

### Issue: Age is null

**Check:**
```sql
SELECT date_of_birth FROM profiles WHERE user_id = 21;
```

**Fix:**
Update profile with date_of_birth via API or database.

### Issue: 401 Unauthorized

**Verify:**
- Token is valid
- Token is in Authorization header
- Format: `Bearer YOUR_TOKEN_HERE`

### Issue: 429 Too Many Requests

**Wait:** 1 minute (rate limit resets)

**Or increase limit in routes/api.php:**
```php
->middleware('throttle:50,1'); // 50 requests per minute
```

---

## 📊 Performance Test

### Test Rate Limiting

```bash
# Run this 25 times quickly
for i in {1..25}; do
  curl http://127.0.0.1:8000/api/public/patient/UF0001/records
  echo "Request $i"
done
```

Expected: First 20 succeed, rest return 429.

---

## ✅ All Tests Passed?

If all tests pass:
- ✅ Backend is ready
- ✅ Frontend can integrate
- ✅ QR codes will work
- ✅ Patient Card is functional

---

**Happy Testing! 🚀**
