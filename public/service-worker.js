// プッシュ通知を受け取ったときのイベント
self.addEventListener('push', function (event) {
  const data = event.data.json();
  const title = data.title || 'デフォルトのタイトル';
  const options = {
    body: data.body || 'デフォルトの本文',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: {
      url: data.url // URLを通知データに含める
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// プッシュ通知をクリックしたときのイベント
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data.url;
  event.waitUntil(
    // プッシュ通知をクリックしたときにブラウザを起動して表示するURL
    clients.openWindow(url)
  );
});


// Service Worker インストール時に実行される
// キャッシュするファイルとかをここで登録する
self.addEventListener('install', (event) => {
  console.log('service worker install ...');
});