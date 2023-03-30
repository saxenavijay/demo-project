var admin = require('firebase-admin');

const fcm = {};

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

fcm.sendNotificationByToken = async function sendNotificationByToken(message) {
        admin.messaging().send(message)
            .then(response => {
                console.log("fcm ---> sent");
            })
            .catch(error => {
                console.log(error);
            });
}

module.exports = fcm;