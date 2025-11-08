<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_employees(): void
    {
        Employee::factory()->count(15)->create();

        $response = $this->getJson('/api/employees?per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('response_status', 'successfully-get')
            ->assertJsonStructure([
                'response_code',
                'response_status',
                'message',
                'data' => [
                    'meta' => [
                        'current_page',
                        'first_page_url',
                        'from',
                        'last_page',
                        'last_page_url',
                        'links',
                        'next_page_url',
                        'path',
                        'per_page',
                        'prev_page_url',
                        'to',
                        'total',
                    ],
                    'employees',
                ],
            ]);

        $data = $response->json('data');
        $this->assertIsArray($data['employees']);
        $this->assertCount(10, $data['employees']);
    }

    public function test_update_updates_employee_and_returns_resource(): void
    {
        $employee = Employee::factory()->create([
            'is_active' => true,
        ]);

        $payload = [
            'name' => 'Updated Name',
            'is_active' => false,
        ];

        $response = $this->putJson("/api/employees/{$employee->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('response_status', 'successfully-updated')
            ->assertJsonPath('data.id', $employee->id)
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.isActive', false);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'name' => 'Updated Name',
            'is_active' => 0,
        ]);
    }
}

