<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PythonFileService;
use Illuminate\Support\Facades\Storage;


class PythonFileController extends Controller
{
    private $pythonFileService;

    public function __construct(PythonFileService $pythonFileService)
    {
        $this->pythonFileService = $pythonFileService;
    }

    public function savePythonCode(Request $request)
    {
        // バリデーション
        $validated = $request->validate([
            'filename' => 'required|string',
            'code' => 'required|string',
        ]);

        try {
            $this->pythonFileService->savePythonCode($validated['filename'], $validated['code']);
            return response()->json(['message' => 'File saved successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save file'], 500);
        }
    }

    public function listPythonFiles()
    {
        $filelist = $this->pythonFileService->getFileList();
        return response()->json(['files' => $filelist], 200);
    }

    // 指定ファイルの内容を取得
    public function getFile($file)
    {
        try {
            $content = $this->pythonFileService->getFileContent($file);
            return response()->json(['code' => $content], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

}
