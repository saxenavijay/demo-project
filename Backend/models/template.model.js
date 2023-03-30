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


// const templateSchema = Schema({

//     userId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref: "user",
//     },

//     instanceId:{
//       type: Schema.Types.ObjectId,
//       required: false,
//       ref:"intance",
//     },

//     name: {
//       type: String,
//       required: true
//     },

//     type: {
//       type: Number,
//       // 0 => 'text'
//       // 1 => 'button'
//       default: 0,
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true
//     },


//     button1: {
//       type: String,
//       required: false,
//     },
//     button2: {
//       type: String,
//       required: false,
//     },
//     button3: {
//       type: String,
//       required: false,
//     },

//     button: {
//       type: String,
//       required: false,
//     },

//     footer: {
//       type: String,
//       required: false,
//     },
  
//     middle: {
//       type: String,
//       required: false,
//     },

//     callButton: {
//       type: String,
//       required: false,
//     },
  
//     callingNumber: {
//       type: String,
//       required: false,
//     },
  
//     webUrlButton: {
//       type: String,
//       required: false,
//     },
  
//     webUrl: {
//       type: String,
//       required: false,
//     },
  
//     menus: [{
//       type: menuSchema,
//       required: true,
//     }],

//     media: {
//       type: String,
//       required: false,
//     },

//     caption: {
//       type: String,
//       required: false,
//     },


//     isWelcome: {
//       type: Boolean,
//       required: false,
//       default:false
//     },

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

// const Template = mongoose.model("template", templateSchema);

// module.exports = Template;

const path = require("path");
const Datastore = require("nedb-promises");
const Template = Datastore.create(path.join(__dirname, '../database/templates.db'))
module.exports = Template;