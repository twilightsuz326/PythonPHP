<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PythonFileController extends Controller
{
    public function savePythonCode(Request $request)
    {
        // バリデーション
        $request->validate([
            'filename' => 'required|string|max:255',
            'code' => 'required|string',
        ]);

        $directory = 'py';
        $filename = $request->input('filename') . '.py';
        $code = $request->input('code');

        // ファイルをstorageディレクトリに保存
        Storage::disk('local')->put($directory . '/' . $filename, $code);

        return response()->json(['message' => 'Python file saved successfully!'], 200);
    }
}
