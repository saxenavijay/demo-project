//https://github.com/adiwajshing/Baileys
const Contact = require("../models/contact.model");

const User = require("../models/user.model");
const Auth = require("../models/auth.model");
const Message = require("../models/message.model");
const ReceivedMessage = require("../models/received.message.model");
const Instance = require("../models/instance.model");
const AutoReply = require("../models/auto-reply.model");
const Template = require("../models/template.model");
const Campaign = require("../models/campaign.model");
const { WhatsAppInstance } = require("../class/instance");
const { ObjectId } = require("mongodb");
const axios = require("axios");
const moment = require('moment');


const { phoneNumberFormatter } = require("../utils/formatter");

const { nanoid } = require("nanoid");

// const counterUtil = require("../utils/counterUtils");

const fs = require("fs");
const path = require("path");
const qrcodeTerminal = require("qrcode-terminal");
const qrcode = require("qrcode");
const { findOne } = require("../models/contact.model");

const multiSessions = [];
const SESSIONS_FILE = "./whatsapp-sessions.json";

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

const loadSessions = async function () {

  console.log("loadSessions start");

  if (process.env.NODE_ENV === "prod") {

    const instances = await Instance.find({
      status: 'Ready',
      isDeleted: { $ne: true },
    });

    await asyncForEach(instances, async (instance) => {

      await sleep(1000);

      if (instance) {
        await createSession(instance.id, instance.userId);
      } else {
        deleteSession(instance.id);
      }

    });

    const sessionLoadCompleted = true;

  } else {
    console.log("Test instance start");

    const instances = await Instance.find({
      userId: process.env.TEST_USER,
      isDeleted: { $ne: true },
    });

    asyncForEach(instances, async (instance) => {
      if (instance) {
        createSession(instance.id, instance.userId);
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
    const webhook = true;


    const instance = new WhatsAppInstance(key, user_id, webhook);
    const data = await instance.init();
    console.log("instance data - " + data);
    WhatsAppInstance[id] = instance;

    if (process.env.NODE_ENV !== "prod") {
      //instance.logContacts();
    }

    return instance;
  } catch (e) {
    console.log("createSession error - " + e);
  }
};

exports.qr = async (req, res, next) => {
  try {
    const instanceId = req.body.instance_id;
    //delete old session file
    deleteSession(instanceId);

    //create new session
    await createSession(instanceId, req.body.user_id);
    // const qrcode = await WhatsAppInstance[instanceId].instance.qr;
    // res.send({
    //     qrcode: qrcode,
    // })
    const user = await Instance.findOne({ userId: req.body.user_id });
    await sleep(2500);
    const { qr } = await Instance.findOne({ _id: instanceId });
    return res.status(200).json({
      status: true,
      qrcode: qr,
      user: user,
    });

  } catch (e) {
    console.log("qr error - " + e);
  }


};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function randomRange(myMin, myMax) {
  return Math.floor(
    Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
  );
}

function sleepTask() {
  return new Promise((resolve) => {
    setTimeout(resolve, randomRange(100, 1000));
  });
}
// instance_id gAAlCbu98XKlcBby
// user_id LBb5dsHfsnviKohk
exports.send2 = async (req, res, next) => {

  const user = await User.findOne({});
  req.body.user_id = user._id;

  console.log("send2 body - " + JSON.stringify(req.body));
  console.log("send2 body instance_id - " + req.body.instance_id);
  console.log("send2 user_id - " + req.body.user_id);



  const sender = req.body.instance_id;

  const name = req.body.name;
  const type = req.body.type;

  const message = req.body.message;
  const b1 = req.body.button_1;
  const b2 = req.body.button_2;
  const b3 = req.body.button_3;

  const button = req.body.button;
  const middle = req.body.middle;
  const footer = req.body.footer;

  const call_button = req.body.call_button;
  const calling_number = req.body.calling_number;
  const web_url_button = req.body.web_url_button;
  const web_url = req.body.web_url;
  const caption = req.body.caption ?? "";
  const is_schedule = req.body.is_schedule ?? false;
  const schedule = req.body.schedule ?? null;

  if (is_schedule && !schedule) {
    return res
      .status(200)
      .json({ status: false, message: "Schedule Datetime is missing" });
  } else if (!message) {
    return res
      .status(200)
      .json({ status: false, message: "Message text is missing" });
  } else if (!req.body.numbers) {
    return res
      .status(200)
      .json({ status: false, message: "Phone numbers is missing" });
  } else if (!testJSON(req.body.numbers)) {
    return res
      .status(200)
      .json({ status: false, message: "Phone numbers list is invalid" });
  } else if (JSON.parse(req.body.numbers).length == 0) {
    return res.status(200).json({
      status: false,
      message: "Phone numbers list can't be empty",
    });
  } else if (!type) {
    return res
      .status(200)
      .json({ status: false, message: "Message type is missing" });
  } else if (type == 2) {
    if (!b1) {
      return res
        .status(200)
        .json({ status: false, message: "Button 1 text is missing" });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    }
  } else if (type == 4) {
    if (!call_button) {
      return res
        .status(200)
        .json({ status: false, message: "Call Button text is missing" });
    } else if (!calling_number) {
      return res
        .status(200)
        .json({ status: false, message: "Calling number is missing" });
    } else if (!web_url_button) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url Button text is missing" });
    } else if (!web_url) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url is missing" });
    }
  } else if (type == 6) {
    if (!req.body.menus) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is missing" });
    } else if (!testJSON(req.body.menus)) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is invalid" });
    } else if (JSON.parse(req.body.menus).length == 0) {
      return res.status(200).json({
        status: false,
        message: "Menu list can't be empty, At least 1 menu is required",
      });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    } else if (!button) {
      return res
        .status(200)
        .json({ status: false, message: "Button text is missing" });
    }
  } else if (type == 1 || type == 3 || type == 5) {
    if (!req.files) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    } else if (!req.files.media) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    }
  }

  console.log(req.body.numbers);

  // return;

  const numbers = JSON.parse(req.body.numbers);
  const menus = JSON.parse(req.body.menus);

  if (sender == "multi" || sender == "all") {
    //var instances = await Instance.find({ userId: req.body.user_id });

    // var instances = JSON.parse(req.body.instances);

    if (sender == "all") {
      var instanceData = await Instance.find({
        userId: req.body.user_id,
        isDeleted: { $ne: true },
      });

      console.log('uperinstacedata', instanceData);

      instances = instanceData.map((x) => x._id);

      console.log("vishwajit - " + JSON.stringify(instances));
    }

    // Make sure the sender is exists & ready
    // if (!instances) {
    //   return res.status(200).json({
    //     status: false,
    //     message: `Instance not found`,
    //   });
    // }

    //create campaign
    const campaign = await Campaign.insert({
      name: name,

      //instanceId: sender,
      multi: true,
      userId: req.body.user_id,

      instances: instances,

      message: message,
      numbers: numbers,

      type: Number(type),

      button1: b1,
      button2: b2,
      button3: b3,

      middle: middle,
      footer: footer,
      button: button,

      menus: menus,

      callButton: call_button,
      callingNumber: calling_number,

      webUrlButton: web_url_button,
      webUrl: web_url,

      caption: caption,

      isSchedule: is_schedule,
      schedule: schedule,
    });

    if (!campaign) {
      return res.status(200).json({
        status: false,
        message: `Campaign create failed`,
      });
    } else {
      console.log("numbers - " + numbers);
      console.log("message send start");

      var success = 0;
      var fail = 0;
      var inValidNumber = 0;

      //is schedule
      if (is_schedule == "true") {
        if (type == 1 || type == 3 || type == 5) {
          var filePath = req.files.media.tempFilePath;
          var fileName = req.files.media.name;
          var fileType = req.files.media.mimetype;

          console.log("file path - " + filePath);
          console.log("file name - " + req.files.media.name);
          console.log("file mimetype - " + req.files.media.mimetype);
          console.log("file size - " + req.files.media.size);

          // campaign.media = filePath;
          // campaign.fileName = fileName;
          // campaign.fileType = fileType;

          // await campaign.save();

          await Campaign.updateOne(
            { _id: campaign._id },
            { $set: { media: filePath, fileName: fileName, fileType: fileType } }
          );
        }

        return res.status(200).json({
          status: true,
          message: "schedule message sent successfully",
        });

        // send direct
      } else {


        var instanceIndex = 0;

        await asyncForEach(numbers, async (data) => {
          const number = data.number.replace("+", "").trim(); //phoneNumberFormatter(data.number);
          var status = 0;
          const isValidNumber = isNumber(number);

          if (number)
            if (isValidNumber) {
              //fetch contact number

              if (instanceIndex == instances.length) {
                instanceIndex = 0;
              }

              //random instance
              var instance = instances[instanceIndex];
              instanceIndex++;

              const client = await WhatsAppInstance[instance];

              const instanceData = await Instance.findOne({
                _id: instance,
                userId: req.body.user_id,
                isDeleted: { $ne: true },
              });

              console.log('instance', instance);
              console.log('userId', req.body.user_id);
              console.log('instancedata', instanceData);

              const m = await Message.insert({
                instanceId: instance,
                instanceNumber: instanceData.number ?? "",
                userId: req.body.user_id,
                campaignId: campaign.id,

                message: message,
                number: number,

                type: Number(type),

                button1: b1,
                button2: b2,
                button3: b3,

                middle: middle,
                footer: footer,
                button: button,

                menus: menus,
                callButton: call_button,
                callingNumber: calling_number,

                webUrlButton: web_url_button,
                webUrl: web_url,

                caption: caption
              });

              var instanceExist = await Instance.findOne({
                _id: instance,
                userId: req.body.user_id,
                isDeleted: { $ne: true },
                status: "Ready"
              });

              if (!client || !instanceExist) {
                console.log("Client Not Found! - " + instance);
                //await createSession(instance, req.body.user_id);
                // m.status = 3;
                // await m.save();

                await Message.updateOne(
                  { _id: m._id },
                  { $set: { status: 3 } }
                );

              } else {

                console.log("Client Found - " + instance);

                //with media
                if (type == 1 || type == 3 || type == 5) {
                  var filePath = req.files.media.tempFilePath;
                  var fileName = req.files.media.name;
                  var fileType = req.files.media.mimetype;

                  console.log("file path - " + filePath);
                  console.log("file name - " + req.files.media.name);
                  console.log("file mimetype - " + req.files.media.mimetype);
                  console.log("file size - " + req.files.media.size);

                  //store in campaign

                  // campaign.media = filePath;
                  // campaign.fileName = fileName;
                  // campaign.fileType = fileType;
                  // await campaign.save();

                  await Campaign.updateOne(
                    { _id: campaign._id },
                    { $set: { media: filePath, fileName: fileName, fileType: fileType } }
                  );

                  // m.media = filePath;
                  // m.fileName = fileName;
                  // m.fileType = fileType;
                  // await m.save();

                  await Message.updateOne(
                    { _id: m._id },
                    { $set: { media: filePath, fileName: fileName, fileType: fileType } }
                  );

                  //send media
                  if (numbers.length <= 10) {
                    const fileType2 = req.files.media.mimetype.split("/")[0];
                    const result = await client.sendMediaFile2(
                      number,
                      req.files.media,
                      fileType2,
                      caption
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    // m.status = status;
                    // await m.save();

                    await Message.updateOne(
                      { _id: m._id },
                      { $set: { status: status } }
                    );

                  }
                }

                //send other message
                if (numbers.length <= 10 && client) {
                  await sleepTask();

                  if (type == 0 || type == 1) {
                    const result = await client.sendTextMessage(
                      number,
                      message
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                    //text with media
                  } else if (type == 2 || type == 3) {
                    var buttons = [];

                    if (b1 != "") {
                      buttons.push({ type: "replyButton", title: b1 });
                    }

                    if (b2 != "") {
                      buttons.push({ type: "replyButton", title: b2 });
                    }

                    if (b3 != "") {
                      buttons.push({ type: "replyButton", title: b3 });
                    }

                    const btndata = {
                      text: message,
                      buttons: buttons,
                      footerText: footer,
                    };

                    const result = await client.sendButtonMessage(
                      number,
                      btndata
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    //Action Button
                  } else if (type == 4 || type == 5) {
                    var buttons = [];

                    if (call_button != "") {
                      buttons.push({
                        type: "callButton",
                        title: call_button,
                        payload: calling_number,
                      });
                    }

                    if (web_url_button != "") {
                      buttons.push({
                        type: "urlButton",
                        title: web_url_button,
                        payload: web_url,
                      });
                    }

                    const btndata = {
                      text: message,
                      buttons: buttons,
                      footerText: footer,
                    };

                    const result = await client.sendButtonMessage(
                      number,
                      btndata
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    //List / Menu
                  } else if (type == 6) {
                    var menuList = [];

                    menus.forEach((menuItem, i) => {
                      menuList.push({
                        title: menuItem.title,
                        description: menuItem.description,
                        rowId: "menu-" + i,
                      });
                    });

                    const listData = {
                      buttonText: button,
                      text: middle,
                      title: "",
                      description: footer,
                      sections: [
                        {
                          title: message,
                          rows: menuList,
                        },
                      ],
                      listType: 0,
                    };

                    const result = await client.sendListMessage(
                      number,
                      listData
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                  } else {
                  }

                  // m.status = status;
                  // await m.save();

                  await Message.updateOne(
                    { _id: m._id },
                    { $set: { status: status } }
                  );

                }

                console.log("num - " + data.number);
                console.log("filter num - " + number);
              }
            } else {
              inValidNumber++;
            }
        });

        return res.status(200).json({
          status: true,
          message: "message sending start",
        });
      }
    }

    //not multi
  } else {
    const instance = await Instance.findOne({
      _id: sender,
      userId: req.body.user_id,
      isDeleted: { $ne: true },
    });

    const client = await WhatsAppInstance[sender];

    if (instance) {
      if (!client) {
        await createSession(sender, req.body.user_id);
      }
      //const qrcode = await WhatsAppInstance[instanceId].instance.qr;
    }

    // Make sure the sender is exists & ready
    if (!client) {
      return res.status(200).json({
        status: false,
        message: `The sender: ${sender} is not found!`,
      });
    } else {
      let data = "";
      try {
        //data = await instance.getInstanceDetail(sender);
        //console.log("client info - " + data);
      } catch (error) {
        data = {};
        console.log("client info error - " + error);
      }
    }

    //create campaign
    const campaign = await Campaign.insert({
      name: name,

      instanceId: sender,
      userId: req.body.user_id,

      message: message,
      numbers: numbers,

      type: Number(type),

      button1: b1,
      button2: b2,
      button3: b3,

      middle: middle,
      footer: footer,
      button: button,

      menus: menus,

      callButton: call_button,
      callingNumber: calling_number,

      webUrlButton: web_url_button,
      webUrl: web_url,

      caption: caption,

      isSchedule: is_schedule,
      schedule: schedule,
    });

    if (!campaign) {
      return res.status(200).json({
        status: false,
        message: `Campaign create failed`,
      });
    } else {
      console.log("numbers - " + numbers);
      console.log("message send start");

      var success = 0;
      var fail = 0;
      var inValidNumber = 0;

      if (is_schedule == "true") {
        if (type == 1 || type == 3 || type == 5) {
          var filePath = req.files.media.tempFilePath;
          var fileName = req.files.media.name;
          var fileType = req.files.media.mimetype;

          console.log("file path - " + filePath);
          console.log("file name - " + req.files.media.name);
          console.log("file mimetype - " + req.files.media.mimetype);
          console.log("file size - " + req.files.media.size);

          // campaign.media = filePath;
          // campaign.fileName = fileName;
          // campaign.fileType = fileType;

          // await campaign.save();

          await Campaign.updateOne(
            { _id: campaign._id },
            { $set: { media: filePath, fileName: fileName, fileType: fileType } }
          );


        }

        return res.status(200).json({
          status: true,
          message: "schedule message sent successfully",
        });
      } else {
        await asyncForEach(numbers, async (data) => {
          const number = data.number.replace("+", "").trim(); //phoneNumberFormatter(data.number);
          var status = 0;
          const isValidNumber = isNumber(number);

          if (number)
            if (isValidNumber) {
              //fetch contact number

              //random instance

              const instanceData = await Instance.findOne({
                _id: sender,
                userId: req.body.user_id,
                isDeleted: { $ne: true },
              });

              console.log('instance_data', instanceData);


              const m = await Message.insert({
                instanceId: sender,
                instanceNumber: instanceData.number ?? "",
                userId: req.body.user_id,
                campaignId: campaign.id,

                message: message,
                number: number,

                type: Number(type),

                button1: b1,
                button2: b2,
                button3: b3,

                middle: middle,
                footer: footer,
                button: button,

                menus: menus,
                callButton: call_button,
                callingNumber: calling_number,

                webUrlButton: web_url_button,
                webUrl: web_url,

                caption: caption,
              });

              //send media
              if (type == 1 || type == 3 || type == 5) {
                var filePath = req.files.media.tempFilePath;
                var fileName = req.files.media.name;
                var fileType = req.files.media.mimetype;

                console.log("file path - " + filePath);
                console.log("file name - " + req.files.media.name);
                console.log("file mimetype - " + req.files.media.mimetype);
                console.log("file size - " + req.files.media.size);

                // m.media = filePath;
                // m.fileName = fileName;
                // m.fileType = fileType;

                // await m.save();

                await Message.updateOne(
                  { _id: m._id },
                  { $set: { media: filePath, fileName: fileName, fileType: fileType } }
                );

                //send media
                if (numbers.length <= 10) {
                  const fileType2 = req.files.media.mimetype.split("/")[0];
                  const result = await client.sendMediaFile2(
                    number,
                    req.files.media,
                    fileType2,
                    caption
                  );

                  if (result) {
                    status = 1;
                  } else {
                    status = 2;
                  }

                  // m.status = status;
                  // await m.save();

                  await Message.updateOne(
                    { _id: m._id },
                    { $set: { status: status } }
                  );
                }

                /*  const fileType2 = req.files.media.mimetype.split("/")[0];
            const result = await client.sendMediaFile2(
              number,
              req.files.media,
              fileType2,
              caption
            ); */
              }

              if (numbers.length <= 10) {
                await sleepTask();

                if (type == 0 || type == 1) {
                  const result = await client.sendTextMessage(number, message);

                  if (result) {
                    status = 1;
                  } else {
                    status = 2;
                  }
                  //text with media
                } else if (type == 2 || type == 3) {
                  var buttons = [];

                  if (b1 != "") {
                    buttons.push({ type: "replyButton", title: b1 });
                  }

                  if (b2 != "") {
                    buttons.push({ type: "replyButton", title: b2 });
                  }

                  if (b3 != "") {
                    buttons.push({ type: "replyButton", title: b3 });
                  }

                  const btndata = {
                    text: message,
                    buttons: buttons,
                    footerText: footer,
                  };

                  const result = await client.sendButtonMessage(
                    number,
                    btndata
                  );

                  if (result) {
                    status = 1;
                  } else {
                    status = 2;
                  }

                  //Action Button
                } else if (type == 4 || type == 5) {
                  var buttons = [];

                  if (call_button != "") {
                    buttons.push({
                      type: "callButton",
                      title: call_button,
                      payload: calling_number,
                    });
                  }

                  if (web_url_button != "") {
                    buttons.push({
                      type: "urlButton",
                      title: web_url_button,
                      payload: web_url,
                    });
                  }

                  const btndata = {
                    text: message,
                    buttons: buttons,
                    footerText: footer,
                  };

                  const result = await client.sendButtonMessage(
                    number,
                    btndata
                  );

                  if (result) {
                    status = 1;
                  } else {
                    status = 2;
                  }

                  //List / Menu
                } else if (type == 6) {
                  var menuList = [];

                  menus.forEach((menuItem, i) => {
                    menuList.push({
                      title: menuItem.title,
                      description: menuItem.description,
                      rowId: "menu-" + i,
                    });
                  });

                  const listData = {
                    buttonText: button,
                    text: middle,
                    title: "",
                    description: footer,
                    sections: [
                      {
                        title: message,
                        rows: menuList,
                      },
                    ],
                    listType: 0,
                  };

                  const result = await client.sendListMessage(number, listData);

                  if (result) {
                    status = 1;
                  } else {
                    status = 2;
                  }
                } else {
                }

                // m.status = status;
                // await m.save();

                await Message.updateOne(
                  { _id: m._id },
                  { $set: { status: status } }
                );

              }

              console.log("num - " + data.number);
              console.log("filter num - " + number);
            } else {
              inValidNumber++;
            }
        });

        return res.status(200).json({
          status: true,
          message: "message sending start",
        });
      }
    }
  }
};

exports.logout = async (req, res, next) => {
  const instanceId = req.body.instance_id;

  // var ref = db.ref("sessions/" + instanceId);
  //ref.remove();

  // ref.update({
  //   status: "loggedOut",
  //   message: "Device Logged Out, Deleting Session.",
  // });

  await Instance.updateOne(
    { _id: instanceId, userId: req.body.user_id },
    { status: "loggedOut", message: "Device Logged Out, Deleting Session." }
  );

  try {
    await WhatsAppInstance[instanceId].instance?.sock?.logout();
  } catch (error) {
    //errormsg = error
    console.log("error logout - " + error);
  }

  deleteSession(instanceId);
  //init();

  return res.status(200).json({
    status: true,
    message: "logout success",
  });
};

function deleteSession(instanceId) {
  try {
    //unlinkSync(path.join(__dirname, `../sessions/${instanceId}.json`));

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
  } catch (error) {
    console.log("delete session error - " + error);
  }
}

exports.changeInstanceName = async (req, res, next) => {
  const instanceCode = req.body.code;
  const name = req.body.name;

  await Instance.updateOne(
    { code: instanceCode },
    { $set: { name: name } }
  );
  return res.status(200).json({
    status: true,
    message: "Name changed",
  });
};

//loadSessions();

//API

function testJSON(text) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    var json = JSON.parse(text);
    return typeof json === "object";
  } catch (error) {
    return false;
  }
}

exports.sendAPI = async (req, res, next) => {
  console.log("sendAPI body - " + JSON.stringify(req.body));
  console.log("sendAPI body instance_key - " + req.body.instance_key);

  const apiKey = req.body.api_key;
  const instanceKey = req.body.instance_key;

  //console.log("req.body.numbers length - "+numbers.length)
  //console.log("req.body.numbers - "+req.body.numbers)

  const name = req.body.name;
  const type = req.body.type;

  const message = req.body.message;
  const b1 = req.body.button_1;
  const b2 = req.body.button_2;
  const b3 = req.body.button_3;

  const button = req.body.button;
  const middle = req.body.middle;
  const footer = req.body.footer;

  const call_button = req.body.call_button;
  const calling_number = req.body.calling_number;
  const web_url_button = req.body.web_url_button;
  const web_url = req.body.web_url;
  const caption = req.body.caption ?? "";

  //validate
  if (!apiKey) {
    return res
      .status(200)
      .json({ status: false, message: "Api key is missing" });
  } else if (!instanceKey) {
    return res
      .status(200)
      .json({ status: false, message: "Instance key is missing" });
  } else if (!message) {
    return res
      .status(200)
      .json({ status: false, message: "Message text is missing" });
  } else if (!req.body.numbers) {
    return res
      .status(200)
      .json({ status: false, message: "Phone numbers is missing" });
  } else if (!testJSON(req.body.numbers)) {
    return res
      .status(200)
      .json({ status: false, message: "Phone numbers list is invalid" });
  } else if (JSON.parse(req.body.numbers).length == 0) {
    return res.status(200).json({
      status: false,
      message: "Phone numbers list can't be empty",
    });
  } else if (!type) {
    return res
      .status(200)
      .json({ status: false, message: "Message type is missing" });
  } else if (type == 2) {
    if (!b1) {
      return res
        .status(200)
        .json({ status: false, message: "Button 1 text is missing" });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    }
  } else if (type == 4) {
    if (!call_button) {
      return res
        .status(200)
        .json({ status: false, message: "Call Button text is missing" });
    } else if (!calling_number) {
      return res
        .status(200)
        .json({ status: false, message: "Calling number is missing" });
    } else if (!web_url_button) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url Button text is missing" });
    } else if (!web_url) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url is missing" });
    }
  } else if (type == 6) {
    if (!req.body.menus) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is missing" });
    } else if (!testJSON(req.body.menus)) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is invalid" });
    } else if (JSON.parse(req.body.menus).length == 0) {
      return res.status(200).json({
        status: false,
        message: "Menu list can't be empty, At least 1 menu is required",
      });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    } else if (!button) {
      return res
        .status(200)
        .json({ status: false, message: "Button text is missing" });
    }
  } else if (type == 1 || type == 3 || type == 5) {
    if (!req.files) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    } else if (!req.files.media) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    }
  }

  const numbers = JSON.parse(req.body.numbers);
  const menus = JSON.parse(req.body.menus);

  const user = await User.findOne({
    apiKey: apiKey,
  });

  if (user) {
    const instance = await Instance.findOne({
      code: instanceKey,
      userId: user.id,
      isDeleted: { $ne: true },
    });

    if (instance) {
      if (instance.status != "Ready") {
        await createSession(sender, user.id);
      }

      const client = await WhatsAppInstance[instance.id];

      // Make sure the sender is exists & ready
      if (!client) {
        return res.status(200).json({
          status: false,
          message: `The sender: ${instance.id} is not found!`,
        });
      } else {
        let data = "";
        try {
          // data = await instance.getInstanceDetail(instance.id);
          // console.log("client info - " + data);
        } catch (error) {
          data = {};
          console.log("client info error - " + error);
        }
      }

      //create campaign

      const campaign = await Campaign.insert({
        name: name,
        api: true,

        instanceId: instance.id,
        userId: user.id,

        message: message,
        numbers: numbers,

        type: Number(type),

        button1: b1,
        button2: b2,
        button3: b3,

        middle: middle,
        footer: footer,
        button: button,

        menus: menus,

        callButton: call_button,
        callingNumber: calling_number,

        webUrlButton: web_url_button,
        webUrl: web_url,

        caption: caption,
      });

      if (!campaign) {
        return res.status(200).json({
          status: false,
          message: `Campaign create failed`,
        });
      } else {
        console.log("numbers - " + numbers);
        console.log("message send start");

        var success = 0;
        var fail = 0;
        var inValidNumber = 0;

        numbers.forEach(async (data) => {
          const number = data.number.replace("+", ""); //phoneNumberFormatter(data.number);
          var status = 0;

          const isValidNumber = isNumber(number);

          if (isValidNumber) {
            const m = await Message.insert({
              instanceId: instance.id,
              instanceNumber: instance.number,
              api: true,
              userId: user.id,
              campaignId: campaign.id,

              message: message,
              number: number,

              type: Number(type),

              button1: b1,
              button2: b2,
              button3: b3,

              middle: middle,
              footer: footer,
              button: button,

              menus: menus,
              callButton: call_button,
              callingNumber: calling_number,

              webUrlButton: web_url_button,
              webUrl: web_url,

              caption: caption,
            });

            if (type == 1 || type == 3 || type == 5) {
              var filePath = req.files.media.tempFilePath;
              var fileName = req.files.media.name;
              var fileType = req.files.media.mimetype;

              console.log("file path - " + filePath);
              console.log("file name - " + req.files.media.name);
              console.log("file mimetype - " + req.files.media.mimetype);
              console.log("file size - " + req.files.media.size);

              // m.media = filePath;
              // m.fileName = fileName;
              // m.fileType = fileType;

              // await m.save();

              await Message.updateOne(
                { _id: m._id },
                { $set: { media: filePath, fileName: fileName, fileType: fileType } }
              );

            }
          } else {
            inValidNumber++;
          }
        });

        return res.status(200).json({
          status: true,
          message:
            "message sending start, " + inValidNumber + " invalid number found",
        });
      }
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Intance key is invalid" });
    }
  } else {
    return res
      .status(200)
      .json({ status: false, message: "Api key is invalid" });
  }
};

