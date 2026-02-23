<?php

namespace App\Models;

use App\Notifications\PatientEmailVerification;
use App\Notifications\PatientResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'age',
        'email',
        'password',
        'type',
        'patient_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'age' => 'integer',
        ];
    }

    /**
     * Boot method to auto-generate patient_id
     */
    protected static function boot()
    {
        parent::boot();
        
        static::created(function ($user) {
            if ($user->type === 'patient' && empty($user->patient_id)) {
                $user->patient_id = 'UF' . str_pad($user->id, 4, '0', STR_PAD_LEFT);
                $user->save();
            }
        });
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        if ($this->type === 'patient') {
            $this->notify(new PatientEmailVerification);
        } else {
            parent::sendEmailVerificationNotification();
        }
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        if ($this->type === 'patient') {
            $this->notify(new PatientResetPasswordNotification($token));
        } else {
            parent::sendPasswordResetNotification($token);
        }
    }

    /**
     * Get the user's profile.
     */
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Get the user's appointments.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
