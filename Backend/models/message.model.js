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


// const messageSchema = new Schema({

//   campaignId:{
//     type: Schema.Types.ObjectId,
//     required: false,
//     ref:"campaign",
//   },

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
 
//   instanceNumber:{
//     type: String,
//     required: false,
//     default:""
//   },

//   number: {
//     type: String,
//     required: true,
//   },

//   type: {
//     type: Number,
//     // 0 => 'text'
//     // 1 => 'text-with-media
//     // 2 => 'quick-reply-button'
//     // 3 => 'quick-reply-button-with-media'
//     // 4 => 'call-to-action-button'
//     // 5 => 'call-to-action-button-with-media'
//     // 6 => 'list/menu message'
//     default: 0,
//     required: true,
//   },
 
//   message: {
//     type: String,
//     required: false,
//     default:""
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

//   button: {
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

//   seen: {
//     type: Boolean,
//     required: false,
//     default:false
//   },

//   autoReply: {
//     type: Boolean,
//     required: false,
//     default:false
//   },

//   api: {
//     type: Boolean,
//     required: false,
//     default:false
//   },

//   caption: {
//     type: String,
//     required: false,
//   },

//    status: {
//     type: Number,
//     // 0 => 'Pending'
//     // 1 => 'Sent'
//     // 2 => 'Error'
//     // 3 => 'Instance Not Found'
//     // 4 => 'Number invalid'
//     // 5 => 'Cancelled'
//     // 6 => 'Pause'
//     default: 0
//   }
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

// const Message = mongoose.model("message", messageSchema);

// module.exports = Message;

const path = require("path");
const Datastore = require("nedb-promises");
const Message = Datastore.create(path.join(__dirname, '../database/messages.db'))
module.exports = Message;