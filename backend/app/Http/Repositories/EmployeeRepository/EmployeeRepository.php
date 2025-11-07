<?php

namespace App\Http\Repositories\EmployeeRepository;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EmployeeRepository implements EmployeeInterface {

    public function __construct(private Employee $employee) {}

    /**
     * Get a query builder instance for Employee.
     *
     * @return Builder<Employee>
     */
    public function query(): Builder
    {
        return $this->employee->newQuery();
    }

    /**
     * Retrieve all employees.
     *
     * @return Collection<int, Employee>|null
     */
    public function index(): ?Collection
    {
        return $this->employee->all();
    }

    /**
     * Create a new employee record.
     *
     * @param array<string, mixed> $data
     * @return Employee
     */
    public function create(array $data): Employee
    {
        return $this->employee->create($data);
    }

    /**
     * Get an employee by id.
     *
     * @param int $id
     * @return Employee|null
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function detail(int $id): ?Employee
    {
        return $this->employee->findOrFail($id);
    }

    /**
     * Update an existing employee and return the updated model.
     *
     * @param int $id
     * @param array<string, mixed> $data
     * @return Employee|null
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function update(int $id, array $data): ?Employee
    {
        $employee = $this->employee->findOrFail($id);
        $employee->update($data);
        return $employee;
    }

    /**
     * Delete an employee by id.
     *
     * @param int $id
     * @return bool True if deleted.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function delete(int $id): bool
    {
        $employee = $this->employee->findOrFail($id);
        return $employee->delete();
    }
}
