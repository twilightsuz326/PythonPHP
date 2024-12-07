<?php

namespace App\Services;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class PythonExecutionService
{
    /**
     * Pythonスクリプトをファイルから実行
     *
     * @param string $filename 実行するPythonスクリプトのファイル名
     * @param array $parameters スクリプトに渡すパラメータ
     * @return string スクリプトの出力
     * @throws ProcessFailedException|\RuntimeException
     */
    public function executeFromFile(string $filename, array $parameters = []): string
    {
        $filePath = storage_path('app/py/' . $filename);

        if (!file_exists($filePath)) {
            throw new \RuntimeException('Python script file not found: ' . $filePath);
        }

        return $this->runPythonCommand($filePath, $parameters);
    }

    /**
     * Pythonスクリプトを直接コードから実行
     *
     * @param string $code Pythonコード
     * @param array $parameters スクリプトに渡すパラメータ
     * @return string スクリプトの出力
     * @throws ProcessFailedException
     */
    public function executeFromCode(string $code, array $parameters = []): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'py_') . '.py';

        file_put_contents($tempFile, $code);

        try {
            return $this->runPythonCommand($tempFile, $parameters);
        } finally {
            unlink($tempFile);
        }
    }

    /**
     * 実行処理
     *
     * @param string $filePath スクリプトファイルパス
     * @param array $parameters 実行パラメータ
     * @return string
     * @throws ProcessFailedException
     */
    private function runPythonCommand(string $filePath, array $parameters): string
    {
        $pythonPath = getenv('PYTHON_PATH') ?: 'python';
        $command = array_merge([$pythonPath, $filePath], $parameters);

        $process = new Process($command);

        // 環境設定
        $process->setWorkingDirectory(storage_path('app/py'));
        $process->setEnv([
            'LANG' => 'en_US.UTF-8',
            'PYTHONPATH' => getenv('RYE_PATH'),
        ]);

        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        return $process->getOutput();
    }
}
