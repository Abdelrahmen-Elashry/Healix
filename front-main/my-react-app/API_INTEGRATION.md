# API Integration Guide

## Laravel API Endpoints Setup

### 1. Register Endpoint
**URL:** `POST /api/register`

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "age": "integer",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "age": 25,
    "email": "john@example.com"
  },
  "token": "your-auth-token-here"
}
```

**Error Response (422):**
```json
{
  "message": "Validation errors",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

### 2. Login Endpoint
**URL:** `POST /api/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  },
  "token": "your-auth-token-here"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

## How to Connect

### Step 1: Update the API Base URL
In both `Register.js` and `SignIn.js`, find the commented API URLs and update them:

```javascript
// Replace this:
const response = await fetch('http://your-laravel-api.com/api/register', {
  // ...
});

// With your actual Laravel API URL:
const response = await fetch('http://localhost:8000/api/register', {
  // ...
});
```

### Step 2: Uncomment the API Code
Remove the `/*` and `*/` comments around the fetch code in:
- `Register.js` (line ~70)
- `SignIn.js` (line ~55)

### Step 3: Remove the Mock Response
Delete or comment out the temporary mock response code:
```javascript
// Remove these lines:
console.log('Form submitted:', formData);
alert('Registration successful! (API not connected yet)');
```

### Step 4: Handle CORS in Laravel
Make sure your Laravel API has CORS enabled. Add to `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Step 5: Laravel Routes Example
In your Laravel `routes/api.php`:

```php
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
```

---

## Using the Auth Token

After successful login, the token is stored in localStorage:

```javascript
// Accessing the token
const token = localStorage.getItem('token');

// Using the token in API requests
const response = await fetch('http://your-api.com/api/protected-route', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

## Environment Variables (Optional)

Create a `.env` file in `my-react-app/`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Then use it in your code:
```javascript
const API_URL = process.env.REACT_APP_API_URL;
const response = await fetch(`${API_URL}/register`, {
  // ...
});
```

---

## Testing

1. Start your Laravel API: `php artisan serve`
2. Start your React app: `npm start`
3. Navigate to `http://localhost:3000`
4. Test registration and login

---

## Notes

- All API calls are already wrapped in try-catch blocks for error handling
- Form validation is done on both frontend and backend
- Passwords are hashed in Laravel using bcrypt
- Remember to add Laravel Sanctum or Passport for API authentication
