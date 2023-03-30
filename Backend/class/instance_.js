/* eslint-disable no-unsafe-optional-chaining */
const QRCode = require("qrcode");
const pino = require("pino");
const {
  default: makeWASocket,
  delay,
  useSingleFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeInMemoryStore,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const { existsSync, unlinkSync, readFileSync } = require("fs");

//const { fileTypeFromBuffer } = require('file-type');
// const fetch = require("node-fetch");

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const processButton = require("../helper/processbtn");
const generateVC = require("../helper/genVc");
// const Chat = require("../models/chat.model")
const axios = require("axios");
//const config = require('../config/config')

const User = require("../models/user.model");
const Message = require("../models/message.model");
const ReceivedMessage = require("../models/received.message.model");
const Instance = require("../models/instance.model");
const AutoReply = require("../models/auto-reply.model");
const Template = require("../models/template.model");
const Campaign = require("../models/campaign.model");

const moment = require("moment");

// var admin = require("firebase-admin");
// var db = admin.database();

class WhatsAppInstance {
  socketConfig = {
    printQRInTerminal: true,
    browser: [
      process.env.NODE_ENV == "prod"
        ? process.env.INSTANCE_NAME
        : process.env.INSTANCE_TEST_NAME,
      "",
      "3.0",
    ],
    logger: pino({
      level: process.env.NODE_ENV == "prod" ? "silent" : "debug",
    }),

    connectTimeoutMs: 60000,
    // qrTimeout: 20000,
    //defaultQueryTimeoutMs:5000,
  };
  key = "";
  userId = "";
  restart = false;
  authState;
  store;
  maxQrRetry = 3;
  isConnected = false;
  qrTimeout = false;
  allowWebhook = false;
  instance = {
    key: this.key,
    userId: this.userId,
    chats: [],
    qr: "",
    messages: [],
  };

  // axiosInstance = axios.create({
  //     baseURL: config.webhookUrl,
  // })

  constructor(key, userId, allowWebhook = false) {
    console.log("start wa key - " + key + ", userId - " + userId);

    this.key = key ? key : uuidv4();
    this.userId = userId;
    this.allowWebhook = allowWebhook;
    this.authState = useSingleFileAuthState(
      path.join(__dirname, `../sessions/${this.key}.json`)
      //`sessions/${this.key}.json`
    );
  }


  

  async SendWebhook(data) {
    if (!this.allowWebhook) return;
    // this.axiosInstance.post('', data).catch((error) => {
    //     return
    // })
  }

  async init() {
    this.socketConfig.auth = this.authState.state;
    this.instance.sock = makeWASocket(this.socketConfig);
    this.setHandler();

    // this.store = makeInMemoryStore({
    //   logger: pino({
    //     level: process.env.NODE_ENV == "prod" ? "silent" : "debug",
    //   }),
    // });
    // // bind to the socket
    // this.store.bind(this.instance.sock.ev);

    return this;
  }

  setHandler() {
    let qrRetry = 0;

    const sock = this.instance.sock;
    // on credentials update save state
    sock?.ev.on("creds.update", this.authState.saveState);

    // on socket closed, opened, connecting
    sock?.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      console.log("connection update", update);

      // var ref = db.ref("sessions/" + this.key);

      var status = "";
      var message = "";

      // if (this.userId) {
      //   ref.set({
      //     userId: this.userId,
      //     qr: "",
      //     auth: "",
      //     status: "",
      //     message: "",
      //   });
      // }

      if (qr) {
        qrRetry++;

        if (qrRetry >= this.maxQrRetry) {
          try {
            // close function is called before a new initTimeout is created, NodeJS will attempt to clear the old timeout.
            qrRetry = 0;
            this.qrTimeout = true;
            if (!this.isConnected) {
              this.instance?.sock?.logout();
            }
            console.log("socket connection terminated");
            return;
          } catch (e) {
            console.log("Connection closed");
          }
        }

        console.log(
          `====================== QR Retry (${this.key}) ${qrRetry} ======================`
        );

        // Send QR Code to Server
        QRCode.toDataURL(qr).then((url) => {

          // console.log(url);

          this.instance.qr = url;

          // ref.update({
          //   qr: url,
          //   status: "QR",
          //   message: "Received QR Code",
          // });

          this.SendWebhook({
            type: "update",
            message: "Received QR Code",
            key: this.key,
            qrcode: url,
          });
        });
      } else if (connection === "close") {
        var shouldReconnect = false;

        try {
          shouldReconnect = lastDisconnect.error
            ? lastDisconnect.error?.output?.statusCode !==
              DisconnectReason.loggedOut
            : false;
        } catch (e) {
          console.log("shouldReconnect - " + e);
        }

        // reconnect if not logged out
        const statusCode = lastDisconnect.error
          ? lastDisconnect.error?.output?.statusCode
          : 0;
        if (statusCode === DisconnectReason.badSession) {
          status = "badSession";
          message = `Bad session file, delete and run again`;
          console.log(message);

          await delay(2000);
          await this.init();

          //this.remove_session();  // Delete session file
        } else if (statusCode === DisconnectReason.connectionClosed) {
          status = "connectionClosed";
          message = "Connection closed, reconnecting....";
          console.log("Connection closed, reconnecting....");

          await delay(2000);
          await this.init();
        } else if (statusCode === DisconnectReason.connectionLost) {
          status = "connectionLost";
          message = "Connection lost, reconnecting....";
          console.log("Connection lost, reconnecting....");

          await delay(2000);
          await this.init();
        } else if (statusCode === DisconnectReason.connectionReplaced) {
          status = "connectionReplaced";
          message =
            "Connection Replaced, Another New Session Opened, Please Close Current Session First";
          console.log(
            "Connection Replaced, Another New Session Opened, Please Close Current Session First"
          );

          await delay(2000);
          await this.init();
        } else if (statusCode === DisconnectReason.loggedOut) {
          this.isConnected = false;

          if (this.qrTimeout) {
            status = "QR Timeout";
            message = "Click on retry to regenerate the QR!";
            console.log("QR Timeout");
          } else {
            status = "loggedOut";
            message = "Device Logged Out, Deleting Session.";
            console.log(`Device Logged Out, Deleting Session.`);
            //this.remove_session();  // Delete session file

            if (shouldReconnect) {
              await delay(5000);
              await this.init();
            } else {
              await delay(1000);

              try {
                unlinkSync(
                  path.join(__dirname, `../sessions/${this.key}.json`)
                );
              } catch (e) {
                console.log("session file delete - " + e);
              }

              this.instance.online = false;
            }
          }
          //   }else{
          //     //await delay(2000);
          //     await this.init();
          //   }

          //this.instance.sock = null;
          //this.sock = null;
          //await delay(2000);

          //await this.init();
        } else if (statusCode === DisconnectReason.restartRequired) {
          status = "restartRequired";
          message = "Restart required, restarting...";
          console.log("Restart required, restarting...");

          this.restart = true;

          //this.sock = null;
          //this.instance.sock = null;

          // unlinkSync(
          //     path.join(__dirname, `../sessions/${this.key}.json`)
          // )
          // this.instance.online = false

          await delay(2000);
          await this.init();
        } else if (statusCode === DisconnectReason.timedOut) {
          status = "timedOut";
          message = "Connection timedOut, reconnecting...";
          console.log("Connection timedOut, reconnecting...");

          await delay(5000);
          await this.init();
        } else {
          console.log(lastDisconnect.error);
          status = "error";
          message = lastDisconnect.error.toString();
        }

        // ref.update({
        //   status: status,
        //   message: message,
        // });

        await Instance.updateOne(
          { _id: this.key },
          { status: status, message: message, number: "" }
        );

        // Restart bot (You can call the start bot function)
        //this.destroy(false);

        // unlinkSync(
        //     path.join(__dirname, `../sessions/${this.key}.json`)
        // )
        // this.instance.online = false
      } else if (connection === "open") {
        // Wait 5 seg for linked qr process to whatsapp
        await delay(2000);
        // Bot is Ready (I execute my code when bot is ready)
        //await this._ready();
        this.instance.online = true;

        this.isConnected = true;

        const { version, isLatest } = await fetchLatestBaileysVersion();

        console.log(
          `Started using WA v${version.join(".")}, isLatest: ${isLatest}`
        );

        await Instance.update(
          { _id: this.key },
          { status: "Ready", message: "Connection success" }
        );

        // ref.update({
        //   status: "Ready",
        //   message: "Connection success",
        //   qr: "",
        // });

        //console.log("vishwajit sock",sock)
        //console.log("vishwajit user",typeof sock?.user === "object" ? sock?.user : "cannot find user")

        if (typeof sock?.user === "object") {
          const user = sock?.user;
          if (user) {
            // {
            //   [0]   id: '917698845235:71@s.whatsapp.net',
            //   [0]   verifiedName: 'radhe tiwari',
            //   [0]   name: 'radhe tiwari'
            //   [0]
            // }

            await Instance.update(
              { _id: this.key },
              { number: user.id.split(":")[0] }
            );
          }
        }
      }
    });

    // on new mssage
    sock?.ev.on("messages.upsert", async (m) => {
      console.log("messages.upsert type", m.type);
      console.log("messages.upsert", m);
      if (m.type == "prepend") this.instance.messages.unshift(...m.messages);
      if (m.type != "notify") return;

      this.instance.messages.unshift(...m.messages);

      m.messages.map(async (msg) => {
        if (!msg.message) return;
        if (msg.key.fromMe) return;

        const messageType = Object.keys(msg.message)[0];
        if (
          ["protocolMessage", "senderKeyDistributionMessage"].includes(
            messageType
          )
        )
          return;

        const webhookData = {
          key: this.key,
          ...msg,
        };

        if (messageType === "conversation") {
          webhookData["text"] = m;
        }
        this.SendWebhook(webhookData);
      });

      const msg = m.messages[0];
      var name = msg.pushName != undefined ? msg.pushName || msg.notify : "";
      //auto reply
      console.log("userId - " + this.userId);
      console.log("message - " + JSON.stringify(msg));
      console.log("A message from", name);

      console.log("messages size", this.instance.messages.length);
      console.log("messages size2", m.messages.length);

      // try {
      //   console.log("loadMessage start");
      //   const messages = await this.store.loadMessages(msg.key.remoteJid, message => console.log("Loaded message with ID: " + message.key.id))

      //   console.log("loadMessage queried all messages - "+messages.length);
      // } catch (e) {
      //   console.log("loadMessage error", e.message); //error Not expecting a response
      // }

      // const {messages} = await this.instance.sock?.loadMessages(msg.key.remoteJid, 5)
      // if (messages.length === 1) { // assuming you just got the first message from them
      //   console.log ('new chat')
      //   await this.instance.sock?.sendMessage (msg.key.remoteJid, {
      //     text:'hello there!'
      //   })
      // }

      // var name = "";
      // if(msg.pushName){
      //   name = msg.pushName;
      // }

      //{"key":{"remoteJid":"918238394252@s.whatsapp.net","fromMe":false,"id":"40AFB61281A03C11FC12717ED546F9F7"},"messageTimestamp":1649361431,"pushName":"Vishvajeetsinh","message":{"conversation":"Hsis","messageContextInfo":{"deviceListMetadata":{"senderKeyHash":"pKyD/oZCjJ7KFQ==","senderTimestamp":"1649161038","recipientKeyHash":"kJaOAzQAX4/95A==","recipientTimestamp":"1649248877"},"deviceListMetadataVersion":2}}}

      const number = msg.key.remoteJid.split("@")[0];

      if (msg.key.remoteJid === "status@broadcast") return;

      var msgBody = "";

      if (msg.message) {
        if (msg.message.buttonsResponseMessage) {
          msgBody = msg.message.buttonsResponseMessage.selectedDisplayText;
        } else if (msg.message.extendedTextMessage) {
          msgBody = msg.message.extendedTextMessage.text;
        } else if (msg.message.conversation) {
          msgBody = msg.message.conversation;
        } else if (msg.message.templateButtonReplyMessage) {
          msgBody = msg.message.templateButtonReplyMessage.selectedDisplayText;
        } else if (msg.message.listResponseMessage) {
          msgBody = msg.message.listResponseMessage.title;
        }
      } else {
        console.log("no message found");
        return;
      }

      var ar = null;
      console.log("message type - " + m.type);

      if (!msg.key.fromMe) {
        //log received Message
        const m = await ReceivedMessage.create({
          instanceId: this.key,
          userId: this.userId,
          message: msgBody,
          number: number,
        });

        console.log("message not from me");

        ar = await AutoReply.findOne({
          userId: this.userId,
          instanceId: this.key,
          keyword: msgBody,
        });

        if (!ar) {
          var last7Days = moment().utc().subtract(7, "days").toDate();

          //check message sent on this number
          const prevMessage = await Message.findOne({
            number: number,
            instanceId: this.key,
            createdAt: { $gte: last7Days },
          });

          //send welcome message if no conversation
          if (!prevMessage) {
            console.log("no conversation found");
            ar = await Template.findOne({
              userId: this.userId,
              isWelcome: true,
            });
          }
        }
      } else {
        console.log("message from me");
      }

      if (ar) {
        console.log("Auto Reply Found - " + msg.body);
        var message = ar.message.replace("%name%", name);

        const m = await Message.create({
          instanceId: this.key,
          userId: this.userId,
          message: message,
          number: number,
          type: ar.type,

          button1: ar.button1,
          button2: ar.button2,
          button3: ar.button3,

          middle: ar.middle,
          footer: ar.footer,
          button: ar.button,

          menus: ar.menus,
          callButton: ar.callButton,
          callingNumber: ar.callingNumber,

          webUrlButton: ar.webUrlButton,
          webUrl: ar.webUrl,

          caption: ar.caption ?? "",
          media: ar.media ?? "",
          fileType: ar.fileType ?? "",
          fileName: ar.fileName ?? "",

          autoReply: true,
        });

        //send media
        if ((ar.type == 1 || ar.type == 3 || ar.type == 5) && ar.media) {
          console.log("Auto Reply - " + ar.id + "media found - " + ar.media);

          const result = await this.sendMediaFile3(
            number,
            ar.media,
            ar.fileType,
            ar.fileName,
            ar.caption
          );

          if (result) {
            m.status = 1;
          } else {
            m.status = 2;
          }

          await m.save();
        } else {
          console.log("Auto Reply - " + message.id + " no media found ");
        }

        if (ar.type == 0 || ar.type == 1) {
          const result = await this.sendTextMessage(number, message);

          if (result) {
            m.status = 1;
          } else {
            m.status = 2;
          }

          await m.save();
        } else if (ar.type == 2 || ar.type == 3) {
          var buttons = [];

          if (ar.button1 != "") {
            buttons.push({ type: "replyButton", title: ar.button1 });
          }

          if (ar.button2 != "") {
            buttons.push({ type: "replyButton", title: ar.button2 });
          }

          if (ar.button3 != "") {
            buttons.push({ type: "replyButton", title: ar.button3 });
          }

          const btndata = {
            text: message,
            buttons: buttons,
            footerText: ar.footer,
          };

          const result = await this.sendButtonMessage(number, btndata);

          if (result) {
            m.status = 1;
          } else {
            m.status = 2;
          }

          await m.save();
        } else if (ar.type == 4 || ar.type == 5) {
          var buttons = [];

          if (ar.callButton != "") {
            buttons.push({
              type: "callButton",
              title: ar.callButton,
              payload: ar.callingNumber,
            });
          }

          if (ar.webUrlButton != "") {
            buttons.push({
              type: "urlButton",
              title: ar.webUrlButton,
              payload: ar.webUrl,
            });
          }

          const btndata = {
            text: message,
            buttons: buttons,
            footerText: ar.footer,
          };

          const result = await this.sendButtonMessage(number, btndata);

          if (result) {
            m.status = 1;
          } else {
            m.status = 2;
          }

          await m.save();
        } else if (ar.type == 6) {
          var menuList = [];

          ar.menus.forEach((menuItem, i) => {
            if (menuItem) {
              menuList.push({
                title: menuItem.title ?? "",
                description: menuItem.description ?? "",
                rowId: "menu-" + i,
              });
            }
          });

          const listData = {
            buttonText: ar.button ?? "",
            text: ar.middle ?? "",
            title: "",
            description: ar.footer ?? "",
            sections: [
              {
                title: message,
                rows: menuList,
              },
            ],
            listType: 0,
          };

          const result = await this.sendListMessage(number, listData);

          if (result) {
            m.status = 1;
          } else {
            m.status = 2;
          }

          await m.save();
        }
      } else {
        console.log("Auto Reply Not Found - " + msg.body);
      }
    });
  }

  async getInstanceDetail(key) {
    return {
      instance_key: key,
      phone_connected: this.instance?.online,
      user: this.instance?.online ? this.instance.sock?.user : {},
    };
  }

  getWhatsAppId(number) {
    var id = `${number}`;

    if (id.includes("@g.us") || id.includes("@s.whatsapp.net")) return id;
    return id.includes("-") ? `${id}@g.us` : `${id}@s.whatsapp.net`;
  }

  async verifyId(number) {
    try {
      var id = `${number}`;
      if (id.includes("@g.us")) return true;
      const [result] = await this.instance.sock?.onWhatsApp(id);
      if (result?.exists) return true;
      throw new Error("no account exists");
    } catch (e) {
      return false;
    }
  }

  async sendTextMessage(to, message) {
    try {
      await this.verifyId(this.getWhatsAppId(to));
      const data = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        {
          text: message,
        }
      );
      return data;
    } catch (e) {
      console.log("sendTextMessage catch e - " + e);
      return false;
    }
  }

  async sendMediaFile2(to, file, type, caption = "", filename) {
    try {
      await this.verifyId(this.getWhatsAppId(to));

      const buffer = await readFileSync(file.tempFilePath);

      var mimeType = type;
      // if(filename.endWith(".pdf")){
      //   mimeType = "application/pdf"
      // }

      var target = {};

      if (["image", "video", "audio"].indexOf(mimeType.split("/")[0]) > -1) {
        console.log("file type is media");
        target = {
          mimetype: file.mimetype,
          [mimeType]: buffer,
          caption: caption,
          ptt: type === "audio" ? true : false,
          fileName: filename ? filename : file.name,
        };
      } else {
        console.log("file type is document");
        target = {
          mimetype: file.mimetype,
          caption: caption,
          document: buffer,
          fileName: filename ? filename : file.name,
        };
      }

      const data = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        target
        // {
        //   mimetype: file.mimetype,
        //   [mimeType]: buffer,
        //   caption: caption,
        //   ptt: type === "audio" ? true : false,
        //   fileName: filename ? filename : file.name,
        // }
      );
      return data;
    } catch (e) {
      console.log("sendMediaFile2 error - " + e);
      return false;
    }
  }

  async sendMediaMessage(to, target) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.instance.sock?.sendMessage(to, target);

        if (data) {
          resolve(data);
        } else {
          reject(false);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async sendMediaFile3(to, filePath, type, fileName, caption = "") {
    return new Promise(async (resolve, reject) => {
      try {
        await this.verifyId(this.getWhatsAppId(to));

        console.log("media - " + filePath);
        console.log("mimetype - " + type);
        console.log("fileName - " + fileName);
        console.log("caption - " + caption);

        try {
          if (existsSync(filePath)) {
            const buffer = readFileSync(filePath);

            buffer instanceof Buffer;

            //const buffer = Buffer.from(new Uint8Array(await (await fetch(filePath)).arrayBuffer()));

            //console.log("buffer: " + buffer);

            if (buffer) {
              // const fileType = type.split("/")[0];

              var mimeType = type;
              // if(fileName.endwith(".pdf")){
              //   mimeType = "application/pdf"
              // }
              var target = {};
              const fileType = mimeType.split("/")[0];

              if (["image", "video", "audio"].indexOf(fileType) > -1) {
                console.log("file type is media");
                target = {
                  mimetype: type,
                  //[mimeType]: buffer,
                  // [mimeType]:{
                  //   url: buffer,
                  // },
                  [fileType]: buffer,
                  caption: caption,
                  ptt: mimeType === "audio" ? true : false,
                  fileName: fileName,
                };

                if (fileType == "image") {
                  target = {
                    ...target,
                    jpegThumbnail: buffer.toString("base64"),
                  };
                }
              } else {
                console.log("file type is document");
                target = {
                  mimetype: mimeType,
                  caption: caption,
                  document: buffer,
                  fileName: fileName,
                };
              }

              // const data = await this.sendMediaMessage( this.getWhatsAppId(to),
              // target);

              const data = await this.instance.sock?.sendMessage(
                this.getWhatsAppId(to),
                target
              );

              console.log("media sent success - " + data);
              resolve(true);
            } else {
              //return false;
              resolve(false);
            }

            // otherwise log contents
            //console.log(buffer.toString());

            /*
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat....
          ...
          */
          } else {
            console.log("send media file not exist");
            resolve(false);
          }
        } catch (e) {
          console.log("send media error - " + e);
          resolve(false);
        }
      } catch (e) {
        console.log("sendMediaFile3 error - " + e);
        resolve(false);
      }
    });
  }

  async sendMediaFile(to, file, type, caption = "", filename) {
    try {
      await this.verifyId(this.getWhatsAppId(to));
      const data = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        {
          mimetype: file.mimetype,
          [type]: file.buffer,
          caption: caption,
          ptt: type === "audio" ? true : false,
          fileName: filename ? filename : file.originalname,
        }
      );
      return data;
    } catch (e) {
      console.log("sendMediaFile error - " + e);
      return false;
    }
  }

  async sendUrlMediaFile(to, url, type, mimeType, caption = "") {
    try {
      await this.verifyId(this.getWhatsAppId(to));

      const data = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        {
          [type]: {
            url: url,
          },
          caption: caption,
          mimetype: mimeType,
        }
      );
      return data;
    } catch (e) {
      console.log("sendUrlMediaFile error - " + e);
      return false;
    }
  }

  async DownloadProfile(of) {
    await this.verifyId(this.getWhatsAppId(of));
    const ppUrl = await this.instance.sock?.profilePictureUrl(
      this.getWhatsAppId(of),
      "image"
    );
    return ppUrl;
  }

  async getUserStatus(of) {
    await this.verifyId(this.getWhatsAppId(of));
    const status = await this.instance.sock?.fetchStatus(
      this.getWhatsAppId(of)
    );
    return status;
  }

  async logContacts() {
    // const result = this.store.contacts;
    // if (result) {
    //   console.log("contact found");
    //   console.log("contacts - " + JSON.stringify(result));
    // } else {
    //   console.log("contact not found");
    // }
  }

  async getContact(of) {
    // const num = this.getWhatsAppId(of);
    // const result = this.store.contacts[num]?.name ?? "no name";
    // return result;

    return "";

    //const result = await  this.instance.sock?.onWhatsApp(of);
    //return result;

    /*  if(num.includes('g.us')){
      return this.instance.contacts[num].name    
   }else if(num.includes('.net')){
      return this.instance.contacts[num].notify    
   }else {
      return ''
   } */

    //return this.instance.contacts[num] != undefined ? this.instance.contacts[num].vname || this.instance.contacts[num].notify : undefined
  }

  async blockUnblock(to, data) {
    await this.verifyId(this.getWhatsAppId(to));
    const status = await this.instance.sock?.updateBlockStatus(
      this.getWhatsAppId(to),
      data
    );
    return status;
  }

  async sendButtonMessage(to, data) {
    try {
      await this.verifyId(this.getWhatsAppId(to));
      const result = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        {
          templateButtons: processButton(data.buttons),
          text: data.text ?? "",
          footer: data.footerText ?? "",
        }
      );
      return result;
    } catch (e) {
      console.log("sendButtonMessage error - " + e);
      return false;
    }
  }

  async sendContactMessage(to, data) {
    try {
      await this.verifyId(this.getWhatsAppId(to));
      const vcard = generateVC(data);
      const result = await this.instance.sock?.sendMessage(
        await this.getWhatsAppId(to),
        {
          contacts: {
            displayName: data.fullName,
            contacts: [{ displayName: data.fullName, vcard }],
          },
        }
      );
      return result;
    } catch (e) {
      console.log("sendContactMessage error - " + e);
      return false;
    }
  }

  async sendListMessage(to, data) {
    try {
      await this.verifyId(this.getWhatsAppId(to));
      const result = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        {
          text: data.text,
          sections: data.sections,
          buttonText: data.buttonText,
          footer: data.description,
          title: data.title,
        }
      );
      return result;
    } catch (e) {
      console.log("sendListMessage error - " + e);
      return false;
    }
  }

  async sendMediaButtonMessage(to, data) {
    try {
      await this.verifyId(this.getWhatsAppId(to));

      const result = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to),
        {
          [data.mediaType]: {
            url: data.image,
          },
          footer: data.footerText ?? "",
          caption: data.text,
          templateButtons: processButton(data.buttons),
          mimetype: data.mimeType,
        }
      );
      return result;
    } catch (e) {
      console.log("sendMediaButtonMessage error - " + e);
      return false;
    }
  }

  // Group Methods
  parseParticipants(users) {
    return users.map((users) => this.getWhatsAppId(users));
  }

  async createNewGroup(name, users) {
    const group = await this.instance.sock?.groupCreate(
      name,
      users.map(this.getWhatsAppId)
    );
    return group;
  }

  async addNewParticipant(id, users) {
    try {
      const res = await this.instance.sock?.groupAdd(
        this.getWhatsAppId(id),
        this.parseParticipants(users)
      );
      return res;
    } catch {
      return {
        error: true,
        message:
          "Unable to add participant, you must be an admin in this group",
      };
    }
  }

  async makeAdmin(id, users) {
    try {
      const res = await this.instance.sock?.groupMakeAdmin(
        this.getWhatsAppId(id),
        this.parseParticipants(users)
      );
      return res;
    } catch {
      return {
        error: true,
        message:
          "unable to promote some participants, check if you are admin in group or participants exists",
      };
    }
  }

  async demoteAdmin(id, users) {
    try {
      const res = await this.instance.sock?.groupDemoteAdmin(
        this.getWhatsAppId(id),
        this.parseParticipants(users)
      );
      return res;
    } catch {
      return {
        error: true,
        message:
          "unable to demote some participants, check if you are admin in group or participants exists",
      };
    }
  }

  async getAllGroups() {
    // let AllChat = await Chat.findOne({key: key}).exec();
    return this.instance.chats.filter((c) => c.id.includes("@g.us"));
  }

  async leaveGroup(id) {
    const group = this.instance.chats.find((c) => c.id === id);
    if (!group) throw new Error("no group exists");
    return await this.instance.sock?.groupLeave(id);
  }

  async getInviteCodeGroup(id) {
    const group = this.instance.chats.find((c) => c.id === id);
    if (!group)
      throw new Error("unable to get invite code, check if the group exists");
    return await this.instance.sock?.groupInviteCode(id);
  }
}

exports.WhatsAppInstance = WhatsAppInstance;
