<?php

namespace App\Services;

use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class PythonExecutionService
{
    /**
     * Pythonスクリプトを実行
     *
     * @param string $filename 実行するPythonスクリプトのファイル名
     * @param array $parameters スクリプトに渡すパラメータ
     * @return string スクリプトの出力
     * @throws ProcessFailedException
     */
    public function execute(string $filename, array $parameters = []): string
    {
        $filePath = storage_path('app/py/' . $filename);

        if (!file_exists($filePath)) {
            throw new \RuntimeException('Python script file not found: ' . $filePath);
        }

        $command = array_merge([getenv('PYTHON_PATH'), $filePath], $parameters);

        $process = new Process($command);

        $pypath = public_path() . '/../storage/app/py';

        // 作業ディレクトリを設定
        $process->setWorkingDirectory($pypath);

        // 環境変数を設定
        $process->setEnv([
            'LANG' => 'en_US.UTF-8', // 日本語入力可能にする
            'PYTHONPATH' => getenv('RYE_PATH'), // PYTHONPATH の設定
        ]);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        return $process->getOutput();
    }
}
