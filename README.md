<div align="center">

# 🏥 Healix - Healthcare Management System

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**A comprehensive healthcare management system for patient records, appointments, and medical history tracking.**

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Testing](#-testing-with-postman) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Testing with Postman](#-testing-with-postman)
- [Running Tests](#-running-tests)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Project Structure](#-project-structure)
- [Development Workflow](#️-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support--contact)

---

## 📋 Overview

**Healx** is a modern, secure, and scalable healthcare management platform built with **Laravel 12** and **React.js**. It streamlines patient management, appointment scheduling, medical records tracking, and provides digital health card capabilities.

### 🎯 Key Highlights

- ✅ **RESTful API** with complete authentication system
- ✅ **Digital Patient Health Cards** with unique IDs
- ✅ **Comprehensive Medical History** tracking
- ✅ **Real-time Email Notifications**
- ✅ **Secure File Attachments** for medical reports
- ✅ **Role-based Access Control**
- ✅ **Fully Tested** with Pest PHP

---

## ✨ Features

### 🔐 Authentication & Security

- **Patient Authentication** with Laravel Sanctum
- **Email Verification** system
- **Password Reset** functionality via email
- **Unique Patient ID** generation (HLX-YYYY-XXX)
- **Secure API** with token-based authentication
- **Rate Limiting** to prevent abuse

### 👤 Patient Management

- Complete patient profiles with blood type tracking
- Medical history management
- Personal information management
- Profile photo upload support
- Emergency contact information

### 📅 Appointment System

- Comprehensive appointment records
- Doctor information tracking
- Disease diagnosis storage
- Medication prescriptions with dosage
- Medical attachment support (PDF reports, X-rays, etc.)
- Appointment history timeline
- Chronological ordering

### 🏥 Medical Records

- Detailed diagnosis records
- Medication tracking with dosage information
- Medical examination place tracking
- Digital document attachments
- Complete medical history
- Export capabilities

### 📊 Dashboard

- Patient overview and statistics
- Recent appointments
- Upcoming visits
- Medical summary cards
- Quick access to records

---

## 🚀 Technology Stack

| Category | Technology |
|----------|------------|
| **Backend Framework** | Laravel 12.x |
| **PHP Version** | 8.2+ |
| **Authentication** | Laravel Sanctum |
| **Testing Framework** | Pest PHP |
| **Frontend** | React.js 18+ |
| **Database** | MySQL 8.0 / PostgreSQL |
| **Queue System** | Laravel Queue Workers |
| **Build Tool** | Vite |
| **API Architecture** | RESTful API |

---

## 📦 Installation

### Prerequisites

- PHP 8.2 or higher
- Composer 2.x
- MySQL 8.0 or PostgreSQL
- Node.js 18+ & NPM

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/ziadsaad24/healix.git
cd Healx
```

#### 2. Install PHP Dependencies

```bash
composer install
```

#### 3. Install NPM Dependencies

```bash
npm install
```

#### 4. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

#### 5. Configure Database

Edit `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=healx
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### 6. Configure Mail Settings (for email verification)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@healx.com
MAIL_FROM_NAME="Healx Healthcare"
```

#### 7. Run Migrations & Seeders

```bash
php artisan migrate --seed
```

This will create:
- Database tables
- Blood type reference data
- Test users with appointments

#### 8. Generate Patient IDs

```bash
php generate_patient_ids.php
```

#### 9. Start Development Server

```bash
php artisan serve
```

Server will start at: `http://localhost:8000`

#### 10. Start Queue Worker (for email notifications)

```bash
# Windows
START_QUEUE_WORKER.bat

# Linux/Mac
php artisan queue:work
```

#### 11. Build Frontend Assets (optional)

```bash
npm run dev    # Development
npm run build  # Production
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:8000/api
```

### 📡 Authentication Endpoints

#### 1. Register New Patient

```http
POST /api/patient/register
Content-Type: application/json

{
  "first_name": "Mohamed",
  "last_name": "Ahmed",
  "age": 28,
  "email": "mohamed@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Success Response (201):**

```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "user": {
    "id": 1,
    "first_name": "Mohamed",
    "last_name": "Ahmed",
    "email": "mohamed@example.com",
    "patient_id": "HLX-2026-001",
    "type": "patient",
    "email_verified_at": null
  }
}
```

#### 2. Login

```http
POST /api/patient/login
Content-Type: application/json

{
  "email": "mohamed@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "first_name": "Mohamed",
    "last_name": "Ahmed",
    "email": "mohamed@example.com",
    "patient_id": "HLX-2026-001"
  },
  "token": "1|abc123def456ghi789...",
  "has_profile": true
}
```

#### 3. Get Patient Profile

```http
GET /api/patient/profile
Authorization: Bearer {your_token_here}
Accept: application/json
```

**Success Response (200):**

```json
{
  "id": 1,
  "first_name": "Mohamed",
  "last_name": "Ahmed",
  "age": 28,
  "email": "mohamed@example.com",
  "patient_id": "HLX-2026-001",
  "type": "patient",
  "email_verified_at": "2026-02-20T10:30:00.000000Z"
}
```

#### 4. Forgot Password

```http
POST /api/patient/forgot-password
Content-Type: application/json

{
  "email": "mohamed@example.com"
}
```

#### 5. Reset Password

```http
POST /api/patient/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "email": "mohamed@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

#### 6. Logout

```http
POST /api/patient/auth/logout
Authorization: Bearer {your_token_here}
```

---

### 👤 Profile Management Endpoints

#### 1. Get My Profile

```http
GET /api/profile/my-profile
Authorization: Bearer {your_token_here}
Accept: application/json
```

**Success Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "blood_type_id": 1,
  "address": "123 Main Street, Cairo",
  "phone": "+201234567890",
  "emergency_contact": "+201098765432",
  "medical_history": "No known allergies",
  "current_medications": "None",
  "blood_type": {
    "id": 1,
    "type": "A+"
  }
}
```

#### 2. Create or Update Profile

```http
POST /api/profile/create-or-update
Authorization: Bearer {your_token_here}
Content-Type: application/json

