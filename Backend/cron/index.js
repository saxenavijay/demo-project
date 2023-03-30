const cron = require("node-cron");
const mongoose = require("mongoose");
const moment = require("moment");
const Message = require("../models/message.model");
const Instance = require("../models/instance.model");
const Campaign = require("../models/campaign.model");

const { WhatsAppInstance } = require("../class/instance");

const fs = require("fs");
const path = require("path");

// var admin = require("firebase-admin");
// var db = admin.database();

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

function randomRange(myMin, myMax) {
  return Math.floor(
    Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
  );
}

function sleepTask() {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      process.env.NODE_ENV == "prod"
        ? randomRange(process.env.MIN_INTERVAL, process.env.MAX_INTERVAL)
        : randomRange(1000, 2000)
    );
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

const loadSessions =  async function () {
 
  console.log("loadSessions start");

    if (process.env.NODE_ENV == "prod") {

      const instances = await Instance.find({
        // status: 'Ready',
        isDeleted: { $ne: true },
        $or:[ {status:'Ready'}, {status:'connectionReplaced'} ],
      });

      await asyncForEach(instances, async (instance) => {

        await sleep(1000);

        if (instance) {
          await createSession(instance._id, instance.userId);
        } else {
          deleteSession(instance._id);
        }

      });

      sessionLoadCompleted = true;

    } else {
      console.log("Test instance start");

      const instances = await Instance.find({
        userId: process.env.TEST_USER,
        isDeleted: { $ne: true },
      });

      asyncForEach(instances, async (instance) => {
        if (instance) {
          createSession(instance._id, instance.userId);
        } else {
          console.log("Test instance not found");
        }
      });
    }
};

const createSession = async function (id, user_id) {
  try {
    console.log("Creating session: " + id + ", userId - " + user_id);

    const key = id;
    const webhook = false;

    const instance = new WhatsAppInstance(key, user_id, webhook);
    const data = await instance.init();
    console.log("instance data - " + data);
    WhatsAppInstances[id] = instance;

    if (process.env.NODE_ENV != "prod") {
      //instance.logContacts();
    }

    return instance;
  } catch (e) {
    console.log("createSession error - " + e);
  }
};

function deleteSession(instanceId) {
  try {

    fs.unlink(
      path.join(__dirname, `../sessions/${instanceId}.json`),
      function (err) {
        if (err && err.code == "ENOENT") {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          console.error("Error occurred while trying to remove file");
        } else {
          console.info(`removed`);
        }
      }
    );
  } catch (e) {
    console.log("delete session error - " + error);
  }
}

//cron.schedule("* * * * *", async () => {
cron.schedule("*/10 * * * * *", async () => {
  //check schedule message
  console.log("================== Check Campaigns ==================");
  var now = new Date();

  const campaigns = await Campaign.find({
    isSchedule: true,
    schedule: { $lte: now },
    status: { $eq: 0 },
  });

  if (campaigns) {
    console.log("cron - campaign found - " + campaigns.length);

    asyncForEach(campaigns, async (campaign) => {
      console.log("cron - campaign - " + campaign.id + " start");

      var instances = campaign.instances;
      var instanceIndex = 0;
      var instanceId = "";

      if (campaign.multi) {
        //instances = await Instance.find({ userId: campaign.userId });
        console.log("instances - " + instances.length);
      } else {
        instanceId = campaign.instanceId;
      }

      await Campaign.updateOne({ _id: campaign.id }, { $set : {status: 1} });

      //campaign.numbers.forEach(async (data) => {
      asyncForEach(campaign.numbers, async (data) => {
        const number = data.number.replace("+", ""); //phoneNumberFormatter(data.number);
        var status = 0;

        console.log(number);

        const isValidNumber = isNumber(number);
        if (isValidNumber) {
          if (campaign.multi) {
            if (instanceIndex == instances.length) {
              instanceIndex = 0;
            }

            //random instance
            const instance = instances[instanceIndex];

            console.log("instance = " + instance);
            console.log("instance Index = " + instanceIndex);

            instanceId = instance;
            instanceIndex++;
          }

          console.log("instance Id = " + instanceId);

          const instanceData = await Instance.findOne({
            _id: instanceId,
            userId: user.id,
            isDeleted: { $ne: true },
          });

          const m = await Message.insert({
            instanceId: instanceId,
            instanceNumber: instanceData.number??"",

            userId: campaign.userId,
            campaignId: campaign.id,

            message: campaign.message,
            number: number,

            type: campaign.type,

            button1: campaign.button1,
            button2: campaign.button2,
            button3: campaign.button3,

            middle: campaign.middle,
            footer: campaign.footer,
            button: campaign.button,

            menus: campaign.menus,
            callButton: campaign.callButton,
            callingNumber: campaign.callingNumber,

            webUrlButton: campaign.webUrlButton,
            webUrl: campaign.webUrl,

            caption: campaign.caption ?? "",
            media: campaign.media ?? "",
            fileType: campaign.fileType ?? "",
            fileName: campaign.fileName ?? "",
          });
        } else {
          inValidNumber++;
        }
      });
    });
  } else {
    console.log("cron - campaigns not found");
  }
});

