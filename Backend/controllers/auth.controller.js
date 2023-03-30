const momentUtil = require('moment');
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user.model");
const crypto = require("crypto");

const { nanoid } = require("nanoid");

const mailUtil = require("../utils/sendEmail.js")


const Message = require("../models/message.model");
const Instance = require("../models/instance.model");
const Template = require("../models/template.model");
const AutoReply = require("../models/auto-reply.model");


exports.testSignIn = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    sendToken(user, false, 200, res);
  } else {
    res.status(200).send({
      status: false,
      message: "user not exist",
    });
  }
};

// @desc    Login user
exports.login = async (req, res, next) => {

  let idToken = req.body.id_token;
  let authType = "email"; //req.body.auth_type;

  console.log(JSON.stringify(req.body));
  
  try {

    console.log('user login - '+idToken);

    admin.auth().verifyIdToken(idToken)
  .then(async function (decodedToken) {

    let uid = decodedToken.uid;
    console.log('user id - '+uid);

    // Check that user exists by email
    const user = await User.findOne({ uid });

    if (!user) {

      // return res.status(200).send({
      //   status: false,
      //   message: "User not found"
      // });

      //find user details
    admin.auth().getUser(uid).then(async (userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);

        //create user
        var newKey = nanoid(10);
      const newUser = await User.insert({
        authType,
        uid,
        phone:userRecord.phoneNumber,
        apiKey:newKey
      });


      sendToken(newUser,true, 200, res);

    })
    .catch((err) => {
      return res.status(200).json({ status: false, message:err.message});
    
    })

     
    }else{
      //sendToken(user, false,200, res);
      if(user.status == "deactive"){
        return res.status(200).send({
          status: false,
          message: "Your account is not activated, Please contact to admin"
        });
      }else{
        sendToken(user, false,200, res);
      }
    }

  
  })
  .catch(err => {

    console.log("firebase idToken error - " + err.message);
    return res.status(200).json({ status: false, message:err.message});
    //return next(new ErrorResponse(err.message, 200));

  });

  } catch (err) {
    //next(err);
    return res.status(200).json({ status: false, message:err.message});
  }
};