{
  "blood_type_id": 1,
  "address": "123 Main Street, Cairo, Egypt",
  "phone": "+201234567890",
  "emergency_contact": "+201098765432",
  "medical_history": "No known allergies. History of hypertension.",
  "current_medications": "Concor 5mg daily"
}
```

#### 3. Check Profile Status

```http
GET /api/profile/check
Authorization: Bearer {your_token_here}
```

**Response:**

```json
{
  "has_profile": true
}
```

---

### 📅 Appointment Endpoints

#### 1. Get All Appointments

```http
GET /api/appointments
Authorization: Bearer {your_token_here}
Accept: application/json
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "doctor_name": "Dr. Ahmed Mahmoud",
    "doctor_specialty": "Internal Medicine",
    "appointment_date": "2025-11-25",
    "disease_name": "Hypertension",
    "diagnosis": "Slightly elevated blood pressure, requires lifestyle modifications",
    "examination_place": "Nile Medical Clinic",
    "medications": [
      {
        "name": "Concor 5mg",
        "dosage": "One tablet daily",
        "duration": "30 days"
      },
      {
        "name": "Aspirin 100mg",
        "dosage": "One tablet evening",
        "duration": "30 days"
      }
    ],
    "attachments": [
      {
        "name": "blood_pressure_report.pdf",
        "url": "/storage/attachments/file1.pdf"
      }
    ],
    "created_at": "2026-02-15T12:00:00.000000Z"
  }
]
```

#### 2. Create New Appointment

```http
POST /api/appointments
Authorization: Bearer {your_token_here}
Content-Type: application/json

