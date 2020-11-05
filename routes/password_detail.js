var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 
const { check, validationResult } = require('express-validator');
/* GET home page. */

var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});

function checkLoginUser(req, res, next){
  var userToken = localStorage.getItem('userToken');
  try {
    if(req.session.userName){
    var decoded = jwt.verify(userToken, 'loginToken');
  }else{
    res.redirect('/');
  }
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

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

router.get('/', checkLoginUser,  function(req, res, next) {
    res.redirect('/dashboard');
   });

   router.get('/edit/:id', checkLoginUser,  function(req, res, next) {
     var loginUser = req.session.userName;
     var checkUser = userModule.findOne({username:loginUser});
     var getCategory = passCatModel.find({username:loginUser});
    checkUser.exec((err, doc)=>{
      if(err) throw err;
      if(doc !== null) {
        var getImage = doc.image; 
     var id = req.params.id;
     var getPassDetails = passModel.findById({_id:id});
     getPassDetails.exec(function(err,data){
   if(err) throw err;
   getCategory.exec(function(err,data1){
   res.render('edit_password_details', { title: 'Password Management System' , loginUser:loginUser, msg:'',records:data1, record:data, image:getImage , success:'' });
   });
 });
}
    });
    });

    router.post('/edit/:id', checkLoginUser,  function(req, res, next) {
     var loginUser = req.session.userName;
     var checkUser = userModule.findOne({username:loginUser});
     var getCategory = passCatModel.find({username:loginUser});
    checkUser.exec((err, doc)=>{
      if(err) throw err;
      if(doc !== null) {
        var getImage = doc.image; 
     var id = req.params.id;
     var pass_cat = req.body.pass_cat;
     var project_name = req.body.project_name;
     var pass_details = req.body.pass_details;
     var pass_update = passModel.findByIdAndUpdate(id,{password_category:pass_cat, project_name:project_name, password_detail:pass_details});
     pass_update.exec(function(err){
       if(err) throw err;
     var getPassDetails = passModel.findById({_id:id});
     getPassDetails.exec(function(err,data){
   if(err) throw err;
   getCategory.exec(function(err,data1){
     if(err) throw err;
   res.render('edit_password_details', { title: 'Password Management System' , loginUser:loginUser, msg:'',records:data1, record:data, image:getImage , success:'Password Details Updated Successfully' });
 });  
 });
 });
}
    });
    });

module.exports = router;