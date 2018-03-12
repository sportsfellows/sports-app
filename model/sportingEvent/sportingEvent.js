'use strict';

const mongoose = require('mongoose');

const sportingEventSchema = mongoose.Schema ({
  sportingEventName: { type: String, required: true },
  desc: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  tags: { type: String },
});

module.exports = mongoose.model('sportingEvent', sportingEventSchema);