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

## rye setting
* レンタルサーバーのため、Pythonのパッケージ管理にはryeを使用。
```bash
# ryeのインストール後
rye init
rye add requests
rye add beautifulsoup4

# Python・パッケージのパスを.envに追加
PYTHON_PATH="***/.rye/shims/python3"
RYE_PATH="***/.venv/lib/python3.12/site-packages"
```

## npm run dev Error Troubleshooting
```bash
lsof -i:3000
kill [PID]
```

## Design Reference
- [https://elstar.themenate.net/app/project/project-list](https://elstar.themenate.net/app/project/project-list)
- [https://v-dashboard.vercel.app/dashboard](https://v-dashboard.vercel.app/dashboard)