exports.sendAPI2 = async (req, res, next) => {
  console.log("sendAPI body - " + JSON.stringify(req.body));
  console.log("sendAPI body instance_key - " + req.body.instance_key);

  const apiKey = req.body.api_key;
  const instanceKey = req.body.instance_key;

  //console.log("req.body.numbers length - "+numbers.length)
  //console.log("req.body.numbers - "+req.body.numbers)

  const name = req.body.name;
  const type = req.body.type;

  var message = req.body.message;
  const b1 = req.body.button_1;
  const b2 = req.body.button_2;
  const b3 = req.body.button_3;

  const button = req.body.button;
  const middle = req.body.middle;
  const footer = req.body.footer;

  const call_button = req.body.call_button;
  const calling_number = req.body.calling_number;
  const web_url_button = req.body.web_url_button;
  const web_url = req.body.web_url;
  const caption = req.body.caption ?? "";

  const is_schedule = req.body.is_schedule ?? false;
  const schedule = req.body.schedule ?? null;

  //validate
  if (!apiKey) {
    return res
      .status(200)
      .json({ status: false, message: "Api key is missing" });
  } else if (!instanceKey) {
    return res
      .status(200)
      .json({ status: false, message: "Instance key is missing" });
  } else if (!message) {
    return res
      .status(200)
      .json({ status: false, message: "Message text is missing" });
  } else if (!req.body.numbers) {
    return res
      .status(200)
      .json({ status: false, message: "Phone numbers is missing" });
  } else if (!testJSON(req.body.numbers)) {
    return res
      .status(200)
      .json({ status: false, message: "Phone numbers list is invalid" });
  } else if (JSON.parse(req.body.numbers).length == 0) {
    return res.status(200).json({
      status: false,
      message: "Phone numbers list can't be empty",
    });
  } else if (!type) {
    return res
      .status(200)
      .json({ status: false, message: "Message type is missing" });
  } else if (type == 2) {
    if (!b1) {
      return res
        .status(200)
        .json({ status: false, message: "Button 1 text is missing" });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    }
  } else if (type == 4) {
    if (!call_button) {
      return res
        .status(200)
        .json({ status: false, message: "Call Button text is missing" });
    } else if (!calling_number) {
      return res
        .status(200)
        .json({ status: false, message: "Calling number is missing" });
    } else if (!web_url_button) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url Button text is missing" });
    } else if (!web_url) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url is missing" });
    }
  } else if (type == 6) {
    if (!req.body.menus) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is missing" });
    } else if (!testJSON(req.body.menus)) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is invalid" });
    } else if (JSON.parse(req.body.menus).length == 0) {
      return res.status(200).json({
        status: false,
        message: "Menu list can't be empty, At least 1 menu is required",
      });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    } else if (!button) {
      return res
        .status(200)
        .json({ status: false, message: "Button text is missing" });
    }
  } else if (type == 1 || type == 3 || type == 5) {
    if (!req.files) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    } else if (!req.files.media) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    }
  }

  const numbers = JSON.parse(req.body.numbers);
  const menus = JSON.parse(req.body.menus);

  const user = await User.findOne({
    apiKey: apiKey,
  });

  if (user) {
    const instance = await Instance.findOne({
      code: instanceKey,
      userId: user.id,
      isDeleted: { $ne: true },
    });

    if (instance) {
      if (instance.status != "Ready") {
        await createSession(instance.id, user.id);
      }

      const client = await WhatsAppInstance[instance.id];

      // Make sure the sender is exists & ready
      if (!client) {
        return res.status(200).json({
          status: false,
          message: `The sender: ${instance.id} is not found!`,
        });
      } else {
        let data = "";
        try {
          // data = await instance.getInstanceDetail(instance.id);
          // console.log("client info - " + data);
        } catch (error) {
          data = {};
          console.log("client info error - " + error);
        }
      }

      //create campaign

      const campaign = await Campaign.insert({
        name: name,
        api: true,

        instanceId: instance.id,
        userId: user.id,

        message: message,
        numbers: numbers,

        type: Number(type),

        button1: b1,
        button2: b2,
        button3: b3,

        middle: middle,
        footer: footer,
        button: button,

        menus: menus,

        callButton: call_button,
        callingNumber: calling_number,

        webUrlButton: web_url_button,
        webUrl: web_url,

        caption: caption,
      });

      if (!campaign) {
        return res.status(200).json({
          status: false,
          message: `Campaign create failed`,
        });
      } else {
        console.log("numbers - " + numbers);
        console.log("message send start");

        var success = 0;
        var fail = 0;
        var inValidNumber = 0;

        if (is_schedule == "true") {
          if (type == 1 || type == 3 || type == 5) {
            var filePath = req.files.media.tempFilePath;
            var fileName = req.files.media.name;
            var fileType = req.files.media.mimetype;

            console.log("file path - " + filePath);
            console.log("file name - " + req.files.media.name);
            console.log("file mimetype - " + req.files.media.mimetype);
            console.log("file size - " + req.files.media.size);

            // campaign.media = filePath;
            // campaign.fileName = fileName;
            // campaign.fileType = fileType;

            // await campaign.save();

            await Campaign.updateOne(
              { _id: campaign._id },
              { $set: { media: filePath, fileName: fileName, fileType: fileType } }
            );

          }

          return res.status(200).json({
            status: true,
            message: "schedule message sent successfully",
          });
        } else {
          await asyncForEach(numbers, async (data) => {
            const number = data.number.replace("+", "").trim(); //phoneNumberFormatter(data.number);
            var status = 0;
            const isValidNumber = isNumber(number);

            message = message.replace("%name%", data.name ?? "");

            if (number)
              if (isValidNumber) {
                //fetch contact number

                const m = await Message.insert({
                  instanceId: instance.id,
                  instanceNumber: instance.number ?? "",
                  userId: user.id,
                  campaignId: campaign.id,

                  message: message,
                  number: number,

                  type: Number(type),

                  button1: b1,
                  button2: b2,
                  button3: b3,

                  middle: middle,
                  footer: footer,
                  button: button,

                  menus: menus,
                  callButton: call_button,
                  callingNumber: calling_number,

                  webUrlButton: web_url_button,
                  webUrl: web_url,

                  caption: caption,
                });

                //send media
                if (type == 1 || type == 3 || type == 5) {
                  var filePath = req.files.media.tempFilePath;
                  var fileName = req.files.media.name;
                  var fileType = req.files.media.mimetype;

                  console.log("file path - " + filePath);
                  console.log("file name - " + req.files.media.name);
                  console.log("file mimetype - " + req.files.media.mimetype);
                  console.log("file size - " + req.files.media.size);

                  // m.media = filePath;
                  // m.fileName = fileName;
                  // m.fileType = fileType;

                  // await m.save();

                  await Message.updateOne(
                    { _id: m._id },
                    { $set: { media: filePath, fileName: fileName, fileType: fileType } }
                  );

                  //send media
                  if (numbers.length <= 10) {
                    const fileType2 = req.files.media.mimetype.split("/")[0];
                    const result = await client.sendMediaFile2(
                      number,
                      req.files.media,
                      fileType2,
                      caption
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    // m.status = status;
                    // await m.save();

                    await Message.updateOne(
                      { _id: m._id },
                      { $set: { status: status } }
                    );
                  }

                  /*  const fileType2 = req.files.media.mimetype.split("/")[0];
                const result = await client.sendMediaFile2(
                  number,
                  req.files.media,
                  fileType2,
                  caption
                ); */
                }

                if (numbers.length <= 10) {
                  await sleepTask();

                  if (type == 0 || type == 1) {
                    const result = await client.sendTextMessage(
                      number,
                      message
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                    //text with media
                  } else if (type == 2 || type == 3) {
                    var buttons = [];

                    if (b1 != "") {
                      buttons.push({ type: "replyButton", title: b1 });
                    }

                    if (b2 != "") {
                      buttons.push({ type: "replyButton", title: b2 });
                    }

                    if (b3 != "") {
                      buttons.push({ type: "replyButton", title: b3 });
                    }

                    const btndata = {
                      text: message,
                      buttons: buttons,
                      footerText: footer,
                    };

                    const result = await client.sendButtonMessage(
                      number.trim(),
                      btndata
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    //Action Button
                  } else if (type == 4 || type == 5) {
                    var buttons = [];

                    if (call_button != "") {
                      buttons.push({
                        type: "callButton",
                        title: call_button,
                        payload: calling_number,
                      });
                    }

                    if (web_url_button != "") {
                      buttons.push({
                        type: "urlButton",
                        title: web_url_button,
                        payload: web_url,
                      });
                    }

                    const btndata = {
                      text: message,
                      buttons: buttons,
                      footerText: footer,
                    };

                    const result = await client.sendButtonMessage(
                      number,
                      btndata
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }

                    //List / Menu
                  } else if (type == 6) {
                    var menuList = [];

                    menus.forEach((menuItem, i) => {
                      menuList.push({
                        title: menuItem.title,
                        description: menuItem.description,
                        rowId: "menu-" + i,
                      });
                    });

                    const listData = {
                      buttonText: button,
                      text: middle,
                      title: "",
                      description: footer,
                      sections: [
                        {
                          title: message,
                          rows: menuList,
                        },
                      ],
                      listType: 0,
                    };

                    const result = await client.sendListMessage(
                      number,
                      listData
                    );

                    if (result) {
                      status = 1;
                    } else {
                      status = 2;
                    }
                  } else {
                  }

                  // m.status = status;
                  // await m.save();

                  await Message.updateOne(
                    { _id: m._id },
                    { $set: { status: status } }
                  );
                }

                console.log("num - " + data.number);
                console.log("filter num - " + number);
              } else {
                inValidNumber++;
              }
          });

          return res.status(200).json({
            status: true,
            message: "message sending start",
          });
        }
      }
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Intance key is invalid" });
    }
  } else {
    return res
      .status(200)
      .json({ status: false, message: "Api key is invalid" });
  }
};

//post

exports.createInstance = async (req, res, next) => {

  const name = req.body.instance_name;

  const user = await User.findOne({});

  req.body.user_id = user._id;

  if (!name) {
    return res.status(500).json({
      status: false,
      message: "Please Enter Instance Name",
    });
  } else if (user) {

    for (var i = 0; i < 1; i++) {

      // var currentDate = Date.now();
      var nextPaymentDate = "17/03/2024";
      // nextPaymentDate.add(365, "days").format("YYYY-MM-DD hh:mm");

      await Instance.insert({
        name: name,
        code: nanoid(10),
        status: "New Added",
        userId: req.body.user_id,
        expire: nextPaymentDate
      });
    }
    return res.status(200).json({
      status: true,
      message: "Instance created.",
      name: name
    });

  } else {

    return res.status(200).json({
      status: false,
      message: "User not found!",
    });

  }
};



exports.logout = async (req, res, next) => {
  const instanceId = req.body.instance_id;

  await Instance.updateOne(
    { _id: instanceId, userId: req.body.user_id },
    { status: "loggedOut", name: req.body.name, message: "Device Logged Out, Deleting Session." }
  );

  try {
    await WhatsAppInstance[instanceId].instance?.sock?.logout();
  } catch (error) {
    //errormsg = error
    console.log("error logout - " + error);
  }

  deleteSession(instanceId);
  //init();

  return res.status(200).json({
    status: true,
    message: "logout success",
  });
};

exports.deleteInstance = async (req, res, next) => {
  const instanceId = req.body.instance_id;
  console.log(instanceId);
  // var ref = db.ref("sessions/" + instanceId);
  // ref.remove();

  await Instance.updateOne({ _id: instanceId }, { $set: { isDeleted: true, status: "Deleted", message: "Instance deleted success" } });

  try {
    await WhatsAppInstance[instanceId].instance?.sock?.logout();
  } catch (error) {
    console.log("error logout - " + error);
  }

  return res.status(200).json({
    status: true,
    message: "Instance deleted.",
    instanceId
  });
};


exports.updateInstance = async (req, res, next) => {
  const { instance_id, name, valid, expire_date } = req.body;

  await Instance.updateOne({ _id: instance_id }, { expire: expire_date, name: name });

  return res.status(200).json({
    status: true,
    message: "Instance updated.",
  });

};

exports.allInstance = async (req, res, next) => {
  var limit = Number(req.body.limit),
    page = Math.max(0, req.body.page);
  var now = new Date();

  const inatances = await Instance.find({
    isDeleted: { $ne: true },
  })
    .sort({
      createdAt: "desc",
    })
    .skip(page * limit)
    .limit(limit);

  if (inatances) {
    return res.status(200).json({
      status: true,
      data: "kaif",
      inatances: inatances,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "inatances not found",
    });
  }
};

//Auto Reply
exports.allAutoReply = async (req, res, next) => {
  const autoreplies = await AutoReply.find({});

  if (autoreplies) {

    let instanceData = '';

    for (let index = 0; index < autoreplies.length; index++) {
      instanceData = await Instance.findOne({ _id: autoreplies[index].instanceId });
      autoreplies[index].iname = instanceData.name;
      autoreplies[index].inumber = instanceData.number;
    }

    return res.status(200).json({
      status: true,
      autoreplies: autoreplies,
    });


  } else {
    return res.status(200).json({
      status: false,
      message: "Auto Reply not found",
    });
  }
};

exports.createAutoReply = async (req, res, next) => {
  const {
    instance_id,
    keyword,
    message,
    type,
    button_1,
    button_2,
    button_3,
    footer,
    middle,
    button,
    call_button,
    calling_number,
    web_url_button,
    web_url,
    caption,
  } = req.body;
  const user = await User.findOne({});
  req.body.user_id = user._id;

  if (!instance_id) {
    return res
      .status(200)
      .json({ status: false, message: "Instance is missing" });
  } else if (!keyword) {
    return res
      .status(200)
      .json({ status: false, message: "Keyword is missing" });
  } else if (!message) {
    return res
      .status(200)
      .json({ status: false, message: "Message text is missing" });
  } else if (!type) {
    return res
      .status(200)
      .json({ status: false, message: "Message type is missing" });
  } else if (type == 2) {
    if (!button_1) {
      return res
        .status(200)
        .json({ status: false, message: "Button 1 text is missing" });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    }
  } else if (type === 4) {
    if (!call_button) {
      return res
        .status(200)
        .json({ status: false, message: "Call Button text is missing" });
    } else if (!calling_number) {
      return res
        .status(200)
        .json({ status: false, message: "Calling number is missing" });
    } else if (!web_url_button) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url Button text is missing" });
    } else if (!web_url) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url is missing" });
    }
  } else if (type === 6) {
    if (!req.body.menus) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is missing" });
    } else if (!testJSON(req.body.menus)) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is invalid" });
    } else if (JSON.parse(req.body.menus).length == 0) {
      return res.status(200).json({
        status: false,
        message: "Menu list can't be empty, At least 1 menu is required",
      });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    } else if (!button) {
      return res
        .status(200)
        .json({ status: false, message: "Button text is missing" });
    }
  } else if (type === 1 || type === 3 || type === 5) {
    if (!req.files) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    } else if (!req.files.media) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    }
  }

  const menus = JSON.parse(req.body.menus);

  const ar = await AutoReply.findOne({
    keyword: keyword,
    instanceId: instance_id,
  });

  if (ar) {
    return res.status(200).json({
      status: false,
      message: "Keyword already found",
    });
  } else {
    const ar = await AutoReply.insert({
      instanceId: instance_id,
      userId: req.body.user_id,
      keyword: keyword,
      message: message,
      type: Number(type),
      button1: button_1,
      button2: button_2,
      button3: button_3,
      footer: footer,

      button: button,
      middle: middle,
      menus: menus,

      callButton: call_button,
      callingNumber: calling_number,

      webUrlButton: web_url_button,
      webUrl: web_url,

      caption: caption,
    });

    if (type === 1 || type === 3 || type === 5) {
      var filePath = req.files.media.tempFilePath;
      var fileName = req.files.media.name;
      var fileType = req.files.media.mimetype;

      console.log("file path - " + filePath);
      console.log("file name - " + req.files.media.name);
      console.log("file mimetype - " + req.files.media.mimetype);
      console.log("file size - " + req.files.media.size);

      // ar.media = filePath;
      // ar.fileName = fileName;
      // ar.fileType = fileType;

      // await ar.save();

      await AutoReply.updateOne(
        { _id: ar._id },
        { $set: { media: filePath, fileName: fileName, fileType: fileType } }
      );

    }

    return res.status(200).json({
      status: true,
      message: "Auto Reply created",
    });
  }
};

