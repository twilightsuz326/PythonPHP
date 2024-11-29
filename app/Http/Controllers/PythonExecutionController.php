<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class PythonExecutionController extends Controller
{
    public function executePythonFile(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'parameters' => 'nullable|array',
        ]);

        $filename = $request->input('filename');
        $parameters = $request->input('parameters', []);

        $filePath = storage_path('app/py/' . $filename);

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        // 引数をUTF-8に変換（必要に応じて）
        $encodedParameters = array_map(function ($param) {
            return mb_convert_encoding($param, 'UTF-8', 'auto');
        }, $parameters);

        // エスケープせずにそのまま渡す
        $command = array_merge(['python3', $filePath], $encodedParameters);

        $process = new Process($command);
        $process->run();

        if (!$process->isSuccessful()) {
            return response()->json(['error' => $process->getErrorOutput()], 500);
        }

        return response()->json(['output' => $process->getOutput()]);
    }
}
