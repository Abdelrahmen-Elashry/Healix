# Test Users Credentials

تم إنشاء 20 مستخدم للتجربة، كل المستخدمين:
- **Type:** patient
- **Password:** `password123`
- **Email Verified:** ✅ Yes

## قائمة المستخدمين:

| # | Name | Email | Age |
|---|------|-------|-----|
| 1 | Ahmed Hassan | ahmed.hassan@example.com | 28 |
| 2 | Fatima Ali | fatima.ali@example.com | 32 |
| 3 | Mohamed Said | mohamed.said@example.com | 45 |
| 4 | Sara Mahmoud | sara.mahmoud@example.com | 26 |
| 5 | Omar Khalil | omar.khalil@example.com | 38 |
| 6 | Nour Ibrahim | nour.ibrahim@example.com | 29 |
| 7 | Youssef Ahmed | youssef.ahmed@example.com | 41 |
| 8 | Mariam Youssef | mariam.youssef@example.com | 24 |
| 9 | Khaled Mostafa | khaled.mostafa@example.com | 35 |
| 10 | Layla Mohamed | layla.mohamed@example.com | 30 |
| 11 | Hassan Adel | hassan.adel@example.com | 50 |
| 12 | Amira Samy | amira.samy@example.com | 27 |
| 13 | Tarek Emad | tarek.emad@example.com | 33 |
| 14 | Yasmin Nabil | yasmin.nabil@example.com | 22 |
| 15 | Karim Fathy | karim.fathy@example.com | 39 |
| 16 | Heba Tarek | heba.tarek@example.com | 31 |
| 17 | Ali Omar | ali.omar@example.com | 44 |
| 18 | Rana Khaled | rana.khaled@example.com | 25 |
| 19 | Mahmoud Hany | mahmoud.hany@example.com | 36 |
| 20 | Dina Hassan | dina.hassan@example.com | 28 |

## للتجربة في Postman:

### Login Example:
```json
POST /api/patient/login

{
  "email": "ahmed.hassan@example.com",
  "password": "password123"
}
```

### Response:
```json
{
  "success": true,
  "message": "Patient logged in successfully",
  "user": {
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "email": "ahmed.hassan@example.com",
    "age": 28
  },
  "token": "your-auth-token"
}
```

## إعادة تشغيل الـ Seeder:

```bash
# لتشغيل UserSeeder فقط
php artisan db:seed --class=UserSeeder

# لتشغيل جميع الـ Seeders
php artisan db:seed

# لإعادة بناء قاعدة البيانات من الصفر
php artisan migrate:fresh --seed
```

## ملاحظات:
- ✅ جميع الإيميلات محققة (verified)
- ✅ نفس كلمة المرور لجميع المستخدمين: `password123`
- ✅ جميع المستخدمين من نوع `patient`
- ✅ أعمار متنوعة من 22 إلى 50 سنة