exports.updateAutoReply = async (req, res, next) => {
  const {
    autoreply_id,
    instance_id,
    keyword,
    message,
    type,
    button_1,
    button_2,
    button_3,
    footer,
    middle,
    button,
    call_button,
    calling_number,
    web_url_button,
    web_url,
    caption,
  } = req.body;

  const user=await User.findOne({});
  req.body.user_id=user._id;

  if (!instance_id) {
    return res
      .status(200)
      .json({ status: false, message: "Instance is missing" });
  } else if (!keyword) {
    return res
      .status(200)
      .json({ status: false, message: "Keyword is missing" });
  } else if (!message) {
    return res
      .status(200)
      .json({ status: false, message: "Message text is missing" });
  } else if (!type) {
    return res
      .status(200)
      .json({ status: false, message: "Message type is missing" });
  } else if (type == 2) {
    if (!button_1) {
      return res
        .status(200)
        .json({ status: false, message: "Button 1 text is missing" });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    }
  } else if (type == 4) {
    if (!call_button) {
      return res
        .status(200)
        .json({ status: false, message: "Call Button text is missing" });
    } else if (!calling_number) {
      return res
        .status(200)
        .json({ status: false, message: "Calling number is missing" });
    } else if (!web_url_button) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url Button text is missing" });
    } else if (!web_url) {
      return res
        .status(200)
        .json({ status: false, message: "Web Url is missing" });
    }
  } else if (type == 6) {
    if (!req.body.menus) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is missing" });
    } else if (!testJSON(req.body.menus)) {
      return res
        .status(200)
        .json({ status: false, message: "Menu list is invalid" });
    } else if (JSON.parse(req.body.menus).length == 0) {
      return res.status(200).json({
        status: false,
        message: "Menu list can't be empty, At least 1 menu is required",
      });
    } else if (!footer) {
      return res
        .status(200)
        .json({ status: false, message: "Footer text is missing" });
    } else if (!button) {
      return res
        .status(200)
        .json({ status: false, message: "Button text is missing" });
    }
  } else if (type == 1 || type == 3 || type == 5) {
    if (!req.files) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    } else if (!req.files.media) {
      return res
        .status(200)
        .json({ status: false, message: "Media File is missing" });
    }
  }

  const menus = JSON.parse(req.body.menus);

  const ar = await AutoReply.findOne({
    _id: autoreply_id,
  });

  if (ar) {
    const ar2 = await AutoReply.findOne({
      keyword: keyword,
      instanceId: instance_id,
    });

    if (ar2) {
      console.log(
        "old instance - " + ar.instanceId + ", new Instance - " + ar2.instanceId
      );

      if (ar2.instanceId.toString() != ar.instanceId.toString()) {
        return res.status(200).json({
          status: false,
          message: "Auto reply already exist in selected instance",
        });
      }
    }

    ar.instanceId = instance_id;
    ar.userId = req.body.user_id;
    ar.keyword = keyword;
    ar.message = message;
    ar.type = Number(type);
    ar.button1 = button_1;
    ar.button2 = button_2;
    ar.button3 = button_3;
    ar.footer = footer;

    ar.button = button;
    ar.middle = middle;
    ar.menus = menus;

    ar.callButton = call_button;
    ar.callingNumber = calling_number;

    ar.webUrlButton = web_url_button;
    ar.webUrl = web_url;
    ar.caption = caption;

    if (type == 1 || type == 3 || type == 5) {
      var filePath = req.files.media.tempFilePath;
      var fileName = req.files.media.name;
      var fileType = req.files.media.mimetype;

      console.log("file path - " + filePath);
      console.log("file name - " + req.files.media.name);
      console.log("file mimetype - " + req.files.media.mimetype);
      console.log("file size - " + req.files.media.size);

      // ar.media = filePath;
      // ar.fileName = fileName;
      // ar.fileType = fileType;

      // await ar.save();

      await AutoReply.updateOne(
        { _id: ar._id },
        { $set: { media: filePath, fileName: fileName, fileType: fileType } }
      );
    }

    await AutoReply.updateOne(
    {_id:autoreply_id},
    {$set:ar});

    return res.status(200).json({
      status: true,
      message: "Auto Reply updated",
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Auto reply not found",
    });
  }
};

