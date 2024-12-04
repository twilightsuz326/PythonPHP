<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PythonFileService
{
    private $directory = 'py';

    // ファイルリストを取得
    public function getFileList()
    {
        $dirpath = storage_path('app/' . $this->directory);
        $files = array_diff(scandir($dirpath), ['.', '..']); // pyフォルダ内のファイル一覧を取得

        // .pyファイルのみを抽出
        $files = array_filter($files, function ($file) {
            return pathinfo($file, PATHINFO_EXTENSION) === 'py';
        });

        return array_values($files);
    }

    // ファイルを保存
    public function savePythonCode($filename, $code)
    {
        if (Storage::exists($this->directory)) {
            Storage::makeDirectory($this->directory);
        }

        try{
            $path = $this->directory . '/' . $filename . '.py';
            Storage::put($path, $code);
        } catch (Exception $e) {
            Log::error("(Save Python Code) Error: " . $e->getMessage());
            throw new Exception('Failed to save file');
        }
    }

    // 指定されたファイルの内容を取得
    public function getFileContent($file)
    {
        $path = $this->directory . '/' . $file;

        if (!Storage::exists($path)) {
            throw new \Exception('File not found');
        }

        return Storage::get($path);
    }

}
