'use strict';
// const publicKey = 'BDFhBVNEfR6hKdJJwCrVfpNVAYKjMx98348oDJWV0dwzWPG2EQ96KvzqNZznODtQy52FIf5mwpM6BbInl3hRTb0'; // node.js backend
const publicKey = 'BN89qhMbaD8a7LllEg-6QBOfar02XVRH87vRnYXCbGKfOurOOLoj-Nl1KpvshwtXNoGi-R0piPLb1n_7Pd-eNgE'; // c# api other laptop
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const getAllSubs = async () => {
  const API_SERVER_URL = 'https://localhost:7153/api/Notification/all'
  const response = await fetch(API_SERVER_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).catch(err => console.error('get all call failed', err))
  return response?.json();
}

const saveSubscription = async subscription => {
  if (subscription) {
    const allsubs = await getAllSubs();
    if (allsubs?.find(s => s.endpoint == subscription.endpoint)) {
      console.log('a subscription with this endpoint has already been saved');
      return;
    }
    console.log('saving the subscription', subscription);
    // const SERVER_URL = 'http://localhost:4000/save-subscription'
    // const response = await fetch(SERVER_URL, {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(subscription),
    // })

    const API_SERVER_URL = 'https://localhost:7153/api/Notification/subscribe'
    const body = {
      endpoint: subscription.endpoint,
      p256dh: subscription.toJSON().keys.p256dh,
      auth: subscription.toJSON().keys.auth
    };
    const response = await fetch(API_SERVER_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).catch(err => console.error('subscribe call failed', err))
    return response.json()
  }
  console.log('not saving because no subscription');
  return;
}

self.addEventListener('activate', async () => {
  console.log('sw activated');
  try {
    console.log('subscribing with public key');
    const applicationServerKey = urlB64ToUint8Array(publicKey);
    const opt = { applicationServerKey, userVisibleOnly: true };
    const sub = await self.registration.pushManager.subscribe(opt);
    console.log('sub', JSON.stringify(sub));
    const response = await saveSubscription(sub);
    console.log('post /subscribe response', response);
  } catch (err) {
    console.error('ERROR in sw activate', err);
  }
});

self.addEventListener('push',
  (event) => {
    if (event.data) {
      console.log('push received', event.data.json());
      showLocalNotification(event.data.json().Title, event.data.json().Message, self.registration);
    }
    else {
      console.log('push received but no data');
    }
  },
  (err) => console.error('push NOT received'));


const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body: body
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};

/* PUSH SERVICE
* --------------------------------------------
*
* receives network request, validates it and delivers push message to appropriate browser (if browser offline, message queued until back online)
*/



// THE KEYS
// -------------------------------------------
// Public Key:
// BDFhBVNEfR6hKdJJwCrVfpNVAYKjMx98348oDJWV0dwzWPG2EQ96KvzqNZznODtQy52FIf5mwpM6BbInl3hRTb0

// Private Key:
// flJTVtWLMiYzfG4cLO133opRE_1JQ527K7TaVDyHEK4


// ---- API OTHER LAPTOP
// PUBLIC KEY: BN89qhMbaD8a7LllEg-6QBOfar02XVRH87vRnYXCbGKfOurOOLoj-Nl1KpvshwtXNoGi-R0piPLb1n_7Pd-eNgE