exports.deleteAutoReply = async (req, res, next) => {
  const { auto_reply_id } = req.body;

  const ar = await AutoReply.findOne({
    _id: auto_reply_id,
  });

  if (!ar) {
    return res.status(200).json({
      status: false,
      message: "Auto Reply not found",
    });
  } else {
    await AutoReply.remove({
      _id: auto_reply_id,
    });

    return res.status(200).json({
      status: true,
      message: "Auto Reply deleted",
    });
  }
};

//Template

exports.welcomeTemplate = async (req, res, next) => {
  const template = await Template.find({ isWelcome: true, });

  if (template) {

    let instanceData = '';

    for (let index = 0; index < template.length; index++) {
      instanceData = await Instance.findOne({ _id: template[index].instanceId });
      template[index].iname = instanceData.name;
      template[index].inumber = instanceData.number;
    }
    return res.status(200).json({
      status: true,
      template: template,
    });

  } else {
    return res.status(200).json({
      status: false,
      message: "Template not found",
    });
  }
};

exports.allTemplate = async (req, res, next) => {
  // var limit = Number(req.body.limit),
  //   page = Math.max(0, req.body.page);

  const templates = await Template.find({
    isWelcome: { $ne: true },
  })
  // .sort({
  //   createdAt: "desc",
  // })
  // .skip(page * limit)
  // .limit(limit);

  if (templates) {
    return res.status(200).json({
      status: true,
      templates: templates,
    });
  } else {
    return res.status(401).json({
      status: false,
      message: "Templates not found",
    });
  }
};

