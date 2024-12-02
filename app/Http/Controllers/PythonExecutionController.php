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

        $command = sprintf(
            'cd %s && '. getenv('PYTHON_PATH').' %s %s',
            public_path(),
            escapeshellarg($filePath),
            implode(' ', array_map('escapeshellarg', $parameters))
        );

        // シェルコマンドのプロセスを生成
        $process = Process::fromShellCommandline($command);

        // 環境変数を設定
        $process->setEnv([
            'LANG' => 'en_US.UTF-8', // 日本語出力用に設定
            'PYTHONPATH' => getenv('RYE_PATH'), // PYTHONPATH の設定
        ]);
        $process->run();

        if (!$process->isSuccessful()) {
            return response()->json(['error' => $process->getErrorOutput()], 500);
        }

        return response()->json(['output' => $process->getOutput()]);
    }
}
