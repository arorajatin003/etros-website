const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const multer = require('multer');
require('dotenv/config');
const imgModel = require('./model');
const noteimages = require("./notice");
const sponModel = require("./sponser");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/etros_newDB", {useNewUrlParser: true,useUnifiedTopology: true});
// mongodb://localhost:27017/
// mongodb+srv://Jatin-arora-admin:Jatinarora003@cluster0.osicw.mongodb.net/etrosDB

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

var nstorage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "uplodes-notice");
  },
  filename: (req, file, cb) =>{
    cb(null, file.filename + '-' + Date.now())
  }
});
var nuplode = multer({storage: nstorage});

var sStorage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "uplode-sponsers");
  },
  filename:(req, file,cb)=>{
    cb(null, file.filename + "-"+ Date.now())
  }
});
var sUplode = multer({storage: sStorage});


app.get("/",function(req,res){
  noteimages.find({},function(err,posts){
    res.render("index",{
      posts: posts
    });
    // console.log(posts);
    // console.log(posts.boby);
    // console.log(posts.link);
  });
});


app.get("/aboutus",function(req,res){
  res.render("aboutus");
});


app.get("/supportus",function(req,res){
  sponModel.find({},function(err,sponsers){
    res.render("suportus",{
      sponsers: sponsers
    });
  });
});


app.get("/teammembers",function(req,res){
  imgModel.find({},function(err,members){
      res.render("members",{
        members: members
      });
    });
  });


app.get("/contactus",function(req,res){
  res.render("contactUs");
});

app.get("/notice",function(req,res){
  noteimages.find({},function(err,post){
    res.render("notice",{
      posts: post
    });
  });
});
app.get("/notice/:title",function(req,res){
  var query = {title:req.params.title};
  console.log(query);
  noteimages.find({title:req.params.title},function(err,posts){
    res.render("post",{
      post:posts
    });
  });
  // noteimages.forEach(function(post){
  //   console.log(req.params.title);
  //   if(post.title === req.params.title){
  //     res.render("post",{
  //       title: post.title,
  //       body: post.body
  //     });
  //   }
  // });
});

app.get("/new-notice-123",function(req,res){
  res.render("newNote");
});
app.post("/new-notice-123",nuplode.single('image'), (req,res,next)=>{
  var note= new noteimages({
    title: req.body.title,
    body: req.body.content,
    link: req.body.link,
    img:{
      data: fs.readFileSync(path.join(__dirname + '/uplodes-notice/'+ req.file.filename)),
      contentType: 'image/png'
    }
  });
  note.save(err=>{
    console.log(err);
  });
  res.redirect("/");

});


app.get("/new-member-123",function(req,res){
  res.render("newMember");
});
app.post('/new-member-123', upload.single('image'), (req, res, next) => {

    var obj = new imgModel({
        name: req.body.name,
        department: req.body.domain,
        position: req.body.position,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    obj.save( err=>{
      if(!err){
        res.redirect("/teammembers");
      }
    })
});

app.get("/new-sponser-123",function(req,res){
  res.render("newSponser");
});
app.post("/new-sponser-123", sUplode.single('image'), (req, res, next) =>{

  var obj = new sponModel({
    name: req.body.name,
    sponcered: req.body.sponsered,
    amount: req.body.amount,
    img: {
          data: fs.readFileSync(path.join(__dirname + '/uplode-sponsers/' + req.file.filename)),
          contentType: 'image/png'
      }
  });
  obj.save( err=>{
    if(!err){
      res.redirect("/supportus");
    }
  })
});

var port = process.env.PORT || 3000
app.listen(port, function(){
  console.log("Server is liatening on port 3000");
});
