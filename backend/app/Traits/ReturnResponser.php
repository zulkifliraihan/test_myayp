<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

trait ReturnResponser
{
    /**
     * Return a success JSON response.
     *
     * @param string $response
     */
    protected function success($response, $data = null, ?string $message = null, $redirect = null, ?int $code = null): JsonResponse
    {
        $messagesFormat = [
            'created'    => [201, 'Data successfully created!'],
            'updated'    => [200, 'Data successfully updated!'],
            'deleted'    => [200, 'Data successfully deleted!'],
            'uploaded'   => [200, 'Data successfully uploaded!'],
            'ongoing-upload' => [200, 'Data successfully ongoing upload!'],
            'downloaded' => [200, 'Data successfully downloaded!'],
            'searched'   => [200, 'Data successfully searched!'],
            'get'        => [200, 'Data successfully get!'],
        ];

        [$code, $messageNew] = $messagesFormat[$response] ?? [200, $message ?? 'Successfully Action!'];

        $message = $message ?? $messageNew;

        $return = [
            'response_code'   => $code,
            'response_status' => 'successfully-' . $response,
            'message'         => $message,
            'data'            => $data,
            'redirect'        => $redirect,
        ];

        return response()->json($return, $code);

    }

    /**
     * Return an error Validator JSON response.
     *
     * @param string            $message
     * @param array|string|null $data
     */
    protected function errorValidator(string|array|object|null $errors = null, $message = null, int $code = 422): JsonResponse
    {
        if (! $message) {
            $message = 'Error! The request not expected!';
        }

        return response()->json([
            'response_code'   => $code,
            'response_status' => 'failed-validation',
            'message'         => $message,
            'errors'          => $errors,
        ], $code);
    }

    /**
     * Return an error Not Found JSON response.
     *
     * @param string            $message
     * @param array|string|null $data
     */
    protected function errorNotFound(string|array|object|null $errors = null, $message = null, int $code = 404): JsonResponse
    {
        if (!$message) {
            $message = 'Error! The resource not found!';
        }

        return response()->json([
            'response_code'   => $code,
            'response_status' => 'failed-not-found',
            'message'         => $message,
            'errors'          => $errors,
        ], $code);
    }

    /**
     * Return an error authentication JSON response.
     * Can be used for authentication errors or authorization errors.
     */
    protected function errorAuthentication($errors, $message = null, int $code = 401): JsonResponse
    {
        return response()->json([
            'response_code'   => $code,
            'response_status' => 'failed-authentication',
            'message'         => $message ?? 'Error! The authentication failed!',
            'errors'          => $errors,
        ], $code);
    }

    /**
     * Return an error Code JSON response.
     */
    protected function errorServer($errors, $message = null, int $code = 400): JsonResponse
    {
        Log::error($errors);

        return response()->json([
            'response_code'   => $code,
            'response_status' => 'failed-server',
            'message'         => $message ?? 'Internal Server Error!',
            'errors'          => $errors,
        ], $code);
    }
}
