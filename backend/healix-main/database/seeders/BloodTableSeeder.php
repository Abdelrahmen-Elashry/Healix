<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BloodTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */     
    public function run(): void
    {
        // Delete existing records
        DB::table('blood_types')->delete();
        
        // Blood types in order of rarity
        $bloodTypes = [
            ['type' => 'O+'],
            ['type' => 'O-'],
            ['type' => 'A+'],
            ['type' => 'A-'],
            ['type' => 'B+'],
            ['type' => 'B-'],
            ['type' => 'AB+'],
            ['type' => 'AB-'],
        ];
        
        foreach ($bloodTypes as $bloodType) {
            DB::table('blood_types')->insert([
                'type' => $bloodType['type'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        $this->command->info('Blood types seeded successfully!');
    }
}
