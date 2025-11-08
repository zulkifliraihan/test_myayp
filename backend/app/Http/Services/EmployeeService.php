<?php

namespace App\Http\Services;

use App\Http\Repositories\EmployeeRepository\EmployeeInterface;
use App\Http\Resources\EmployeeResource;
use Illuminate\Support\Facades\Cache;
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
        $perPage = (int) ($params['per_page'] ?? 10);
        $page = (int) ($params['page'] ?? 1);

        $cacheStore = Cache::store('redis');
        $ttl = 600;

        if ($perPage > 0) {
            $key = sprintf('employees:list:pp:%d:page:%d', $perPage, max(1, $page));
            $data = $cacheStore->tags(['employees', 'employees:list'])->remember($key, $ttl, function () use ($perPage, $page) {
                $query = $this->employeeRepository->query();
                $paginator = $query->paginate($perPage, ['*'], 'page', max(1, $page));

                $items = EmployeeResource::collection($paginator->items())->resolve();

                return [
                    'meta' => Arr::except($paginator->toArray(), ['data']),
                    'employees' => $items,
                ];
            });
        } else {
            $key = 'employees:list:all';
            $data = $cacheStore->tags(['employees', 'employees:list'])->remember($key, $ttl, function () {
                $collection = $this->employeeRepository->index();
                $items = EmployeeResource::collection($collection)->resolve();
                return [ 'employees' => $items ];
            });
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

        Cache::store('redis')->tags(['employees', 'employees:list'])->flush();
        
        $resource = new EmployeeResource($employee->refresh())->resolve();

        return [
            'status' => true,
            'response' => 'updated',
            'data' => $resource,
        ];
    }
}
