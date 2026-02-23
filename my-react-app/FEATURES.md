# Medical Portal - Healix 🏥

A modern medical portal with patient registration, authentication, and medical profile completion.

## Features

### 1. User Registration
- Register with first name, last name, age, email, and password
- Form validation and error handling
- Medical-themed design (blue & white)

### 2. Sign In
- Login with email and password
- Automatic redirect based on profile status
- Session management with localStorage

### 3. Profile Completion (Medical Intake)
After registration or login, users complete their medical profile with:

- **Basic Info**: Height, Weight, Blood Group
- **Drug Allergies**: Yes/No with conditional text input
- **Chronic Diseases**: Multiple selection (Diabetes, Hypertension, Heart disease, Asthma, Cancer, Other)
- **One-time Medications**: Dynamic list with add/remove functionality
- **Long-term Medications**: Dynamic list with add/remove functionality
- **Past Surgeries**: Text area for surgical history
- **Emergency Contact**: Required contact information

### 4. Dashboard
- Welcome message with user info
- Quick stats (Appointments, Prescriptions, Records, Reports)
- Quick action buttons
- Logout functionality

## Color Scheme (Medical Theme)
- Primary: Blues (#3B82F6, #1E40AF, #4A90E2)
- Secondary: Light blues and whites
- Accents: Emerald/Teal for medical icons
- Background: Soft blue gradients

## User Flow

```
1. Register → Profile Completion → Dashboard
2. Sign In → Check Profile Status
   - If profile completed → Dashboard
   - If profile not completed → Profile Completion (with alert)
```

## Routes

- `/` → Redirects to `/signin`
- `/register` → Registration page
- `/signin` → Login page
- `/profile-completion` → Medical profile intake form
- `/dashboard` → User dashboard

## Technologies

- React 19.2.4
- React Router DOM 6
- Font Awesome 6 (Icons)
- Inter Font (Typography)
- Custom CSS with animations

## API Integration (Ready)

All components are prepared for Laravel API integration:

### Register Endpoint
```
POST /api/register
Body: { first_name, last_name, age, email, password, password_confirmation }
```

### Login Endpoint
```
POST /api/login
Body: { email, password }
```

### Profile Completion Endpoint
```
POST /api/profile/complete
Headers: { Authorization: Bearer {token} }
Body: { height, weight, blood_group, ... }
```

## How to Run

```bash
cd my-react-app
npm start
```

App will open at `http://localhost:3000`

## Design Features

- ✅ Smooth animations (fade, slide, gradient shift)
- ✅ Responsive design (mobile-friendly)
- ✅ Modern card-based UI
- ✅ Medical-themed icons
- ✅ Interactive form elements
- ✅ Dynamic medication lists
- ✅ Conditional field rendering
- ✅ Professional medical color palette

## Notes

- Currently using mock data (localStorage)
- API endpoints commented and ready for connection
- Token-based authentication prepared
- HIPAA compliance badge displayed
- All forms include proper validation
- Error handling implemented

---

**Built for medical professionals and patients** 💙
