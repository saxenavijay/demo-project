// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const instanceSchema = Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: "user",
//     },

//     name: {
//       type: String,
//       required: false,
//       default: "",
//     },

//     number: {
//       type: String,
//       required: false,
//       default: "",
//     },

//     code: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       //enum: ['new','qr', 'ready','authenticated','auth_failure','disconnected'],
//       default: "New",
//       required: false,
//     },

//     message: {
//       type: String,
//       //enum: ['new','qr', 'ready','authenticated','auth_failure','disconnected'],
//       default: "",
//       required: false,
//     },

//     qr: {
//       type: String,
//       required: false,
//     },

//     connected: {
//       type: Boolean,
//       required: false,
//       default: false,
//     },

//     isDeleted: {
//       type: Boolean,
//       required: false,
//       default: false,
//     },

//     isResell: {
//       type: Boolean,
//       required: false,
//       default: false,
//     },

//     resellerId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: "user",
//     },

//     expire: {
//       type: Date,
//       required: false,
//     },

//   },

//   {
//     timestamps: true,

//     toJSON: {
//       virtuals: true,
//     },
//     toObject: {
//       virtuals: true,
//     },
//   }
// );

// const Instance = mongoose.model("intance", instanceSchema);

// module.exports = Instance;

const path = require("path");
const Datastore = require("nedb-promises");
const Instance = Datastore.create(path.join(__dirname, '../database/instances.db'))
module.exports = Instance;
