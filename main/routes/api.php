<?php

use App\Http\Controllers\Api\Auth\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProfileController;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public QR Code endpoint (no authentication required)
Route::get('/public/patient/{patient_id}/records', [PatientController::class, 'publicRecords'])
    ->middleware('throttle:20,1');

Route::prefix('patient')->group(function () {
    // Public routes with rate limiting
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/register', [PatientController::class, 'register']);
        Route::post('/login', [PatientController::class, 'login']);
        Route::post('/forgot-password', [PatientController::class, 'forgotPassword']);
        Route::post('/reset-password', [PatientController::class, 'resetPassword']);
        Route::post('/email/resend', [PatientController::class, 'resendVerification']);
    });
    
    // Email verification routes
    Route::get('/email/verify/{id}/{hash}', [PatientController::class, 'verify'])
        ->middleware(['signed'])
        ->name('patient.verification.verify');

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Routes that require verified email
        Route::middleware('verified')->group(function () {
            Route::get('/profile', [PatientController::class, 'profile']);
            Route::post('/logout', [PatientController::class, 'logout']);
        });
    });
});

// Medical Profile Routes (protected)
Route::prefix('profile')->middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/my-profile', [ProfileController::class, 'myProfile']);
    Route::post('/create-or-update', [ProfileController::class, 'createOrUpdate']);
    Route::get('/check', [ProfileController::class, 'checkProfile']);
});

// Appointments Routes (protected)
Route::prefix('appointments')->middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);
    Route::post('/', [AppointmentController::class, 'store']);
    Route::get('/{id}', [AppointmentController::class, 'show']);
    Route::delete('/{id}', [AppointmentController::class, 'destroy']);
});