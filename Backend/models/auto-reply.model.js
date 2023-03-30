// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const menuSchema = new Schema({
//   title: {
//     type: String,
//     required: false,
//   },
//   description: {
//     type: String,
//     required: false,
//   },
// })

// const autoReplySchema = new Schema({

//   userId:{
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref:"user",
//   },

//   instanceId:{
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref:"intance",
//   },

//   keyword: {
//     type: String,
//     required: true,
//     default:""
//   },
 
//   type: {
//     type: Number,
//     // 0 => 'text'
//     // 1 => 'text-with-media
//     // 2 => 'quick-reply-button'
//     // 3 => 'quick-reply-button-with-media'
//     // 4 => 'call-to-action-button'
//     // 5 => 'call-to-action-button-with-media'
//     default: 0,
//     required: true,
//   },

//   message: {
//     type: String,
//     required: true,
//     default:""
//   },

//   button: {
//     type: String,
//     required: false,
//   },

//   button1: {
//     type: String,
//     required: false,
//   },
//   button2: {
//     type: String,
//     required: false,
//   },
//   button3: {
//     type: String,
//     required: false,
//   },
//   footer: {
//     type: String,
//     required: false,
//   },

//   middle: {
//     type: String,
//     required: false,
//   },

//   callButton: {
//     type: String,
//     required: false,
//   },

//   callingNumber: {
//     type: String,
//     required: false,
//   },

//   webUrlButton: {
//     type: String,
//     required: false,
//   },

//   webUrl: {
//     type: String,
//     required: false,
//   },

//   menus: [{
//     type: menuSchema,
//     required: false,
//   }],

//   caption: {
//     type: String,
//     required: false,
//   },

//   media: {
//     type: String,
//     required: false,
//   },

//   fileType: {
//     type: String,
//     required: false,
//   },

//   fileName: {
//     type: String,
//     required: false,
//   },
// },
// {
//   timestamps: true,

//   toJSON: {
//     virtuals: true
//   },
//   toObject: {
//     virtuals: true
//   }
// }
// );

// const AutoReply = mongoose.model("autoreply", autoReplySchema);

// module.exports = AutoReply;

const path = require("path");
const Datastore = require("nedb-promises");
const AutoReply = Datastore.create(path.join(__dirname, '../database/autoreplys.db'))
module.exports = AutoReply;