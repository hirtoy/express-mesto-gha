const mongoose = require('mongoose');

module.exports.validate = (value, options) => {
  if (mongoose.isValidObjectId(value)) { return value; }
  return options.error('недействителен');
};