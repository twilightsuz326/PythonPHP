<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>PythonPHP</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

    <!-- アドレスバー等のブラウザのUIを非表示 -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <!-- default（Safariと同じ） / black（黒） / black-translucent（ステータスバーをコンテンツに含める） -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <!-- ホーム画面に表示されるアプリ名 -->
    <meta name="apple-mobile-web-app-title" content="WebPusher">
    <!-- ホーム画面に表示されるアプリアイコン -->
    <link rel="apple-touch-icon" href="icon-152x152.png">

    <!-- ウェブアプリマニフェストの読み込み -->
    <link rel="manifest" href="/manifest.json">

    <script defer src='/service-worker.js'></script>
    <script src='/js/webpush.js'></script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body>
    <div id="app"></div>
</body>

</html>