cron.schedule("* * * * *", async () => {
  console.log("================== Check Pending Messages ==================");

  try {
    var now = new Date();

    //if (sessionLoadCompleted) {

    console.log("will execute every minute until stopped");

    var last24Hours = moment().utc().subtract(24, "hours").toDate();

    var filter = {
      status: "Ready",
      isDeleted: { $ne: true },
      expire: { $gte: now },
    };

    if (process.env.NODE_ENV != "prod") {
      filter = {
        _id: process.env.TEST_INSTANCE,
        isDeleted: { $ne: true },
        expire: { $gte: now },
      };
    }

    //get all instance
    const instances = await Instance.find(filter);

    if (instances) {
      console.log("cron - instances found - " + instances.length);

      instances.forEach(async (instance, i) => {
        if (!instance.expire) {
          var currentDate = Date.now();
          var nextPaymentDate = moment(currentDate);
          nextPaymentDate.add(365, "days").format("YYYY-MM-DD hh:mm");
          instance.expire = nextPaymentDate;
          await instance.save();
        }

        console.log(
          "cron - instances - " +
            instance._id +
            " started, status - " +
            instance.status
        );

        const client = await WhatsAppInstances[instance._id];

        if (client) {
          const messages = await Message.find({
            status: 0,
            instanceId: instance._id,
            autoReply: {
              $ne: true,
            },
            createdAt: { $gte: last24Hours },
          })
            .sort({
              createdAt: "asc",
            })
            .skip(0)
            .limit(Number(process.env.MESSAGE_LIMIT));

          if (messages) {
            // if(instance.status == "connectionLost"){
            //   await createSession(instance._id, instance.userId);
            // }

            console.log("cron - messages found - " + messages.length);

            //messages.forEach(async (message,i) => {
            asyncForEach(messages, async (message) => {
              console.log(
                "cron - messages - " + message.id + " - sending start"
              );

              if (isNumber(message.number)) {
                await sleepTask();

                if (client) {
                  console.log(
                    "cron - messages - " + message.id + " - client found"
                  );

                  var status = 0;

                  if (
                    (message.type == 1 ||
                      message.type == 3 ||
                      message.type == 5) &&
                    message.media
                  ) {
                    console.log(
                      "cron - messages - " +
                        message.id +
                        "media found - " +
                        message.media
                    );

                    const result = await client.sendMediaFile3(
                      message.number,
                      message.media,
                      message.fileType,
                      message.fileName,
                      message.caption
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                  } else {
                    console.log(
                      "cron - messages - " + message.id + " no media found "
                    );
                  }

                  if (message.type == 0 || message.type == 1) {
                    const result = await client.sendTextMessage(
                      message.number,
                      message.message
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                    //text with media
                  } else if (message.type == 2 || message.type == 3) {
                    var buttons = [];

                    if (message.button1 != "") {
                      buttons.push({
                        type: "replyButton",
                        title: message.button1,
                      });
                    }

                    if (message.button2 != "") {
                      buttons.push({
                        type: "replyButton",
                        title: message.button2,
                      });
                    }

                    if (message.button3 != "") {
                      buttons.push({
                        type: "replyButton",
                        title: message.button3,
                      });
                    }

                    const btndata = {
                      text: message.message,
                      buttons: buttons,
                      footerText: message.footer,
                    };

                    const result = await client.sendButtonMessage(
                      message.number.trim(),
                      btndata
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    //Action Button
                  } else if (message.type == 4 || message.type == 5) {
                    var buttons = [];

                    if (message.callButton != "") {
                      buttons.push({
                        type: "callButton",
                        title: message.callButton,
                        payload: message.callingNumber,
                      });
                    }

                    if (message.webUrlButton != "") {
                      buttons.push({
                        type: "urlButton",
                        title: message.webUrlButton,
                        payload: message.webUrl,
                      });
                    }

                    const btndata = {
                      text: message.message,
                      buttons: buttons,
                      footerText: message.footer,
                    };

                    const result = await client.sendButtonMessage(
                      message.number,
                      btndata
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    //List / Menu
                  } else if (message.type == 6) {
                    var menuList = [];

                    message.menus.forEach((menuItem, i) => {
                      if (menuItem) {
                        menuList.push({
                          title: menuItem.title ?? "",
                          description: menuItem.description ?? "",
                          rowId: "menu-" + i,
                        });
                      }
                    });

                    const listData = {
                      buttonText: message.button,
                      text: message.middle,
                      title: "",
                      description: message.footer,
                      sections: [
                        {
                          title: message.message,
                          rows: menuList,
                        },
                      ],
                      listType: 0,
                    };

                    const result = await client.sendListMessage(
                      message.number,
                      listData
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                  } else {
                  }

                  //change status
                  //m.status = status;
                  //await m.save();
                  console.log(
                    "cron - messages - " +
                      message.id +
                      " - completed with status - " +
                      status
                  );
                  await Message.updateOne(
                    { _id: message.id },
                    { $set : {status: status} }
                  );

                  //send media
                  /* if (type == 1 || type == 3 || type == 5) {
            var filePath = req.files.media.tempFilePath;
            console.log("file path - " + filePath);
            console.log("file name - " + req.files.media.name);
            console.log("file mimetype - " + req.files.media.mimetype);
            console.log("file size - " + req.files.media.size);
    
            const fileType = req.files.media.mimetype.split("/")[0];
            const result = await client.sendMediaFile2(
              number,
              req.files.media,
              fileType,
              caption
            );
    
          } */
                } else {
                  console.log(
                    "cron - messages - " + message.id + " - client not found"
                  );
                  await Message.updateOne({ _id: message.id }, { $set:{status: 3} });
                }
              } else {
                console.log(
                  "cron - messages - " +
                    message.id +
                    " - number(" +
                    message.number +
                    ") is invalid"
                );
                await Message.updateOne({ _id: message.id }, { $set : {status: 4} });
              }
            });
          }
        }
      });
    } else {
      console.log("cron - instances not founds");
    }
    //}
  } catch (e) {
    console.log("catch exception on cron - " + e);
  }
});

cron.schedule("00 1 * * *", async () => {
  console.log("cron test");
});

cron.schedule("0 0 */1 * * *", async () => {
  console.log("cron test every 1 hour");
   loadSessions();
});

loadSessions();
