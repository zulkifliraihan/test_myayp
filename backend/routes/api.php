<?php

use App\Http\Controllers\EmployeeController;

Route::resource('employees', EmployeeController::class)->except(['create', 'store', 'show', 'edit', 'destroy']);