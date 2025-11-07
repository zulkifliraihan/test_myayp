<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Seed the employees table with 1000 records.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $rows = [];
        for ($i = 0; $i < 1000; $i++) {
            $rows[] = [
                'name'       => $faker->name(),
                'email'      => $faker->unique()->safeEmail(),
                'is_active'  => $faker->boolean(), // random true/false
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Insert in chunks to avoid large single insert
            if (count($rows) === 200) {
                DB::table('employees')->insert($rows);
                $rows = [];
            }
        }

        if (!empty($rows)) {
            DB::table('employees')->insert($rows);
        }
    }
}