{
  "doctor_name": "Dr. Sarah Hassan",
  "doctor_specialty": "Cardiology",
  "appointment_date": "2026-02-25",
  "disease_name": "Heart Checkup",
  "diagnosis": "Routine cardiac examination. All results within normal limits.",
  "examination_place": "Cairo Medical Center",
  "medications": [
    {
      "name": "Aspirin 100mg",
      "dosage": "One tablet daily",
      "duration": "30 days"
    }
  ],
  "attachments": []
}
```

#### 3. Get Single Appointment

```http
GET /api/appointments/{id}
Authorization: Bearer {your_token_here}
```

#### 4. Get Public Patient Records (No Auth Required)

```http
GET /api/public/patient/{patient_id}/records

Example: 
GET /api/public/patient/HLX-2026-001/records
```

This endpoint allows public access to patient medical records using their unique Patient ID.

---

## 🧪 Testing with Postman

### Step 1: Setup Postman Environment

Create a new environment in Postman with these variables:

| Variable Name | Initial Value | Current Value |
|---------------|---------------|---------------|
| `base_url` | `http://localhost:8000/api` | `http://localhost:8000/api` |
| `token` | *(leave empty)* | *(auto-filled after login)* |
| `patient_id` | *(leave empty)* | *(auto-filled after login)* |

### Step 2: Auto-Save Token After Login

In your **Login** request, go to the **Tests** tab and add:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("patient_id", jsonData.user.patient_id);
    console.log("✅ Token saved:", jsonData.token);
    console.log("✅ Patient ID saved:", jsonData.user.patient_id);
}
```

### Step 3: Use Token in Headers

For all authenticated requests, add this header:

```
Authorization: Bearer {{token}}
Accept: application/json
```

### Step 4: Sample Testing Workflow

Follow this order for a complete test:

```
1. ✅ POST /patient/register
   → Creates new patient account
   
2. ✅ Check your email for verification link
   → Click the link to verify email
   
3. ✅ POST /patient/login
   → Returns token (auto-saved)
   
4. ✅ GET /patient/profile
   → Tests authentication
   
5. ✅ POST /profile/create-or-update
   → Creates patient profile
   
6. ✅ GET /profile/my-profile
   → Retrieves profile data
   
7. ✅ GET /appointments
   → Lists all appointments
   
8. ✅ POST /appointments
   → Creates new appointment
   
9. ✅ GET /appointments/{id}
   → Gets specific appointment
   
10. ✅ GET /public/patient/{{patient_id}}/records
    → Public access to records
    
11. ✅ POST /patient/auth/logout
    → Destroys token
```

### Sample Request Collection

#### Request 1: Register

```
POST {{base_url}}/patient/register
Content-Type: application/json

