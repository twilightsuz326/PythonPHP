<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PythonExecutionService;
use Exception;
use Symfony\Component\HttpFoundation\Response;

class PythonExecutionController extends Controller
{
    private $pythonExecutionService;

    public function __construct(PythonExecutionService $pythonExecutionService)
    {
        $this->pythonExecutionService = $pythonExecutionService;
    }

    /**
     * Pythonスクリプトをファイルから実行
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function executeFromFile(Request $request)
    {
        $validated = $request->validate([
            'filename' => 'required|string',
            'parameters' => 'array',
            'parameters.*' => 'string',
        ]);

        try {
            $output = $this->pythonExecutionService->executeFromFile(
                $validated['filename'],
                $validated['parameters'] ?? []
            );

            return response()->json([
                'success' => true,
                'output' => $output,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Pythonスクリプトをコードから実行
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function executeFromCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'parameters' => 'array',
            'parameters.*' => 'string',
        ]);

        try {
            $output = $this->pythonExecutionService->executeFromCode(
                $validated['code'],
                $validated['parameters'] ?? []
            );

            return response()->json([
                'success' => true,
                'output' => $output,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
