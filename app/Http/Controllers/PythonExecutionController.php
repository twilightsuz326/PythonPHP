<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PythonExecutionService;

class PythonExecutionController extends Controller
{
    protected $pythonExecutionService;

    public function __construct(PythonExecutionService $pythonExecutionService)
    {
        $this->pythonExecutionService = $pythonExecutionService;
    }

    public function executePythonFile(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'parameters' => 'nullable|array',
        ]);

        try {
            $output = $this->pythonExecutionService->execute(
                $request->input('filename'),
                $request->input('parameters', [])
            );

            return response()->json(['output' => $output]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
