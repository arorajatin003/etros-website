const mongoose = require("mongoose");

const sponSchema = new mongoose.Schema({
  name: String,
  sponcering: String,
  img:{
    data: Buffer,
    contentType: String
  }
});

module.exports = new mongoose.model('SponImage', sponSchema);
