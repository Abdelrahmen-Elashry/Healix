<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['first_name' => 'Ahmed', 'last_name' => 'Hassan', 'age' => 28, 'email' => 'ahmed.hassan@example.com'],
            ['first_name' => 'Fatima', 'last_name' => 'Ali', 'age' => 32, 'email' => 'fatima.ali@example.com'],
            ['first_name' => 'Mohamed', 'last_name' => 'Said', 'age' => 45, 'email' => 'mohamed.said@example.com'],
            ['first_name' => 'Sara', 'last_name' => 'Mahmoud', 'age' => 26, 'email' => 'sara.mahmoud@example.com'],
            ['first_name' => 'Omar', 'last_name' => 'Khalil', 'age' => 38, 'email' => 'omar.khalil@example.com'],
            ['first_name' => 'Nour', 'last_name' => 'Ibrahim', 'age' => 29, 'email' => 'nour.ibrahim@example.com'],
            ['first_name' => 'Youssef', 'last_name' => 'Ahmed', 'age' => 41, 'email' => 'youssef.ahmed@example.com'],
            ['first_name' => 'Mariam', 'last_name' => 'Youssef', 'age' => 24, 'email' => 'mariam.youssef@example.com'],
            ['first_name' => 'Khaled', 'last_name' => 'Mostafa', 'age' => 35, 'email' => 'khaled.mostafa@example.com'],
            ['first_name' => 'Layla', 'last_name' => 'Mohamed', 'age' => 30, 'email' => 'layla.mohamed@example.com'],
            ['first_name' => 'Hassan', 'last_name' => 'Adel', 'age' => 50, 'email' => 'hassan.adel@example.com'],
            ['first_name' => 'Amira', 'last_name' => 'Samy', 'age' => 27, 'email' => 'amira.samy@example.com'],
            ['first_name' => 'Tarek', 'last_name' => 'Emad', 'age' => 33, 'email' => 'tarek.emad@example.com'],
            ['first_name' => 'Yasmin', 'last_name' => 'Nabil', 'age' => 22, 'email' => 'yasmin.nabil@example.com'],
            ['first_name' => 'Karim', 'last_name' => 'Fathy', 'age' => 39, 'email' => 'karim.fathy@example.com'],
            ['first_name' => 'Heba', 'last_name' => 'Tarek', 'age' => 31, 'email' => 'heba.tarek@example.com'],
            ['first_name' => 'Ali', 'last_name' => 'Omar', 'age' => 44, 'email' => 'ali.omar@example.com'],
            ['first_name' => 'Rana', 'last_name' => 'Khaled', 'age' => 25, 'email' => 'rana.khaled@example.com'],
            ['first_name' => 'Mahmoud', 'last_name' => 'Hany', 'age' => 36, 'email' => 'mahmoud.hany@example.com'],
            ['first_name' => 'Dina', 'last_name' => 'Hassan', 'age' => 28, 'email' => 'dina.hassan@example.com'],
        ];

        foreach ($users as $userData) {
            User::create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'age' => $userData['age'],
                'email' => $userData['email'],
                'password' => Hash::make('password123'), // Same password for all test users
                'type' => 'patient',
                'email_verified_at' => now(), // All emails verified
            ]);
        }

        $this->command->info('20 users created successfully!');
    }
}
