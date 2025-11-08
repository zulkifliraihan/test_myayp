<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(private EmployeeService $employeeService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse       
    {
        try {
            $service = $this->employeeService->getAll($request->all());
            if ($service['status']) {
                return $this->success($service['response'], $service['data']);
            }
            return $this->errorServer($service['errors'] ?? ['Unexpected error']);
        } catch (\Throwable $th) {
            return $this->errorServer($th->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, string $id): JsonResponse
    {
        try {
            $service = $this->employeeService->update((int) $id, $request->validated());
            if ($service['status']) {
                return $this->success($service['response'], $service['data']);
            }
            if (($service['response'] ?? null) === 'not-found') {
                return $this->errorNotFound($service['errors'] ?? ['Task not found']);
            }
            return $this->errorServer($service['errors'] ?? ['Unexpected error']);
        } catch (\Throwable $th) {
            return $this->errorServer($th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
