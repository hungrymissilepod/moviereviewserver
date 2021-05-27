const mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  watchlist: [{
    type: Number,
  }],
  bio: {
    type: String,
  },
  imageUrl: {
    type: String,
  }
});

module.exports = UserSchema = mongoose.model('user', UserSchema, 'User');