{
  "first_name": "Test",
  "last_name": "User",
  "age": 30,
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Request 2: Login

```
POST {{base_url}}/patient/login
Content-Type: application/json

{
  "email": "mohamed.verified@healx.com",
  "password": "password123"
}
```

#### Request 3: Get Profile

```
GET {{base_url}}/patient/profile
Authorization: Bearer {{token}}
Accept: application/json
```

#### Request 4: Get Appointments

```
GET {{base_url}}/appointments
Authorization: Bearer {{token}}
Accept: application/json
```

### Expected Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200` | Success |
| `201` | Resource Created |
| `401` | Unauthorized (invalid/missing token) |
| `403` | Forbidden (email not verified) |
| `404` | Resource Not Found |
| `422` | Validation Error |
| `500` | Server Error |

---

## 🧪 Running Tests

This project uses **Pest PHP** for testing.

### Run All Tests

```bash
php artisan test
```

### Run Specific Test Suite

```bash
# Patient Authentication Tests
php artisan test --filter=PatientAuthTest

# Appointment Tests
php artisan test --filter=AppointmentTest

# Profile Tests
php artisan test --filter=ProfileTest
```

### Run Tests with Coverage

```bash
php artisan test --coverage
```

### Run Tests in Parallel

```bash
php artisan test --parallel
```

### Available Test Suites

- ✅ Patient Registration & Login
- ✅ Email Verification Flow
- ✅ Password Reset Flow
- ✅ Profile Management (CRUD)
- ✅ Appointment CRUD Operations
- ✅ API Authentication & Authorization
- ✅ Input Validation

**See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing documentation.**

---

## 📊 Database Schema

### Main Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | Patient accounts | id, first_name, last_name, email, password, patient_id, email_verified_at |
| `profiles` | Extended patient information | id, user_id, blood_type_id, address, phone, emergency_contact |
| `appointments` | Medical appointments | id, user_id, doctor_name, appointment_date, diagnosis, medications |
| `blood_types` | Blood type reference | id, type (A+, A-, B+, B-, O+, O-, AB+, AB-) |
| `personal_access_tokens` | Sanctum API tokens | id, tokenable_id, token, abilities |

### Entity Relationships

```
users (1) ←→ (1) profiles
users (1) ←→ (n) appointments
profiles (n) ←→ (1) blood_types
users (1) ←→ (n) personal_access_tokens
```

---

## 🔒 Security Features

### Implemented Security Measures

- 🔐 **Laravel Sanctum** - Token-based API authentication
- 📧 **Email Verification** - Mandatory email confirmation
- 🔑 **Password Reset** - Secure password recovery via email
- 🛡️ **CSRF Protection** - Cross-site request forgery protection
- 🚦 **Rate Limiting** - API throttling (60 requests/minute)
- 💉 **SQL Injection Protection** - Eloquent ORM with prepared statements
- 🔒 **Password Hashing** - Bcrypt password encryption
- 🔓 **CORS Configuration** - Controlled cross-origin access
- 📝 **Input Validation** - Comprehensive request validation
- 🚫 **XSS Protection** - Output escaping by default

**See [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md) for detailed security information.**

---

## 📁 Project Structure

```
Healx/
├── 📱 app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AppointmentController.php
│   │   │   ├── PatientController.php
│   │   │   └── ProfileController.php
│   │   ├── Middleware/
│   │   │   └── EnsureEmailVerified.php
│   │   └── Resources/
│   │       └── AppointmentResource.php
│   ├── Models/
│   │   ├── Appointment.php
│   │   ├── BloodType.php
│   │   ├── Profile.php
│   │   └── User.php
│   ├── Notifications/
│   │   ├── PatientEmailVerification.php
│   │   └── PatientResetPasswordNotification.php
│   └── Providers/
│       └── AppServiceProvider.php
│
├── 🗄️ database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_profiles_table.php
│   │   ├── create_appointments_table.php
│   │   ├── create_blood_types_table.php
│   │   └── add_patient_id_to_users_table.php
│   └── seeders/
│       ├── AppointmentSeeder.php
│       └── BloodTableSeeder.php
│
├── 🛣️ routes/
│   ├── api.php              # API Routes
│   ├── web.php              # Web Routes
│   └── console.php          # Console Routes
│
├── 🧪 tests/
│   ├── Feature/
│   │   ├── PatientAuthTest.php
│   │   ├── AppointmentTest.php
│   │   └── ProfileTest.php
│   ├── Unit/
│   └── Pest.php
│
├── 📚 Documentation/
│   ├── PATIENT_AUTH_API.md
│   ├── PROFILE_API.md
│   ├── DASHBOARD_API_INTEGRATION.md
│   ├── TESTING_GUIDE.md
│   ├── SECURITY_IMPROVEMENTS.md
│   └── QUICK_START.md
│
├── public/
│   ├── index.php
│   └── storage/            # Symlink to storage/app/public
│
└── 🔧 Configuration
    ├── .env.example
    ├── composer.json
    ├── package.json
    ├── phpunit.xml
    └── vite.config.js
```

---

## 🛠️ Development Workflow

### Local Development Commands

#### Start Development Server

```bash
php artisan serve
# Server: http://localhost:8000
```

#### Start Queue Worker (for emails)

```bash
# Windows
START_QUEUE_WORKER.bat

# Linux/Mac
php artisan queue:work

# With restart on failure
php artisan queue:work --tries=3
```

#### Watch Frontend Assets

```bash
npm run dev
```

#### Run Tests in Watch Mode

```bash
php artisan test --parallel
```

### Common Artisan Commands

```bash
# Clear all caches
php artisan optimize:clear

# Run migrations fresh with seeding
php artisan migrate:fresh --seed

# Generate specific seed data
php artisan db:seed --class=AppointmentSeeder

# Create new controller
php artisan make:controller API/NewController --api

# Create new model with migration
php artisan make:model NewModel -m

# Create new test
php artisan make:test NewFeatureTest --pest

# Run code formatting (Laravel Pint)
./vendor/bin/pint

# Generate IDE helper for better autocomplete
php artisan ide-helper:generate
```

### Development Best Practices

1. ✅ Always run tests before committing
2. ✅ Use Laravel Pint for code formatting
3. ✅ Write feature tests for new endpoints
4. ✅ Update API documentation
5. ✅ Use meaningful commit messages
6. ✅ Keep .env.example updated

---

## 👥 Test Users

For development and testing, use these pre-seeded accounts:

| Email | Password | Status | Has Profile | Appointments |
|-------|----------|--------|-------------|--------------|
| `mohamed.verified@healx.com` | `password123` | ✅ Verified | ❌ No | ✅ Yes (15 records) |
| `fatima.verified@healx.com` | `password123` | ✅ Verified | ❌ No | ❌ No |

**Patient IDs:**
- Mohamed: `HLX-2026-001`
- Fatima: `HLX-2026-002`

**Blood Types Available:**
1. A+
2. A-
3. B+
4. B-
5. AB+
6. AB-
7. O+
8. O-

**See [TEST_USERS.md](TEST_USERS.md) for more test accounts and details.**

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate new `APP_KEY`: `php artisan key:generate`
- [ ] Configure production database credentials
- [ ] Set up mail service (SMTP/SendGrid/AWS SES)
- [ ] Configure queue worker (Supervisor/PM2)
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Enable Laravel scheduler cron job
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Optimize application: `php artisan optimize`
- [ ] Set proper file permissions (755/644)
- [ ] Configure backups
- [ ] Set up monitoring (Laravel Telescope/Sentry)

### Supervisor Configuration (Queue Worker)

Create `/etc/supervisor/conf.d/healx-worker.conf`:

```ini
[program:healx-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/healx/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/healx/storage/logs/worker.log
stopwaitsecs=3600
```

### Laravel Scheduler Cron

Add to crontab:

```bash
* * * * * cd /path/to/healx && php artisan schedule:run >> /dev/null 2>&1
```

### Recommended Hosting Platforms

- **Backend:** AWS EC2, DigitalOcean, Laravel Forge, Cloudways
- **Database:** AWS RDS, DigitalOcean Managed MySQL
- **Queue:** Redis, AWS SQS, Laravel Horizon
- **Storage:** AWS S3 for file attachments
- **CDN:** CloudFlare, AWS CloudFront

---

## 📝 Frontend Integration Example

### React.js Integration

```javascript
// api.js - API Service
const API_URL = 'http://localhost:8000/api';

// Login Function
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/patient/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

// Fetch Appointments
export const getAppointments = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/appointments`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  
  return response.json();
};

