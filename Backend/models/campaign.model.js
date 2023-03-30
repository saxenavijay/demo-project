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

// const numberSchema = new Schema({
//   number: {
//     type: String,
//     required: false,
//   },
//   name: {
//     type: String,
//     required: false,
//   }
// })

// const campaignSchema = new Schema({
  
//   name: {
//     type: String,
//     required: false,
//     default:""
//   },

//   userId:{
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref:"user",
//   },

//   instanceId:{
//     type: Schema.Types.ObjectId,
//     required: false,
//     ref:"intance",
//   },

//   multi: {
//     type: Boolean,
//     required: false,
//     default:false
//   },
 
//   numbers: [{
//     type: numberSchema,
//     required: true,
//   }],
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

//   caption: {
//     type: String,
//     required: false,
//   },

//   api: {
//     type: Boolean,
//     required: false,
//     default:false
//   },


//   instances: [{
//     type: Schema.Types.ObjectId,
//     ref:"instance",
//     required: false,
//   }
//   ],

//   isSchedule: {
//     type: Boolean,
//     required: false,
//     default:false
//   },

//   schedule: {
//     type: Date,
//     required: false
//   },

//   status: {
//     type: Number,
//     // 0 => 'Pending'
//     // 1 => 'Completed',
//     // 2 => 'Cancelled',
//     // 3 => 'Pause',
//     required: false,
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

// const Campaign = mongoose.model("campaign", campaignSchema);

// module.exports = Campaign;

const path = require("path");
const Datastore = require("nedb-promises");
const Campaign = Datastore.create(path.join(__dirname, '../database/campaigns.db'))
module.exports = Campaign;