exports.createTemplate = async (req, res, next) => {
  const {
    name,
    message,
    type,
    button_1,
    button_2,
    button_3,
    button,
    footer,
    middle,
    menus,
    call_button,
    calling_number,
    web_url_button,
    web_url,
    is_welcome,
    instance_id,
  } = req.body;

  const user = await User.findOne({});
  req.body.user_id = user._id;

  var data = {
    userId: req.body.user_id,
    name: name,
    message: message,
    type: Number(type),
    button1: button_1,
    button2: button_2,
    button3: button_3,
    footer: footer,
    middle: middle,
    footer: footer,
    button: button,
    menus: menus,

    callButton: call_button,
    callingNumber: calling_number,

    webUrlButton: web_url_button,
    webUrl: web_url,
    isWelcome: is_welcome ?? false,
  };

  if (instance_id) {
    data = { ...data, instanceId: instance_id };
  }

  if (is_welcome) {
    const wt = await Template.findOne({
      userId: req.body.user_id,
      isWelcome: true,
      instanceId: instance_id ?? "",
    });
    if (wt) {
      return res.status(200).json({
        status: false,
        message: "Template already exist",
      });
    }
  }

  const temp = await Template.insert(data);

  if (temp) {
    return res.status(200).json({
      status: true,
      message: "Template created",
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Template create failed!",
    });
  }
};

