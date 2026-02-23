<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'city',
        'gender',
        'height',
        'weight',
        'blood_group',
        'drug_allergies',
        'chronic_diseases',
        'one_time_medications',
        'long_term_medications',
        'past_surgeries',
        'emergency_contact',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'height' => 'decimal:2',
        'weight' => 'decimal:2',
        'chronic_diseases' => 'array',
        'one_time_medications' => 'array',
        'long_term_medications' => 'array',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the blood type.
     */
    public function bloodType()
    {
        return $this->belongsTo(BloodType::class, 'blood_group', 'type');
    }
}
