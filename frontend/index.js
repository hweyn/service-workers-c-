// https://medium.com/@a7ul/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679

// -- REGISTER AND REQUEST PERMISSION --
const registerSWAndRequestPermission = async () => { 
    check();
    await registerServiceWorker().then(async swRegistration => {
        console.log('registering sw succeeded', swRegistration);
        await requestNotificationPermission().then(permission => {
            showLocalNotification('Registration permission: ', permission, swRegistration);
        })
    })
}

const check = () => {
    console.log('checking sw and pushmanager support');
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
    console.log('sw and pushmanager support is ok');
}

const registerServiceWorker = async () => {
    console.log('registering sw');
    const swRegistration = await navigator.serviceWorker.register('sw.js');
    return swRegistration;
}

const requestNotificationPermission = async () => {
    console.log('requesting notification permission');
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    }
    return permission;
}

// -- SUBSCRIBE --
const subscribeAndSaveSubscription = async ()  => {

}

// -- PUSH TO SAVED SUBSCRIPTIONS (api) -- 
const pushToSubscriptions = async () => {
    console.log('testing push via api');
    const body = {
        title: 'bericht van de api',
        message: 'api zegt: dit lukt!',
        url: 'www.google.com'
    };
    const API_SERVER_URL = 'https://localhost:7153/api/Notification/broadcast';
    const response = await fetch(API_SERVER_URL, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) 
    }).catch((err) => console.error('call broadcast failed'));
    return response
}

const showLocalNotification = (title, body, swRegistration) => {
    console.log('showing local notification');
    const options = {
        body
    };
    swRegistration.showNotification(title, options);
}

/* *********************************
* INFO
************************************ 
*
* MAIN JS THREAD (index.js)
* runs when we are browing web page with javascript
* should only be used for ui stuff (DOM/asking permission)
*
* WORKER THREAD (sw.js)
* independent js thread, runs in the background, even when page has been closed
* should be used for listening for events and showing the notifications
*/