exports.updateTemplate = async (req, res, next) => {
  const {
    template_id,
    name,
    message,
    type,
    button_1,
    button_2,
    button_3,
    button,
    footer,
    middle,
    menus,

    call_button,
    calling_number,
    web_url_button,
    web_url,
    is_welcome,
    instance_id,
  } = req.body;

  const user = await User.findOne({});
  req.body.user_id = user._id;
  
  const template = await Template.findOne({
    _id: template_id,
    userId:req.body.user_id
  });

  if (template) {
    const t2 = await Template.findOne({
      isWelcome: true,
      instanceId: instance_id,
      userId:req.body.user_id
    });

    if (t2) {
      console.log(
        "old instance - " +
        template.instanceId +
        ", new Instance - " +
        t2.instanceId
      );

      if (template.instanceId) {
        if (t2.instanceId.toString() != template.instanceId.toString()) {
          return res.status(200).json({
            status: false,
            message: "Welcome Template already exist in selected instance",
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "Welcome Template already exist in selected instance",
        });
      }
    }
    template.name = name;
    template.message = message;
    template.type = Number(type);
    template.button1 = button_1;
    template.button2 = button_2;
    template.button3 = button_3;
    template.footer = footer;
    template.middle = middle;
    template.footer = footer;
    template.button = button;
    template.menus = menus;

    template.callButton = call_button;
    template.callingNumber = calling_number;

    template.webUrlButton = web_url_button;
    template.webUrl = web_url;

    template.isWelcome = is_welcome ?? false;

    if (instance_id) {
      template.instanceId = instance_id;
    }

    await Template.updateOne(
      {_id:template_id,
      userId:req.body.user_id},
      {$set:template})

    return res.status(200).json({
      status: true,
      message: "Template updated",
      template:template
    });
  } else {
    return res.status(200).json({
      status: true,
      message: "Template not found",
    });
  }
};

exports.deleteTemplate = async (req, res, next) => {
  const { template_id } = req.body;

  const ar = await Template.findOne({
    _id: template_id,
  });

  if (!ar) {
    return res.status(200).json({
      status: false,
      message: "Template not found",
    });
  } else {
    await Template.remove({
      _id: template_id,
    });

    return res.status(200).json({
      status: true,
      message: "Template deleted",
    });
  }
};

exports.allMessages = async (req, res, next) => {
  var limit = Number(req.body.limit),
    page = Math.max(0, req.body.page);

  const messages = await Message.find({})
  .sort({
    createdAt: "desc",
  })
  .skip(page * limit)
  .limit(limit);

  if (messages) {

    // let instanceData = '';

    // for (let index = 0; index < messages.length; index++) {
    //   instanceData = await Instance.findOne({ _id: messages[index].instanceId });
    //   messages[index].iname = instanceData.name;
    //   messages[index].inumber = instanceData.number;
    // }

    return res.status(200).json({
      status: true,
      messages: messages,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Message not found",
    });
  }
};

exports.allReceivedMessages = async (req, res, next) => {
  var limit = Number(req.body.limit),
    page = Math.max(0, req.body.page);

  const messages = await ReceivedMessage.find({
    userId: req.body.user_id,
  })
    .sort({
      createdAt: "desc",
    })
    .skip(page * limit)
    .limit(limit);

  if (messages) {
    return res.status(200).json({
      status: true,
      messages: messages,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Message not found",
    });
  }
};

exports.allApiMessages = async (req, res, next) => {
  var limit = Number(req.body.limit),
    page = Math.max(0, req.body.page);

  const messages = await Message.find({
    userId: req.body.user_id,
    api: true,
  })
    .sort({
      createdAt: "desc",
    })
    .skip(page * limit)
    .limit(limit);

  if (messages) {
    return res.status(200).json({
      status: true,
      messages: messages,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Message not found",
    });
  }
};

exports.cancel = async (req, res, next) => {
  await Campaign.updateMany({ userId: req.body.user_id, status: 0 }, { status: 2 });
  await Message.updateMany({ userId: req.body.user_id, status: 0 }, { status: 5 });

  return res.status(200).json({
    status: true,
    message: "Cancel Sending success",
  });
};

exports.startSending = async (req, res, next) => {
  //pause to pending
  await Campaign.updateMany({ userId: req.body.user_id, status: 3 }, { status: 0 });
  await Message.updateMany({ userId: req.body.user_id, status: 6 }, { status: 0 });

  return res.status(200).json({
    status: true,
    message: "Start Sending success",
  });
};

exports.pauseSending = async (req, res, next) => {
  //pending to pause
  await Campaign.updateMany({ userId: req.body.user_id, status: 0 }, { status: 3 });
  await Message.updateMany({ userId: req.body.user_id, status: 0 }, { status: 6 });

  return res.status(200).json({
    status: true,
    message: "Pending Sending success",
  });
};

//Login User 
exports.login = async (req, res, next) => {

  const { key } = req.body;
  const auth = await Auth.find({});
  let deviceid = nanoid(15);
  if (!key) {
    if (auth) {
      // call to server without key data
      const response = await axios.post('https://www.goyral.com/whatsappsystemsoftware/index.php', { key: auth[0].key, type: 'login', deviceid: auth[0].deviceid });
      console.log(response.data);
      res.send(response.data);
    } else {
      res.send("Please Enter Key...!");
    }
  } else {
    // call to server for this key data
    const response = await axios.post('https://www.goyral.com/whatsappsystemsoftware/index.php', { key: key, type: 'login', deviceid: deviceid });
    console.log(response.data, deviceid);
    if (response.data.type === 'error') {
      res.send(response.data);
    } else if (response.data.type === 'success') {
      await Auth.insert({
        key: key,
        deviceid: deviceid,
        user: response.data.user,
        validity: response.data.validity
      });
      res.send(response.data);
    } else {
      console.log('Invalid Key...!');
    }
  }

  // if(auth){

  //   await Auth.updateOne(
  //      { deviceid:auth.deviceid } ,
  //      { $set : {key:key} });

  // }else{ 
  //    //Insert user detailed in Auth/user not exits
  //    await Auth.insert({key:key,deviceid:deviceid});


  // }

  //   return res.status(200).json({
  //     status: true,
  //     message: req.body.key,
  //   });

  // }else{

  //   if(auth){

  //     // call to server for this auth data

  //     const validity = {};

  //     validity.type = 1;
  //     validity.user = {"name":"Harvansh" , "validity":"20-12-24"};

  //     if(validity.type===1){

  //       return res.status(200).json({
  //         status: true,
  //         message: 'Licence Valid',
  //       });

  //     }else{

  //       return res.status(200).json({
  //         status: false,
  //         message: 'Liccence Not Valid',
  //       });

  //     }  

  //   }else{
  //       return res.status(200).json({
  //         status: false,
  //         message: 'Please Input Licence key',
  //       });
  //   }
  // }

};



exports.getUser = async (req, res, next) => {

  const user = await Auth.find({});
  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Please Enter Instance Name",
    });
  } else {
    return res.status(200).json({
      status: true,
      data: user
    });
  }
}