// Create Appointment
export const createAppointment = async (appointmentData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create appointment');
  }
  
  return response.json();
};

// Get Patient Profile
export const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/patient/profile`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

// Logout
export const logout = async () => {
  const token = localStorage.getItem('token');
  
  await fetch(`${API_URL}/patient/auth/logout`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

**See [DASHBOARD_API_INTEGRATION.md](DASHBOARD_API_INTEGRATION.md) for complete React integration guide with examples.**

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make** your changes
4. **Test** thoroughly
   ```bash
   php artisan test
   ```
5. **Commit** with meaningful messages
   ```bash
   git commit -m "feat: Add patient search functionality"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/AmazingFeature
   ```
7. **Open** a Pull Request with detailed description

### Commit Message Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements

**Example:**

```bash
git commit -m "feat: Add patient appointment export to PDF"
git commit -m "fix: Resolve authentication token expiration issue"
git commit -m "docs: Update API documentation for profile endpoint"
```

### Code Style

- Follow PSR-12 coding standards
- Use Laravel Pint for code formatting
- Write descriptive variable and method names
- Add PHPDoc comments for complex methods
- Write tests for new features

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Healx Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors & Credits

**Built with ❤️ by the Healx Development Team**

### Core Contributors

- **Backend Development** - Laravel API implementation
- **Frontend Development** - React dashboard
- **Database Architecture** - Schema design & optimization
- **DevOps** - Deployment & CI/CD
- **Testing** - Pest PHP test suite

### Technologies & Acknowledgments

- [Laravel](https://laravel.com) - The PHP framework for web artisans
- [Laravel Sanctum](https://laravel.com/docs/sanctum) - Simple token authentication
- [Pest PHP](https://pestphp.com) - Elegant testing framework
- [React.js](https://react.dev) - JavaScript library for UIs
- [Vite](https://vitejs.dev) - Next generation frontend tooling
- [MySQL](https://www.mysql.com) - Reliable database

---


### Quick Links

- [Authentication API Docs](PATIENT_AUTH_API.md)
- [Profile API Docs](PROFILE_API.md)
- [Dashboard Integration Guide](DASHBOARD_API_INTEGRATION.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Security Guide](SECURITY_IMPROVEMENTS.md)
- [Quick Start Guide](QUICK_START.md)

### Report Issues

Found a bug? Please open an issue with:

1. Description of the problem
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (PHP version, OS, etc.)

---

## ⚠️ Important Healthcare Compliance Notice

**⚠️ This system handles sensitive medical information.**

### Regulatory Compliance

Before deploying to production, ensure compliance with:

- 🏥 **HIPAA** (Health Insurance Portability and Accountability Act) - United States
- 🇪🇺 **GDPR** (General Data Protection Regulation) - European Union
- 🔒 **Local healthcare data protection regulations** in your region

### Required Security Measures

✅ **Implement before production:**

1. **Data Encryption**
   - Enable database encryption at rest
   - Use SSL/TLS for data in transit
   - Encrypt sensitive file attachments

2. **Access Controls**
   - Implement role-based access control (RBAC)
   - Enable two-factor authentication (2FA)
   - Maintain audit logs for all access

3. **Data Protection**
   - Regular automated backups
   - Disaster recovery procedures
   - Data retention policies

4. **Monitoring & Auditing**
   - Access logging and monitoring
   - Intrusion detection systems
   - Regular security audits

5. **Patient Rights**
   - Data access requests
   - Right to erasure (GDPR)
   - Consent management system

### Disclaimer

This software is provided "as is" for development and educational purposes. The developers are not responsible for compliance with healthcare regulations in production environments. 

**Always consult with legal and security professionals before deploying healthcare systems.**

---

<div align="center">

## ⭐ Star This Repository

**If you find Healix useful, please consider giving it a star!**

[![GitHub stars](https://img.shields.io/github/stars/ziadsaad24/healix?style=social)](https://github.com/ziadsaad24/healix/stargazers)

[⬆ Back to Top](#-healx---healthcare-management-system)

---

**Made with 💊 for better healthcare management**

[Report Bug](https://github.com/ziadsaad24/healix/issues) • [Request Feature](https://github.com/ziadsaad24/healix/issues) • [View Documentation](#-api-documentation)

</div>
