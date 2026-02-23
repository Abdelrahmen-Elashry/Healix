# Patient Email Verification & Password Reset API Documentation

## إعدادات البريد الإلكتروني

قبل استخدام ميزات التحقق من البريد الإلكتروني وإعادة تعيين كلمة المرور، يجب تكوين إعدادات البريد في ملف `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@healx.com
MAIL_FROM_NAME="${APP_NAME}"
```

## API Endpoints

### 1. التسجيل (مع إرسال بريد التحقق)

**Endpoint:** `POST /api/patient/register`

**Request Body:**
```json
{
  "first_name": "أحمد",
  "last_name": "محمد",
  "age": 30,
  "email": "ahmed@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
  "message": "Patient registered successfully. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "first_name": "أحمد",
    "last_name": "محمد",
    "email": "ahmed@example.com",
    "email_verified_at": null,
    "type": "patient"
  },
  "token": "your-auth-token"
}
```

**ملاحظة:** سيتم إرسال بريد إلكتروني تلقائياً يحتوي على رابط التحقق.

---

### 2. التحقق من البريد الإلكتروني

**Endpoint:** `GET /api/patient/email/verify/{id}/{hash}`

هذا الرابط يتم إنشاؤه تلقائياً ويُرسل في البريد الإلكتروني. يجب أن يحتوي على:
- `id`: معرف المستخدم
- `hash`: توقيع SHA1 للبريد الإلكتروني
- `signature`: التوقيع الزمني للرابط (صالح لمدة 60 دقيقة)

**Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

**Response (403) - رابط غير صالح:**
```json
{
  "message": "Invalid verification link"
}
```

**Response (200) - البريد محقق مسبقاً:**
```json
{
  "message": "Email already verified"
}
```

---

### 3. إعادة إرسال بريد التحقق

**Endpoint:** `POST /api/patient/email/resend`

**Headers:**
```
Authorization: Bearer your-auth-token
```

**Response (200):**
```json
{
  "message": "Verification email resent successfully"
}
```

**Response (200) - البريد محقق مسبقاً:**
```json
{
  "message": "Email already verified"
}
```

---

### 4. نسيت كلمة المرور (إرسال رمز التحقق)

**Endpoint:** `POST /api/patient/forgot-password`

**Request Body:**
```json
{
  "email": "ahmed@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset code sent to your email"
}
```

**Response (404) - حساب غير موجود:**
```json
{
  "message": "No patient account found with this email"
}
```

**ملاحظة:** سيتم إرسال رمز مكون من 6 أرقام إلى البريد الإلكتروني (صالح لمدة 60 دقيقة).

---

### 5. إعادة تعيين كلمة المرور

**Endpoint:** `POST /api/patient/reset-password`

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "token": "123456",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Response (400) - رمز غير صالح:**
```json
{
  "message": "Invalid reset code"
}
```

**Response (400) - رمز منتهي الصلاحية:**
```json
{
  "message": "Reset code has expired"
}
```

**ملاحظة:** بعد إعادة تعيين كلمة المرور بنجاح، سيتم إلغاء جميع الـ tokens الحالية تلقائياً ويجب على المستخدم تسجيل الدخول مجدداً.

---

## ملاحظات مهمة

1. **صلاحية الروابط والرموز:**
   - رابط التحقق من البريد: 60 دقيقة
   - رمز إعادة تعيين كلمة المرور: 60 دقيقة

2. **الأمان:**
   - جميع روابط التحقق موقعة رقمياً (signed URLs)
   - رموز إعادة التعيين مشفرة في قاعدة البيانات
   - يتم حذف رموز إعادة التعيين بعد الاستخدام

3. **البريد الإلكتروني:**
   - الرسائل مكتوبة بالعربية
   - تحتوي على تعليمات واضحة للمستخدم

## مثال على Flow كامل

### تسجيل مستخدم جديد:
1. المستخدم يسجل حساب جديد → يحصل على token
2. يصل بريد تحقق → ينقر على الرابط
3. البريد يتم التحقق منه → يمكنه الآن استخدام جميع المزايا

### إعادة تعيين كلمة المرور:
1. المستخدم نسي كلمة المرور → يطلب رمز التحقق
2. يصله رمز من 6 أرقام → يدخله مع كلمة المرور الجديدة
3. كلمة المرور تتغير → يجب تسجيل الدخول مجدداً

## اختبار محلياً

للاختبار المحلي، يمكنك استخدام:
- **Mailtrap**: للاختبار دون إرسال بريد حقيقي
- **Log Driver**: لحفظ البريد في ملف logs

```env
MAIL_MAILER=log
```

ثم تحقق من الرسائل في: `storage/logs/laravel.log`
