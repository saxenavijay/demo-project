// const Order = require("../models/order.model");
// const Pack = require("../models/pack.model");
const Contact = require("../models/contact.model");
const User = require("../models/user.model");
const mailUtil = require("../utils/sendEmail.js");
// var admin = require("firebase-admin");
// var db = admin.database();
const { nanoid } = require("nanoid");
// const App = require("../models/app.model");

// const Feedback = require("../models/feedback.model");
const Instance = require("../models/instance.model");
const Message = require("../models/message.model");
const Campaign = require("../models/campaign.model");
const mongoose = require("mongoose");

const moment = require("moment");

var axios = require("axios");

var ObjectID = require("mongodb").ObjectID;

// const fcm = require("../utils/sendFcm");

const path = require("path");
const fs = require("fs");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


// @desc    Login user
const login = async (req, res, next) => {

  let userId = req.body.user_id;
  let authType = "email"; //req.body.auth_type;

  console.log(JSON.stringify(req.body));
  
  try {

    let uid = userId;

    console.log('user id - '+uid);

    var role = "admin";

    // Check that user exists by email
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(200).json({ status: false, message:"user not found"});
    }else{

      if(user.role != "admin"){
        return res.status(200).json({ status: false, message:"Access Denied"});
      }else{
        sendToken(user, false,200, res);
      }

      
    }

  } catch (err) {
    //next(err);
    return res.status(200).json({ status: false, message:err.message});
  }
};

const sendToken = (user,new_user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const profileData = {
    id:user.id,
    uid:user.uid,
    name:user.name,
    email:user.email,
    phone:user.phone,
    city:user.city,
    profile:user.profile,
    new_user:new_user,
    apiKey:user.apiKey,
  }
  res.status(statusCode).json({ status: true, token,user:profileData });
};

