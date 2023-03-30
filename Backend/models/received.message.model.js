// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const receivedMessageSchema = new Schema({

  
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
 
//   number: {
//     type: String,
//     required: true,
//   },

//   message: {
//     type: String,
//     required: false,
//     default:""
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

// const receivedMessage = mongoose.model("receivedmessage", receivedMessageSchema);

// module.exports = receivedMessage;

const path = require("path");
const Datastore = require("nedb-promises");
const receivedMessage = Datastore.create(path.join(__dirname, '../database/receivedmessages.db'))
module.exports = receivedMessage;