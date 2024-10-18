// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
let bodyParser = require("body-parser");
const TelegramBot = require('node-telegram-bot-api');
const User = require('./src/model/users');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error: ', err));

// Initialize Express server
const app = express();
app.use(express.json());
app.use(cors())
app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Handle /start command
bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const referralCode = match[1].trim();

  try {
    // Check if user exists
    let user = await User.findOne({ telegramId: userId });

    if (!user) {
      // Create a new user with a unique referral code
      const newReferralCode = `ref${userId}`;
      user = new User({
        telegramId: userId,
        referralCode: newReferralCode,
      });

      // Check if user was referred
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          referrer.balance += 10; // Referral bonus
          referrer.referralCount += 1;
          await referrer.save();
          user.referredBy = referrer.referralCode;
        }
      }

      await user.save();
     
    }
    bot.sendMessage(chatId, 'Open Dashboard:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open Dashboard', web_app: { url: 'https://captains.netlify.app?id='+userId } }]
        ]
      }
    });
  } catch (error) {
    console.log('Error on /start:', error);
    bot.sendMessage(chatId, 'Error during registration.');
  }
});

bot.onText(/\/dashboard/, (msg) => {
    // console.log(msg)
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Open Dashboard:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open Dashboard', web_app: { url: 'https://captains.netlify.app?telegram_id='+chatId } }]
        ]
      }
    });
  });

// Handle /earn command
bot.onText(/\/earn/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      bot.sendMessage(chatId, 'You are not registered yet. Use /start to register.');
      return;
    }

    user.balance += 1; // Increase balance by 1
    await user.save();

    bot.sendMessage(chatId, `You earned 1 point! Your balance is now ${user.balance}.`);
  } catch (error) {
    console.log('Error on /earn:', error);
    bot.sendMessage(chatId, 'Error while earning points.');
  }
});

// Handle /balance command
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      bot.sendMessage(chatId, 'You are not registered yet. Use /start to register.');
      return;
    }

    bot.sendMessage(chatId, `Your current balance is ${user.balance} points.`);
  } catch (error) {
    console.log('Error on /balance:', error);
    bot.sendMessage(chatId, 'Error while checking balance.');
  }
});

// API to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// API to get all users
app.get('/api/profile/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const users = await User.findOne({telegramId:req.params.id});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Start Express server
app.listen(6000, () => {
  console.log('Server running on http://localhost:6000');
});