function escapeRegExpChars(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

const appData = async (req, res) => {
  try {
    const app = await App.findOne({});

    if (app) {
      return res.json({
        status: true,
        data: app,
      });
    } else {
      return res.json({
        status: false,
        message: "app data not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Server Error" });
  }
};

const saveAppData = async (req, res) => {
  const app = await App.findOne({});
  if (app) {
    app.name = req.body.name;
    app.description = req.body.description;
    app.androidUpdate = req.body.android_update;
    app.androidVersion = Number(req.body.android_version);
    //app.androidUpdate = req.body.android_update;
    app.playStoreUrl = req.body.playstore_url;
    app.newsUpdate = req.body.news_update;

    if (req.body.front_banner_image) {
      app.frontBanner.image = req.body.front_banner_image;
    }

    if (req.body.front_banner_link) {
      app.frontBanner.link = req.body.front_banner_link;
    }

    if (req.body.back_banner_image) {
      app.backBanner.image = req.body.back_banner_image;
    }

    if (req.body.back_banner_link) {
      app.backBanner.link = req.body.back_banner_link;
    }

    await app.save();

    return res.status(200).json({
      status: true,
      message: "App details updated!",
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "App details not found",
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (req.files.image) {
      var filePath = req.files.image.tempFilePath;
      console.log("file path - " + filePath);

      const fileContent = fs.readFileSync(filePath);
      var fileType = req.body.type ?? "image";
      var fileName = req.files.image.name;
      var fileExt = path.extname(fileName);

      var uploadFileName = fileType + "-" + nanoid() + "" + fileExt;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME, // pass your bucket name
        Key: "images/" + uploadFileName, // file will be saved as testBucket/contacts.csv
        Expires: 60,
        Body: fileContent,
        ACL: "public-read",
      };


      try {
        const data = await s3.upload(params).promise()
        console.log(data);

        console.log(`File uploaded successfully at ${data.Location}`);

        //await fs.unlink(filePath);

        return res.status(200).json({
          status: true,
          message: "Image uploaded",
          downloadUrl: data.Location,
        });

      } catch (err) {
       
        console.log("s3 error - " + err);
        return res.status(200).json({
          status: false,
          message: "Upload file failed",
          error: err,
        });
      }


      // s3.upload(params, async function (s3Err, data) {
      //   if (s3Err) {
      //     console.log("s3 error - " + s3Err);
      //     res.status(200).json({
      //       status: false,
      //       message: "Upload file failed",
      //       error: s3Err,
      //     });
      //   }

       
      // });
    } else {
      return res.status(200).json({
        status: false,
        message: "Image not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

async function checkUserInFirebase(email) {
  return new Promise((resolve) => {
    admin
      .auth()
      .getUserByEmail(email)
      .then((user) => {
        resolve({
          isError: false,
          doesExist: true,
          user,
        });
      })
      .catch((err) => {
        resolve({
          isError: true,
          err,
        });
      });
  });
}

async function createUserInFirebase(email, password, name) {
  return new Promise((resolve) => {
    admin
      .auth()
      .createUser({
        email: email,
        displayName: name,
        password: password, //uniuq
      })
      .then((user) => {
        resolve({
          isError: false,
          user,
        });
      })
      .catch((err) => {
        resolve({
          isError: true,
          err,
        });
      });
  });
}

const getOrders = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  try {
    var limit = Number(req.body.limit),
      page = Math.max(0, req.body.page);

    const search = req.body.search ? req.body.search : "";

    const status = req.body.status ?? "All";
    const paymentStatus = req.body.payment_status ?? "All";

    var ps = [];

    if (paymentStatus == "All") {
      ps = ["paid", "unpaid"];
    } else {
      ps = [paymentStatus];
    }

    if (status == "All") {
      Order.find({
        paymentStatus: { $in: ps },
        $or: [
          { name: { $regex: escapeRegExpChars(search), $options: "i" } },
          { email: { $regex: escapeRegExpChars(search), $options: "i" } },
          { phone: { $regex: escapeRegExpChars(search), $options: "i" } },
        ],
      })
        .populate("packId")
        .populate("userId")
        //.populate( {path:"items",populate: {path:"productId",model: Product,}})
        .sort({ createdAt: "desc" })
        .skip(page * limit)
        .limit(limit)
        .then((orders) => {
          return res.status(200).json({
            status: true,
            orders: orders,
          });
        })
        .catch((err) => {
          //return res.status(200).send(err);
          console.log(err);
          return res.status(200).json({
            status: false,
            message: "Orders Error",
          });
        });
    } else {
      Order.find({
        status: status,
        paymentStatus: { $in: ps },
        $or: [
          { name: { $regex: escapeRegExpChars(search), $options: "i" } },
          { email: { $regex: escapeRegExpChars(search), $options: "i" } },
          { phone: { $regex: escapeRegExpChars(search), $options: "i" } },
          { orderTotal: { $regex: escapeRegExpChars(search), $options: "i" } },
        ],
      })
        .populate("packId")
        //.populate( {path:"items",populate: {path:"productId",model: Product,}})
        .sort({ createdAt: "desc" })
        .skip(page * limit)
        .limit(limit)
        .then((orders) => {
          return res.status(200).json({
            status: true,
            orders: orders,
          });
        })
        .catch((err) => {
          //return res.status(200).send(err);
          console.log(err);
          return res.status(200).json({
            status: false,
            message: "Orders Error",
          });
        });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    /*  const order = await Order.aggregate([
            //{ $match: {id:req.params.id},},
            {
                $lookup:
                  {
                    from: "product",
                    localField: "items.productId",
                    foreignField: "id",
                    as: "items.productId"
                  }
               },
               { "$unwind": '$items.productId' },
        ]) */

    const order = await Order.findOne({
      _id: req.params.id,
    }).populate("packId");
    //.populate( {path:"items",populate: {path:"productId",model: Product,}});
    //.populate( {path:"items.productId",model: Product,});
    //.populate("activeProfile")
    //.populate('activeProfileId')
    //.populate("product");

    if (order) {
      res.status(200).json({
        status: true,
        order: order,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Order detail not faound",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const downloadInvoice = async (req, res) => {
  const { order_id } = req.body;

  const app = await App.findOne({});

  const order = await Order.findOne({
    _id: order_id,
  });

  if (order) {
    if (order.shipRocket) {
      const { status, data, message } = await new ShipRocket(
        app.shipRocket.token
      ).generateInvoice(order.shipRocket.orderId);

      console.log("invoice data - " + data);

      if (status) {
        return res.status(200).json({
          status: true,
          data: data,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "shipRocket download invoice failed",
        });
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "shipRocket detail not available",
      });
    }
  } else {
    return res.status(200).json({
      status: false,
      message: "Order not found",
    });
  }
};

const changeOrderStatus = async (req, res) => {
  const { order_id, status } = req.body;

  const order = await Order.findOne({
    _id: order_id,
  });

  if (order) {
    order.status = status;
    await order.save();

    return res.status(200).json({
      status: true,
      message: "order status is set to " + status,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Order status change failed",
    });
  }
};

const getinquiry = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  try {
    var limit = Number(req.body.limit),
      page = Math.max(0, req.body.page);

    Contact.find()
      .sort({ createdAt: "desc" })
      .skip(page * limit)
      .limit(limit)
      .then((contacts) => {
        return res.status(200).json({
          status: true,
          contacts: contacts,
        });
      })
      .catch((err) => {
        //return res.status(200).send(err);
        console.log(err);
        return res.status(200).json({
          status: false,
          message: "Contact Error",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const getFeedback = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  try {
    Feedback.find()
      .populate("userId")
      .sort({ createdAt: "desc" })
      .then((feedbacks) => {
        return res.status(200).json({
          status: true,
          feedbacks: feedbacks,
        });
      })
      .catch((err) => {
        //return res.status(200).send(err);
        console.log(err);
        return res.status(200).json({
          status: false,
          message: "Feedback Error",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const statistics = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }
  console.log("statistics start");
  const user = req.user;

  const users = await User.find({}).count();
  const campaigns = await Campaign.find({}).count();
  const instances = await Instance.find({}).count();
  const messages = await Message.find({}).count();
  const sentMessages = await Message.find({status:1}).count();
  const pendingMessages = await Message.find({status:0}).count();
  const failedMessages = await Message.find({status:2}).count();

  return res.status(200).json({
    status: true,
    users:users,
    campaigns:campaigns,
    instances: instances,
    messages: messages,
    sentMessages: sentMessages,
    pendingMessages: pendingMessages,
    failedMessages: failedMessages
  });
};


const getUsers = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  try {
    var limit = Number(req.body.limit),
      page = Math.max(0, req.body.page);

    const search = req.body.search ? req.body.search : "";

    User.find({
      role: "user",
      $or: [
        { name: { $regex: escapeRegExpChars(search), $options: "i" } },
        { email: { $regex: escapeRegExpChars(search), $options: "i" } },
        //{phone : new RegExp(search, 'i')}
        { phone: { $regex: escapeRegExpChars(search), $options: "i" } },
      ],
    })
      .populate("resellerId")
      .sort({ createdAt: "desc" })
      .skip(page * limit)
      .limit(limit)
      .then((users) => {
        return res.status(200).json({
          status: true,
          users: users,
        });
      })
      .catch((err) => {
        //return res.status(200).send(err);
        console.log(err);
        return res.status(200).json({
          status: false,
          message: "User Error",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const getUserById = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });

    if (user) {
      res.status(200).json({
        status: true,
        user: user,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "User detail not faound",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const changeUserStatus = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { user_id, status } = req.body;

  try {
    User.findOneAndUpdate(
      { _id: user_id },
      { $set: { status: status } },
      function (error, success) {
        if (error) {
          console.log(error);
          return res.status(200).json({
            status: false,
            message: "User status update failed!",
            error: error,
          });
        } else {
          console.log(success);
          return res.status(200).json({
            status: true,
            message: "User status updated",
          });
        }
      }
    );
  } catch (e) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};

const addUser = async (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { name, phone, email,password } = req.body;

  const user = await User.findOne({
    $or: [{ phone: phone }],
  });

  if (user) {
    return res.status(200).json({
      status: false,
      message: "User already found!",
    });
  } else {
    // return res.status(200).json({
    //   status:true,
    //   message:"create new user"
    // });

    const userExist = await admin.auth().getUserByPhoneNumber(phone);

    if(userExist){

      const newUser = await User.create({
        authType: "manual",
        uid: userExist.uid,
        phone: phone,
        email: email,
        name: name,
        apiKey:nanoid(10)
      });


      return res.status(200).json({
        status: true,
        message: "new user created.",
      });

    }else{

    
    admin
      .auth()
      .createUser({
        //email: email,
        //emailVerified: false,
        phoneNumber: phone,
        //password: password,
        displayName: name,
        //photoURL: '',
        disabled: false,
      })
      .then(async (userRecord) => {

        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);

        if (userRecord.uid) {
          const newUser = await User.create({
            authType: "manual",
            uid: userRecord.uid,
            phone: phone,
            email: email,
            name: name,
            apiKey:nanoid(10)
          });


          return res.status(200).json({
            status: true,
            message: "new user created.",
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "create user failed!",
          });
        }
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
        return res.status(200).json({
          status: false,
          message: error.toString(),
        });
      });

    }
  }
};

const updateUser = async (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { user_id, name, phone, email } = req.body;

  const user = await User.findOne({
    _id: user_id,
    // id: { $ne: user_id },
    // $or: [
    //   {email: email}
    // ]}
  });

  if (!user) {
    return res.status(200).json({
      status: false,
      message: "User not found!",
    });
  } else {
    // return res.status(200).json({
    //   status:true,
    //   message:"create new user"
    // });

   /*  const user2 = await User.findOne({
      _id: { $ne: user_id },
      phone: phone,
      //  $or: [
      //   {email: email,phone:phone}
      //  ]
    });

    if (user2) {
      console.log("user exist - " + user2.id);
      return res.status(200).json({
        status: false,
        message: phone + " is already used in another user.",
      });
    } */

    const user3 = await User.findOne({
      _id: { $ne: user_id },
      phone: phone,
      //  $or: [
      //   {email: email,phone:phone}
      //  ]
    });

    if (user3) {

      await admin.auth()
      .updateUser(user3.uid, {
        phoneNumber: null
      });

      console.log("remove phone number from old user")
      //   await admin.auth().updateUser(userRecord.uid, {phoneNumber: null});
      user3.phone = "";
      await user3.save();
    

      // const userRecord = await admin
      // .auth()
      // .getUserByPhoneNumber(phone);

      // if(userRecord){
      //   console.log("remove phone number from old user")
      //   await admin.auth().updateUser(userRecord.uid, {phoneNumber: null});
      //   user3.phone = "";
      //   await user3.save();
      // }

      // .then((userRecord) => {
      //   // See the UserRecord reference doc for the contents of userRecord.
      //   console.log(`Successfully fetched user data:  ${userRecord.toJSON()}`);
      //   return admin.auth().updateUser(userRecord.uid, {phoneNumber: null});
    
      // })
      // .catch((error) => {
      //   console.log('Error fetching user data:', error);
      // });

      // console.log("user exist - " + user3.id);
      // return res.status(200).json({
      //   status: false,
      //   message: phone + " phone number is already used in another user.",
      // });
    }


    //check user exist

    try{
    const ur = await admin.auth()
  .getUserByPhoneNumber(phone);

  if(ur){

    if(ur.uid != user.uid){
      await admin.auth()
      .updateUser(user3.uid, {
        phoneNumber: null
      });
    }

  }

}catch(e){
  console.log(e)
}



    admin
      .auth()
      .updateUser(user.uid, {
        //email: email,
        phoneNumber: phone,
        displayName: name,
      })
      .then(async (userRecord) => {
        console.log("Successfully updated user", userRecord.toJSON());

        user.name = name;
        user.email = email;
        user.phone = phone;
        await user.save();

        return res.status(200).json({
          status: true,
          message: "user updated.",
        });
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
        return res.status(200).json({
          status: false,
          message: "update user failed!",
        });
      });
  }
};


const createInstance = async (req, res, next) => {

  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { instance,user_id,expire_date } = req.body;

  const user = await User.findOne({
    _id:user_id,
  });

  if (user) {

      for(var i=0;i<Number(instance);i++){

        // var currentDate = Date.now();
        // var nextPaymentDate = moment(currentDate);
        // nextPaymentDate.add(365, "days").format("YYYY-MM-DD hh:mm");

        await Instance.create({
            name: "",
            code:nanoid(10),
            userId: user_id,
            expire:expire_date
          });
      }

      return res.status(200).json({
        status: true,
        message: "Instance created.",
      });
   
  } else {
    // return res.status(200).json({
    //   status:true,
    //   message:"create new user"
    // });

     return res.status(200).json({
      status: false,
      message: "User not found!",
    });
  
  }
};


const allInstance = async (req, res, next) => {
  var limit = Number(req.body.limit),
    page = Math.max(0, req.body.page);

  const inatances = await Instance.find({
    isDeleted:{$ne:1}
  })
    .sort({
      createdAt: "desc",
     
    })
    .populate("userId")
    .skip(page * limit)
    .limit(limit);

  if (inatances) {
    return res.status(200).json({
      status: true,
      inatances: inatances,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "inatances not found",
    });
  }
};

const logoutInstance = async (req, res, next) => {
  const instanceId = req.body.instance_id;

  var ref = db.ref("sessions/" + instanceId);
  ref.remove();

  await Instance.updateOne({_id:instanceId}, { status: "Logout",message:"Instance loggedout"});

  try {
    await WhatsAppInstances[instanceId].instance?.sock?.logout();
  } catch (error) {
    //errormsg = error
    console.log("error logout - " + error);
  }

  //init();

  return res.status(200).json({
    status: true,
    message: "logout success",
  });
};

const deleteInstance = async (req, res, next) => {
  const instanceId = req.body.instance_id;

  var ref = db.ref("sessions/" + instanceId);
  ref.remove();

  await Instance.updateOne({_id:instanceId}, { isDeleted:true, status: "Deleted",message:"Instance deleted success"});

  try {
    await WhatsAppInstances[instanceId].instance?.sock?.logout();
  } catch (error) {
    console.log("error logout - " + error);
  }
 
  return res.status(200).json({
    status: true,
    message: "Instance deleted.",
  });
};


const updateInstance = async (req, res, next) => {
  const {instance_id,name,valid,expire_date} = req.body;

  await Instance.updateOne({_id:instance_id}, { expire:expire_date,name:name});

  return res.status(200).json({
    status: true,
    message: "Instance updated.",
  });

};

//resellers

const assignReseller = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { user_id, reseller_id } = req.body;

  const user = await User.findOne({
    _id: user_id,
  });

  if (user) {

    user.resellerId = reseller_id;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Assign user to reseller successfully",
    });

  } else {

    return res.status(200).json({
      status: false,
      message: "Assign user to reseller failed!",
    });

  }
};


const removeReseller = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { user_id } = req.body;

  const user = await User.findOne({
    _id: user_id,
  });

  if (user) {
    //user.agentId = agent_id;
    //await user.save();

    await User.updateOne(
      { _id: user.id, resellerId: { $exists: true } },
      { $unset: { resellerId: 1 } },
      { multi: true }
    );

    return res.status(200).json({
      status: true,
      message: "Remove reseller from user successfull",
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Remove reseller from user failed!",
    });
  }
};


const getResellers = async (req, res) => {
  if (req.user.role != "admin") {
    res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  try {
    var limit = Number(req.body.limit),
      page = Math.max(0, req.body.page);

    const search = req.body.search ? req.body.search : "";

    User.aggregate([

      { $match : { 
        
        role: "reseller",
          $or: [
            { name: { $regex: escapeRegExpChars(search), $options: "i" } },
            { email: { $regex: escapeRegExpChars(search), $options: "i" } },
            { phone: { $regex: escapeRegExpChars(search), $options: "i" } },
          ], } },

          { $sort: { createdDate: -1 } },
          //{ $skip: page * limit },
          //{ $limit: limit },

      {
        $lookup:
          {
            from: "intances",
            localField: "_id",
            foreignField: "resellerId",
            "pipeline":[{"$match":{"isDeleted":false}}],
            as: "instances"
          }
     }
   ])

    // User.find({
    //   role: "reseller",
    //   $or: [
    //     { name: { $regex: escapeRegExpChars(search), $options: "i" } },
    //     { email: { $regex: escapeRegExpChars(search), $options: "i" } },
    //     { phone: { $regex: escapeRegExpChars(search), $options: "i" } },
    //   ],
    // })
    //   .sort({ createdAt: "desc" })
    //   .skip(page * limit)
    //   .limit(limit)
      .then((agents) => {
        return res.status(200).json({
          status: true,
          resellers: agents,
        });
      })
      .catch((err) => {
        //return res.status(500).send(err);
        console.log(err);
        return res.status(500).json({
          status: false,
          message: "Agent Error",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};

const resellerMembers = async (req, res) => {

  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  console.log("resellerMembers");
  const user = req.user;

  const { resller_id } = req.body;

  const search = req.body.search ? req.body.search : "";

  const members = await User.find({
    resellerId: resller_id,
    $or: [
      { name: { $regex: escapeRegExpChars(search), $options: "i" } },
      { email: { $regex: escapeRegExpChars(search), $options: "i" } },
    ],
  }).sort({ createdAt: "desc" });

  return res.status(200).json({
    status: true,
    members: members,
  });
};

//instance
const asssignInstanceToReseller = async (req, res, next) => {

  
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { instance,reseller_id,expire_date } = req.body;

  const user = await User.findOne({
    _id:reseller_id,
    role:"reseller"
  });

  if (user) {

      for(var i=0;i<Number(instance);i++){

        // var currentDate = Date.now();
        // var nextPaymentDate = moment(currentDate);
        // nextPaymentDate.add(365, "days").format("YYYY-MM-DD hh:mm");

        await Instance.create({
            isResell:true,
            resellerId:reseller_id,
            name: "",
            code:nanoid(10),
            expire:expire_date
          });

      }

      return res.status(200).json({
        status: true,
        message: "Instance assigned.",
      });
   
  } else {
    // return res.status(200).json({
    //   status:true,
    //   message:"create new user"
    // });

     return res.status(200).json({
      status: false,
      message: "Reseller not found!",
    });
  
  }
};


const getResellerById = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }
  try {
    // const user = await User.findOne({
    //   _id: req.params.id,
    // });

    const users = await User.aggregate([

      { $match : { 
        _id: new mongoose.Types.ObjectId(req.params.id),
        role: "reseller",
       }
      },

      {
        $lookup:
          {
            from: "intances",
            localField: "_id",
            foreignField: "resellerId",
            "pipeline":[
              {"$match":{"isDeleted":false}},
              {
                '$sort': {  'createdAt': -1 }
              }
            ],
            as: "instances"
          }
     },

     {
      $lookup:
        {
          from: "users",
          localField: "_id",
          foreignField: "resellerId",
          "pipeline":[
            
            {
              '$sort': {  'createdAt': -1 }
            }
          ],
          as: "members"
        }
    },

    //{$unwind:"$instances"},
    //{$match:{"instances.isDeleted":{$eq:false,$exists:false}}}


   ])

    if (users.length > 0) {
      res.status(200).json({
        status: true,
        reseller: users[0],
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Reseller detail not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Server Error",
    });
  }
};


const makeReseller = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(200).json({
      status: false,
      message: "No Access",
    });
  }

  const { user_id } = req.body;

  try {
    const user = await User.findOne({
      _id: user_id,
    });

    if (user) {
      if (user.role == "user") {
        User.findOneAndUpdate(
          { _id: user_id },
          { $set: { role: "reseller", agentLevel: 1 } },
          function (error, success) {
            if (error) {
              console.log(error);
              return res.status(200).json({
                status: false,
                message: "Make reseller failed!",
                error: error,
              });
            } else {
              console.log(success);
              return res.status(200).json({
                status: true,
                message: "Reseller created.",
              });
            }
          }
        );
      } else {
        res.status(200).json({
          status: false,
          message: "User role is different!",
        });
      }
    } else {
      res.status(200).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (e) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
};



module.exports = {
  getUserById,
  changeUserStatus,
  getOrders,
  getOrderById,
  changeOrderStatus,
  getinquiry,

  statistics,
  getUsers,
  downloadInvoice,


  getFeedback,
  addUser,
  updateUser,
  
  appData,
  saveAppData,
  uploadImage,

  createInstance,
  login,
  allInstance,

  logoutInstance,
  deleteInstance,


  getResellers,
  resellerMembers,
  asssignInstanceToReseller,
  getResellerById,
  makeReseller,
  assignReseller,
  removeReseller,
  updateInstance
};
