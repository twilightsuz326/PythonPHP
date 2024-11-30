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

        $command = array_merge(['python3', $filePath], $parameters);

        // LANG環境変数を設定して日本語入力を可能にする
        $process = new Process($command);
        $process->setEnv(['LANG' => 'en_US.UTF-8']);
        $process->run();

        if (!$process->isSuccessful()) {
            return response()->json(['error' => $process->getErrorOutput()], 500);
        }

        return response()->json(['output' => $process->getOutput()]);
    }
}
