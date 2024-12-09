// backend/scripts/generateVapidKeys.js
import webPush from 'web-push';
import fs from "fs";

const vapidKeys = webPush.generateVAPIDKeys();

const configContent = `export default {
  publicKey: '${vapidKeys.publicKey}',
  privateKey: '${vapidKeys.privateKey}'
};`;

fs.writeFileSync('../Config/vapidKeys.js', configContent);

console.log('VAPID Keys generated:');
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);