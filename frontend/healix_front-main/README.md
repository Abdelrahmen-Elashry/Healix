#  Healix  

<div dir="rtl">

## 📋 نظرة عامة

**Healix** هو نظام متكامل لإدارة البيانات الطبية للمرضى، يوفر منصة حديثة وسهلة الاستخدام لتسجيل المرضى، إدارة ملفاتهم الطبية، وتتبع السجلات الصحية.

</div>

---

## ✨ المميزات الرئيسية | Key Features

<div dir="rtl">

### 🔐 نظام التسجيل والدخول
- تسجيل مستخدم جديد بالبيانات الأساسية (الاسم، العمر، البريد الإلكتروني)
- تسجيل الدخول الآمن مع إدارة الجلسات
- التحقق من صحة البيانات المدخلة

### 👤 استكمال الملف الطبي
بعد التسجيل، يقوم المستخدم باستكمال ملفه الطبي الشامل:
- **البيانات الأساسية**: الطول، الوزن، فصيلة الدم
- **حساسية الأدوية**: اختيار نعم/لا مع تحديد الأدوية
- **الأمراض المزمنة**: اختيار متعدد (سكري، ضغط، قلب، ربو، سرطان، أخرى)
- **الأدوية الحالية**: قائمة ديناميكية قابلة للإضافة والحذف
- **الأدوية طويلة المدى**: قائمة منفصلة للأدوية المستمرة
- **العمليات الجراحية السابقة**: سجل تفصيلي للعمليات
- **جهة الاتصال للطوارئ**: معلومات الاتصال الضرورية

### 🏥 لوحة التحكم (Dashboard)
- رسالة ترحيب شخصية للمستخدم
- إحصائيات سريعة (المواعيد، الوصفات الطبية، السجلات، التقارير)
- أزرار العمليات السريعة
- عرض بطاقة المريض مع رمز QR

### 💳 بطاقة المريض (Patient Card)
- عرض معلومات المريض الكاملة
- رقم المريض التلقائي (مثال: UF0001)
- رمز QR للوصول السريع للسجلات الطبية
- إمكانية تحميل البطاقة كصورة
- إمكانية مشاركة البطاقة

### 🤖 المساعد الذكي (AI ChatBot)
- واجهة محادثة حديثة وجذابة
- أزرار إجراءات سريعة:
  - 📅 حجز موعد
  - 📊 عرض السجلات
  - 💊 معلومات عن الأدوية
  - ❓ طرح سؤال
- مؤشر الكتابة المتحرك
- تصميم متجاوب (سطح المكتب/موبايل)
- جاهز للربط مع OpenAI أو Google Gemini

### 📱 نظام الإشعارات
- إشعارات فورية للأحداث المهمة
- أنواع متعددة (نجاح، خطأ، تحذير، معلومات)
- إغلاق تلقائي بعد 3 ثوان
- تصميم جذاب مع رموز تعبيرية

### 📝 السجلات الطبية
- عرض شامل لجميع السجلات الطبية
- تصفح سهل ومنظم
- واجهة نظيفة وبسيطة

### 👤 الملف الشخصي
- عرض وتعديل البيانات الشخصية
- تحديث المعلومات الطبية
- إدارة الحساب

</div>

---

## 🎨 التصميم | Design

<div dir="rtl">

