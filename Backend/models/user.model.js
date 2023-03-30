// const mongoose = require("mongoose");
// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const Schema = mongoose.Schema;


// const roleSchema = new Schema({
//   type: {
//     type: String,
//     required: true,
//   },
//   value: {
//     type: Boolean,
//     required: true,
//   },
// })

// const userSchema = mongoose.Schema({
//     name: {
//       type: String,
//       default: "bm user",
//       required: false,
//     },
//     uid: { //fire_user_id
//       type: String,
//       unique: true,
//       required: false,
//     },
//     authType: {
//       type: String,
//       default: "phone",
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       //unique: true,
//       //default:"",

//       //required: [false, "Please provide email address"],
//       //unique: false,
//       // match: [
//       //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//       //   "Please provide a valid email",
//       //],
//     },
//     emailVerified: {
//       type: Boolean,
//       required: false,
//     },
//     phone: {
//       type: String,
//       required: false,
//     },

//     profile: {
//       type: String,
//       required: false,
//     },
//     token: {
//       type: String,
//       required: false,
//     },
//     tokenExpire: {
//       type: Date,
//       required: false,
//     },
//     fcmToken: {
//       type: String,
//       required: false,
//     },
//     apiKey: {
//       type: String,
//       required: false,
//       unique: true,
//     },

//     role: {
//       type: String,
//       enum: ['admin', 'user','reseller'],
//       default: 'user'
//     },

//     planId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: "pack",
//     },

//     planExpire: {
//       type: Date,
//       required: false,
//     },

//     status: {
//       type: String,
//       enum: ['active', 'deactive'],
//       default: 'active'
//     },

//     instance: {
//       type: Number,
//       required: false,
//       default: 0,
//     },

//     resellerId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: "user",
//     },

//     resetPasswordToken: String,
//     resetPasswordExpire: Date,

//   },

//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true
//     },
//     toObject: {
//       virtuals: true
//     }
//   }

// );


// userSchema.methods.getSignedJwtToken = function () {
//   return jwt.sign({
//     id: this._id
//   }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// userSchema.methods.getToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // Hash token (private key) and save to database
//   this.token = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   // Set token expire date
//   this.tokenExpire = Date.now() + 60 * (60 * 1000); // Ten Minutes

//   return resetToken;
// };


// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // Hash token (private key) and save to database
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   // Set token expire date
//   this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

//   return resetToken;
// };


// const User = mongoose.model("user", userSchema);

const path = require("path");
const Datastore = require("nedb-promises");
const User = Datastore.create(path.join(__dirname, '../database/users.db'))
module.exports = User;