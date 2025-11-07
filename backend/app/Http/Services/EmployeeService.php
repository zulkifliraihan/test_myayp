<?php

namespace App\Http\Services;

use App\Http\Repositories\EmployeeRepository\EmployeeInterface;
use App\Http\Resources\EmployeeResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Class EmployeeService
 *
 * Service layer for employee business logic.
 * Handles data transformation and business rules.
 *
 * @package App\Http\Services
 */
class EmployeeService
{
    /**
     * @param EmployeeInterface $employeeRepository
     */
    public function __construct(
        private readonly EmployeeInterface $employeeRepository
    ) {}

    /**
     * Get all employees with optional pagination.
     *
     * @param array<string, mixed> $params
     * @return array{status: bool, response: string, data?: mixed, errors?: array<int, string>}
     */
    public function getAll(array $params): array
    {
        $query = $this->employeeRepository->query();
        $perPage = (int) ($params['per_page'] ?? 10);

        if ($perPage > 0 ) {
            $paginator = $query->paginate($perPage);
            $items = EmployeeResource::collection($paginator->items());
            $data = [
                'meta' => Arr::except($paginator->toArray(), ['data']),
                'employees' => $items,
            ];
        }
        else {
            $items = EmployeeResource::collection($this->employeeRepository->index());
            $data = [
                'employees' => $items,
            ];
        }
        
        return [
            'status' => true,
            'response' => 'get',
            'data' => $data,
        ];

    }

    /**
     * Update an existing employee.
     *
     * @param int $id
     * @param array<string, mixed> $data
     * @return array{status: bool, response: string, data?: mixed, errors?: array<int, string>}
     */
    public function update(int $id, array $data): array
    {
        $employee = $this->employeeRepository->detail($id);
        if (!$employee) {
            return [
                'status' => false,
                'response' => 'not-found',
                'errors' => ["Task with the id {$id} was not found"],
            ];
        }

        $this->employeeRepository->update($id, $data);

        $resource = new EmployeeResource($employee->refresh())->resolve();

        return [
            'status' => true,
            'response' => 'updated',
            'data' => $resource,
        ];
    }
}
