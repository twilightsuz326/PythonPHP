/**
 * サービスワーカーの登録
 */
self.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        window.sw = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    }
});


/**
 * WebPushを許可する仕組み
 */
async function allowWebPush() {
    if ('Notification' in window) {
        let permission = Notification.permission;

        if (permission === 'denied') {
            alert('Push通知が拒否されているようです。ブラウザの設定からPush通知を有効化してください');
            return false;
        } else if (permission === 'granted') {
            alert('すでにWebPushを許可済みです');
            return false;
        }
    }
    // 取得したPublicKey
    const appServerKey = 'BG2oy-kIg6_wnQpgXqVeEK23KKyTPZ3xoKkfznVGJftG7rrHGtgEaV32hGj0_e5SamR83GXHSrFtDd7zSptljKs';
    const applicationServerKey = urlB64ToUint8Array(appServerKey);

    // push managerにサーバーキーを渡し、トークンを取得
    let subscription = undefined;
    try {
        subscription = await window.sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
        });
    } catch (e) {
        alert('Push通知機能が拒否されたか、エラーが発生しましたので、Push通知は送信されません。');
        return false;
    }


    // 必要なトークンを変換して取得（これが重要！！！）
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');
    const request = {
        device_name: subscription.endpoint,
        app_name: "pythonphp",
        endpoint: subscription.endpoint,
        public_key: btoa(String.fromCharCode.apply(null, new Uint8Array(key))),
        auth_token: btoa(String.fromCharCode.apply(null, new Uint8Array(token)))
    };

    console.log(request);

    // トークンをサーバーに送信する
    fetch('https://notify.jwest.jp/api/push_token', {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('サーバーへのリクエストに失敗しました');
        }
        alert('通知設定完了しました。');
    }).catch(error => {
        console.error('サーバー送信エラー:', error);
    });
}

/**
 * トークンを変換するときに使うロジック
 * @param {*} base64String 
 */
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * 既存のエンドポイントを取得する
 */
async function getExistingSubscription() {
    let subscription = await window.sw.pushManager.getSubscription();
    if (!subscription) {
        return false;
    }
    return subscription;
}