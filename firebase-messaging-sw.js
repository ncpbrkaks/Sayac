```javascript:firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA2-rUtVFadlncw_TPBK53qiLMVKhYKa6k",
    authDomain: "sayac-82f63.firebaseapp.com",
    databaseURL: "https://sayac-82f63-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sayac-82f63",
    messagingSenderId: "210348694246",
    appId: "1:210348694246:web:d45a93372c2e406296f927"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965306.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
