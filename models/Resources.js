// models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['hotline', 'therapy', 'university', 'online'],
    required: true
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String
  },
  isGlobal: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);