exports.signUp = async (req, res, next) => {

  console.log("signup celled");

  let email = req.body.email;
  let phone = req.body.phone??"";
  let name = req.body.name;
  let authType = req.body.auth_type;

  let role = req.body.role != null ? req.body.role : "user";


  if(role == "admin"){
    return res.status(200).send({
      status: false,
      message: "Admin role not allowed",
    });
  }

  try {
    var newKey = nanoid(10);
    var uid = nanoid(16);

    const user = await User.insert({
      name: name,
      uid: uid,
      authType: authType,
      email: email,
      phone: phone,
      role: role,
      status: "active",
      apiKey:newKey
    });

    return res.status(200).send({
      status: true,
      message: "user signup successfully"
    });

    
  } catch (err) {
    //next(err);
    return res.status(200).send({
      status: false,
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email, url } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      //return next(new ErrorResponse("No email could not be sent", 200));
      res
        .status(200)
        .json({ success: false, message: "No email could not be sent" });
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    //const resetUrl = `https://pvc2print.com/password-reset/${resetToken}`;

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for
      // this URL must be whitelisted in the Firebase Console.
      url: url,
      // This must be true for email link sign-in.
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.pvc2print",
      },
      android: {
        packageName: "com.pvc2print",
      },
      // FDL custom domain.
      dynamicLinkDomain: "pvc2print.page.link",
    };

    try {
      // Admin SDK API to generate the password reset link.
      admin
        .auth()
        //sendPasswordResetEmail(email)
        .generatePasswordResetLink(email)
        .then(async (link) => {
          // Construct password reset email template, embed the link and send
          // using custom SMTP server.
          //return sendCustomPasswordResetEmail(userEmail, displayName, link);

          let mailBody = {
            signature: false,
            name: user.name,
            intro:
              "You have received this email becasuse a password reset request for your account was received.",
            action: {
              instructions: "Click the button below to reset your password:",
              button: {
                color: "#d44a28", // Optional action button color
                text: "Reset your password",
                link: link,
              },
            },
            outro:
              "If you did not request a password reset, no further action is required on your part.",
          };

          var isMailSent = await mailUtil.send(
            user.email,
            "Bulky Marketing Password Reset",
            mailBody,
            0
          );
          return res.status(200).json({ status: true, message: "Email Sent" });
        })
        .catch((error) => {
          // Some error occurred.
          console.log(error);
          return res
            .status(200)
            .json({ status: false, message: "Email could not be sent" });
        });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      console.log(err);

      await user.save();
      res
        .status(200)
        .json({ success: false, message: "Email could not be sent" });
      //return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset User Password
exports.resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(200)
        .json({ success: false, message: "Invalid Reset Password Token" });
      //return next(new ErrorResponse("Invalid Token", 400));
    }

    console.log("fire uid - " + user.uid);

    admin
      .auth()
      .updateUser(user.uid, {
        password: req.body.password,
      })
      .then(async (userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully updated user", userRecord.toJSON());

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(201).json({
          success: true,
          message: "Password Updated Success",
          token: user.getSignedJwtToken(),
        });
      })
      .catch((error) => {
        console.log("Error updating user:", error);

        res.status(201).json({
          success: false,
          message: "Password Update failed!",
        });
      });

    //user.password = req.body.password;
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
exports.profile = async (req, res, next) => {

  const user = req.user;

  if(user){
    return res.status(200).json({
      status: true,
      profile:{
        id:user.id,
        uid:user.uid,
        name:user.name,
        email:user.email,
        phone:user.phone,
        city:user.city,
        profile:user.profile,
        apiKey:user.apiKey
      },
    });
  }else{
    return res.status(200).json({
      status: false,
      message:"profile not found"
    });
  }

}


exports.createInstance = async (req, res, next) => {

  
  const { instance,user_id,expire_date } = req.body;

  const user = await User.findOne({
    _id:user_id,
  });

  if (user) {

      for(var i=0;i<Number(instance);i++){

        // var currentDate = Date.now();
        // var nextPaymentDate = moment(currentDate);
        // nextPaymentDate.add(365, "days").format("YYYY-MM-DD hh:mm");

        await Instance.insert({
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


exports.saveFcmToken = async (req, res, next) => {

  try {
  const user = await User.findOne({
    _id:req.user.id,
  });

  if(user){
    user.fcmToken = req.body.token;
    await user.save();
    return res.status(200).json({
      status: true,
      message: "Fcm token saved",
    });
  }else{

    return res.status(200).json({
      status: false,
      message: "User not found",
    });
  }
    
   
} catch (err) {
  return res.status(200).json({
    status: false,
    message: "server error",
  });
}

}


exports.generateKey = async (req, res, next) => {
        var newKey = nanoid(10);

        req.user.apiKey = newKey;
        await req.user.save();
        return res.status(200).json({status:true, key: newKey });
}



exports.setProfile = async (req, res, next) => {

  try {
  // const user = await User.findOne({
  //   _id:req.user.id
  // });

  console.log("name - "+req.body.name+", email - "+req.body.email+", city - "+req.body.city)

  const user = req.user;


  if(user){

    user.name = req.body.name;
    user.email = req.body.email;
    user.city = req.body.city;

    await user.save();
    return res.status(200).json({
      status: true,
      message: "Pofile updated",
    });
  }else{

    return res.status(200).json({
      status: false,
      message: "Profile update failed!",
    });
  }
    
   
} catch (err) {
  return res.status(200).json({
    success: false,
    message: "server error",
    err:err
  });
}

}




exports.statistics = async (req, res) => {

  console.log("statistics start",req.body);
  const instances = await Instance.find({});
  // const instances = await Instance.find({userId:user.id,isDeleted:{$ne:true},}).count();

  const messages = await Message.find({});
  // const messages = await Message.find({userId:user.id}).count();

  const autoReply = await AutoReply.find({});
  // const autoReply = await AutoReply.find({userId:user.id}).count();

  const templates = await Template.find({});
  // const templates = await Template.find({userId:user.id}).count();


  return res.status(200).json({
    status: true,
    instances: instances.length,
    messages: messages.length,
    autoReply: autoReply.length,
    templates: templates.length
  });
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



