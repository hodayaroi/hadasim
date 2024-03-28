const mongoose = require("mongoose");

const covid19Schema = new mongoose.Schema({

  vaccineType: {
        type: String,
        required: true
      },
      manufacturer: {
        type: String,
        required: true
      },
    });

module.exports = mongoose.model('Covid19', covid19Schema);
