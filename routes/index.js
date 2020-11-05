var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();
var userModule = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 
const { check, validationResult } = require('express-validator');

router.use(express.static(__dirname+ "./public/"));
/* GET home page. */

var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});
var imageData = userModule.findOne({});

function checkLoginUser(req, res, next){
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var Storage = multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+ Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
   storage:Storage
}).single('file');





function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail = userModule.findOne({email:email});
      checkexitemail.exec((err,data)=>{
        if(err) throw err;
        if(data){
          return res.render('signup', { title: 'Password Management System', msg:'email already exists' });
        }
        next(); 

      });
}

function checkUsername(req,res,next){
  var username=req.body.username;
  var checkexitusername = userModule.findOne({username:username});
      checkexitusername.exec((err,data)=>{
        if(err) throw err;
        if(data){
          return res.render('signup', { title: 'Password Management System', msg:'username already exists' });
        }
        next();

      });
}

router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(req.session.userName){
    res.redirect('./dashboard');
  }
  else{
  res.render('index', { title: 'Password Management System', msg:'' });
  }
});
router.post('/', function(req, res, next) {
  var username=req.body.username;
  var password=req.body.password;
 
  var checkUser = userModule.findOne({username:username});
  checkUser.exec((err, data)=>{
 if(err) throw err;
 if(data !== null) {
 var getUserId = data._id; 
 var getPassword = data.password;                
 if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({ userId: getUserId }, 'loginToken');
  localStorage.setItem('userToken',  token);
  localStorage.setItem('loginUser',  username);
  req.session.userName=username;
  res.redirect('/dashboard');
 }
 else{
  res.render('index', { title: 'Password Management System' , msg:'invalid username and password' });
 }
}
else{
  res.render('index', { title: 'Password Management System' , msg:'invalid username and password' });
 }
 
});
  });
 
router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(req.session.userName){
    res.redirect('./dashboard');
  }
  else{
  res.render('signup', { title: 'Password Management System', msg:'' });
  }
});
router.post('/signup',checkUsername, checkEmail, upload, function(req, res, next) {
     var username=req.body.username;
     var email=req.body.email;
     var password=req.body.password;
     var confirmpassword=req.body.confirmpassword;
     var image=req.file.filename;
  
  if(password != confirmpassword){
    res.render('signup', { title: 'Password Management System',msg:'Password Not Matched !' });
  }
  else{
    password = bcrypt.hashSync(req.body.password,10);
     var userDetails=userModule({
       username:username,
       email:email,
       password:password,
       image:image,

     });
     userDetails.save((err,doc)=>{
       if(err) throw err;
       res.render('signup', { title: 'Password Management System',msg:'User Registered Successfully' });

     });
    } 

  
});


router.get('/developer', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  
    res.render('developer', { title: 'Password Management System', msg:'' });
  
  });




router.get('/logout', function(req, res, next) {

  req.session.destroy(function(err) {
    if(err){
      res.redirect('/');
    }
    
  })

  
  res.redirect('/');

});
module.exports = router;
