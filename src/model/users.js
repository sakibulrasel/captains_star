// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  userName:{type:String,default:null},
  referralUrl:{type:String,default:null},
  firstName:{type:String, default:null},
  lastName:{type:String, default:null},
  referralCount: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
