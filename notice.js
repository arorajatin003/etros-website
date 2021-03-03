const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: String,
  body: String,
  link: String,
  img:{
    data: Buffer,
    contentType: String
  }
});

module.exports= new mongoose.model("NoteImage", noticeSchema);
