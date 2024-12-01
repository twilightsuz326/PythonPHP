# PHP内でサーバー内のPythonを実行する

## Overview
- Laravel 10 + React + Sanctum でのログイン実装し、サーバー内のPythonを実行する

## Install
```bash
(.envファイル作成)
composer install
npm install
```

## cron setting
```bash
# php バージョンを指定する場合は、/opt/php-*.*.*/bin/phpを指定する
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```