### نظام الألوان
- **الأساسي**: درجات الأزرق (#3B82F6, #1E40AF, #4A90E2)
- **الثانوي**: الأزرق الفاتح والأبيض
- **التمييز**: الأخضر الزمردي للأيقونات الطبية
- **الخلفية**: تدرجات زرقاء ناعمة

### المميزات التصميمية
- ✅ رسوم متحركة سلسة (fade, slide, gradient)
- ✅ تصميم متجاوب لجميع الأجهزة (موبايل، تابلت، سطح المكتب)
- ✅ خط Inter Font الحديث
- ✅ أيقونات Font Awesome
- ✅ تأثيرات الـ Hover والانتقالات

</div>

---

## 🛠️ التقنيات المستخدمة | Technologies

### Frontend
- **React** 19.2.4
- **React Router DOM** 7.13.0
- **React QR Code** 2.0.18 (لرموز QR)
- **html2canvas** 1.4.1 (لتحميل البطاقة كصورة)
- **Font Awesome** 6 (الأيقونات)
- **CSS3** (التصاميم والرسوم المتحركة)

### Backend (جاهز للربط)
- **Laravel API** (موصى به)
- **Authentication**: Token-based (Bearer)
- **Database**: MySQL/PostgreSQL

---

## 📁 هيكل المشروع | Project Structure

```
my-project/
├── package.json                    # معلومات المشروع الرئيسي
├── BACKEND_REQUIREMENTS.md         # متطلبات Backend
├── CHATBOT_INTEGRATION.md          # دليل ربط ChatBot
├── README.md                       # هذا الملف
│
└── my-react-app/                   # تطبيق React
    ├── package.json                # اعتماديات React
    ├── FEATURES.md                 # ملف المميزات
    ├── AI_CHATBOT_INTEGRATION.md   # دليل ChatBot التفصيلي
    ├── API_INTEGRATION.md          # دليل ربط API
    │
    ├── public/                     # الملفات العامة
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    │
    └── src/                        # الكود المصدري
        ├── App.js                  # المكون الرئيسي
        ├── App.css                 # تصاميم التطبيق
        ├── index.js                # نقطة البداية
        ├── index.css               # التصاميم العامة
        │
        ├── Register.js             # صفحة التسجيل
        ├── Register.css
        │
        ├── SignIn.js               # صفحة تسجيل الدخول
        ├── SignIn.css
        │
        ├── ProfileCompletion.js    # استكمال الملف الطبي
        ├── ProfileCompletion.css
        │
        ├── Dashboard.js            # لوحة التحكم
        ├── Dashboard.css
        │
        ├── PatientCard.js          # بطاقة المريض
        ├── PatientCard.css
        │
        ├── ChatBot.js              # المساعد الذكي
        ├── ChatBot.css
        │
        ├── Profile.js              # الملف الشخصي
        ├── Profile.css
        │
        ├── PatientRecords.js       # السجلات الطبية
        ├── PatientRecords.css
        │
        ├── Notification.js         # مكون الإشعار
        ├── Notification.css
        │
        ├── NotificationContainer.js # حاوية الإشعارات
        │
        └── assets/                 # الصور والملفات
```

---

## 🚀 التشغيل | Getting Started

<div dir="rtl">

### المتطلبات الأساسية
- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn
- محرر أكواد (يفضل VS Code)

### خطوات التثبيت

</div>

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd my-project

# 2. تثبيت الاعتماديات
npm install

# 3. الانتقال إلى مجلد التطبيق
cd my-react-app

# 4. تثبيت اعتماديات React
npm install

# 5. تشغيل التطبيق
npm start
```

<div dir="rtl">

التطبيق سيعمل على: `http://localhost:3000`

### أوامر مفيدة

</div>

```bash
# تشغيل التطبيق في وضع التطوير
npm start

# بناء التطبيق للإنتاج
npm run build

# تشغيل الاختبارات
npm test
```

---

## 🔌 ربط Backend API

<div dir="rtl">

### نقاط الاتصال المطلوبة (API Endpoints)

#### 1. تسجيل مستخدم جديد
</div>

```
POST /api/register
Content-Type: application/json

Body:
{
  "first_name": "string",
  "last_name": "string",
  "age": "integer",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}

Response (200):
{
  "message": "Registration successful",
  "user": { ... },
  "token": "bearer-token"
}
```

<div dir="rtl">

#### 2. تسجيل الدخول
</div>

```
POST /api/login
Content-Type: application/json

Body:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "message": "Login successful",
  "user": { ... },
  "token": "bearer-token"
}
```

<div dir="rtl">

#### 3. استكمال الملف الطبي
</div>

```
POST /api/profile/complete
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "height": "string",
  "weight": "string",
  "blood_group": "string",
  "drug_allergies": "boolean",
  "allergies_details": "string",
  "chronic_diseases": ["array"],
  "current_medications": ["array"],
  "long_term_medications": ["array"],
  "past_surgeries": "text",
  "emergency_contact_name": "string",
  "emergency_contact_relation": "string",
  "emergency_contact_phone": "string"
}
```

<div dir="rtl">

#### 4. الحصول على الملف الطبي
</div>

```
GET /api/profile
Authorization: Bearer {token}

Response (200):
{
  "patient_id": "UF0001",
  "age": 25,
  "city": "Cairo",
  "gender": "Male",
  "blood_type": "ORh+",
  ...
}
```

<div dir="rtl">

#### 5. السجلات الطبية العامة (QR Code)
</div>

```
GET /api/public/patient/{patient_id}/records

Response (200):
{
  "success": true,
  "patient": { ... },
  "medical_info": { ... },
  "appointments": [ ... ]
}
```

<div dir="rtl">

### خطوات الربط

1. **تحديث رابط API**: في الملفات التالية، غيّر `API_URL`:
   - `Register.js`
   - `SignIn.js`
   - `ProfileCompletion.js`
   - `Dashboard.js`

2. **إزالة التعليق**: أزل التعليقات `/*  */` من كود API

3. **إضافة متغير البيئة**: أنشئ ملف `.env`:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **اختبار الاتصال**: سجل مستخدم جديد وتأكد من الاتصال

</div>

---

## 🤖 ربط ChatBot بالذكاء الاصطناعي

<div dir="rtl">

### الخيارات المتاحة

#### الخيار 1: OpenAI GPT
</div>

```bash
npm install openai
```

```javascript
// في ملف .env
REACT_APP_OPENAI_API_KEY=your-api-key-here
```

<div dir="rtl">

#### الخيار 2: Google Gemini
</div>

```bash
npm install @google/generative-ai
```

```javascript
// في ملف .env
REACT_APP_GEMINI_API_KEY=your-api-key-here
```

<div dir="rtl">

للمزيد من التفاصيل، راجع ملف `AI_CHATBOT_INTEGRATION.md`

</div>

---

## 🔒 الأمان | Security

<div dir="rtl">

- ✅ التحقق من صحة البيانات المدخلة
- ✅ تشفير كلمات المرور
- ✅ مصادقة Token-based
- ✅ تخزين آمن للجلسات (localStorage)
- ✅ حماية CORS
- ✅ Rate Limiting على API العامة

</div>

---

## 📱 الاستجابية | Responsiveness

<div dir="rtl">

التطبيق متجاوب بالكامل ويعمل على:
- 📱 الهواتف المحمولة (320px+)
- 📱 الأجهزة اللوحية (768px+)
- 💻 أجهزة سطح المكتب (1024px+)
- 🖥️ الشاشات الكبيرة (1440px+)

</div>

---

## 🗺️ مسار المستخدم | User Flow

```
بداية
  ↓
تسجيل مستخدم جديد
  ↓
استكمال الملف الطبي
  ↓
لوحة التحكم
  ↓
[عرض بطاقة المريض | السجلات الطبية | المحادثة مع ChatBot | الملف الشخصي]
```

**OR**

```
بداية
  ↓
تسجيل الدخول
  ↓
فحص حالة الملف الطبي
  ↓
إذا مكتمل → لوحة التحكم
إذا غير مكتمل → استكمال الملف الطبي → لوحة التحكم
```

---

## 📊 قاعدة البيانات | Database Schema

<div dir="rtl">

### جدول المستخدمين (users)
- `id` - معرف المستخدم
- `first_name` - الاسم الأول
- `last_name` - الاسم الأخير
- `age` - العمر
- `email` - البريد الإلكتروني (فريد)
- `password` - كلمة المرور (مشفرة)
- `patient_id` - رقم المريض (مثال: UF0001)
- `created_at` - تاريخ الإنشاء
- `updated_at` - تاريخ التحديث

### جدول الملفات الطبية (profiles)
- `id` - المعرف
- `user_id` - معرف المستخدم (foreign key)
- `date_of_birth` - تاريخ الميلاد
- `city` - المدينة
- `gender` - الجنس
- `height` - الطول
- `weight` - الوزن
- `blood_group` - فصيلة الدم
- `drug_allergies` - حساسية الأدوية
- `allergies_details` - تفاصيل الحساسية
- `chronic_diseases` - الأمراض المزمنة (JSON)
- `current_medications` - الأدوية الحالية (JSON)
- `long_term_medications` - الأدوية طويلة المدى (JSON)
- `past_surgeries` - العمليات السابقة
- `emergency_contact_name` - اسم جهة الاتصال للطوارئ
- `emergency_contact_relation` - صلة القرابة
- `emergency_contact_phone` - رقم الهاتف
- `profile_completed` - حالة اكتمال الملف
- `created_at` - تاريخ الإنشاء
- `updated_at` - تاريخ التحديث

</div>

---

## 🧪 الاختبارات | Testing

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل اختبار محدد
npm test -- Register.test.js

# تشغيل الاختبارات مع التغطية
npm test -- --coverage
```

---

## 📦 النشر | Deployment

<div dir="rtl">

### بناء التطبيق للإنتاج

</div>

```bash
cd my-react-app
npm run build
```

<div dir="rtl">

سيتم إنشاء مجلد `build/` يحتوي على الملفات المحسنة للنشر.

### منصات النشر الموصى بها
- **Vercel** - سهل وسريع
- **Netlify** - مجاني ومتكامل
- **AWS S3 + CloudFront** - للمشاريع الكبيرة
- **Heroku** - بسيط للمبتدئين

</div>

---

## 🐛 حل المشاكل الشائعة | Troubleshooting

<div dir="rtl">

### المشكلة: التطبيق لا يعمل
**الحل**: تأكد من تثبيت Node.js وتشغيل `npm install`

### المشكلة: خطأ في الاتصال بـ API
**الحل**: تحقق من رابط API في متغيرات البيئة وتأكد من تشغيل Backend

### المشكلة: رمز QR لا يعمل
**الحل**: تأكد من صحة `REACT_APP_API_URL` وأن endpoint العام يعمل

### المشكلة: ChatBot لا يرد
**الحل**: تأكد من ربط API الذكاء الاصطناعي وصحة API Key

</div>

---

## 🤝 المساهمة | Contributing

<div dir="rtl">

نرحب بالمساهمات! يرجى:
1. عمل Fork للمشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. عمل Commit للتغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request


---

## 📚 مصادر إضافية | Additional Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [API Integration Guide](my-react-app/API_INTEGRATION.md)
- [ChatBot Integration Guide](my-react-app/AI_CHATBOT_INTEGRATION.md)
- [Features Documentation](my-react-app/FEATURES.md)
- [Backend Requirements](BACKEND_REQUIREMENTS.md)

---

<div align="center" dir="rtl">

**صُنع بـ ❤️ في مصر**

**Made with ❤️ in Egypt**

---

### 🌟 نجّم المشروع إذا أعجبك!
### Star the project if you like it!

</div>
