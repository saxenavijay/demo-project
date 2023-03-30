// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;


// const contactSchema = Schema({

//     name: {
//       type: String,
//       required: true
//     },
   
//     email: {
//       type: String,
//       required: true
//     },

//     phone: {
//       type: String,
//       required: true,
//     },

//     subject: {
//       type: String,
//       required: false
//     },
//     message: {
//       type: String,
//       required: true
//     },
//     mailSent: {
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

// const Contact = mongoose.model("contact", contactSchema);

// module.exports = Contact;

const path = require("path");
const Datastore = require("nedb-promises");
const Contact = Datastore.create(path.join(__dirname, '../database/contacts.db'))
module.exports = Contact;