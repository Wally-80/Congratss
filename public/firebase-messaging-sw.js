importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD0jMhBM07_EYroLR2pJmv59hR207gbrqo",
    authDomain: "gratzz.firebaseapp.com",
    projectId: "gratzz",
    storageBucket: "gratzz.firebasestorage.app",
    messagingSenderId: "1051507062109",
    appId: "1:1051507062109:web:758638b4b4a86c392764b4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || "New Message";
    const notificationOptions = {
        body: payload.notification?.body,
        icon: '/pwa-192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
