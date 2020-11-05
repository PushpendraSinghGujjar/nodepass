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

router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser = req.session.userName;
    var checkUser = userModule.findOne({username:loginUser});
    var getCategory = passCatModel.find({username:loginUser});
    checkUser.exec((err, data)=>{
      if(err) throw err;
      if(data !== null) {
        var getImage = data.image;
        getCategory.exec(function(err,data){
      if(err) throw err;
      res.render('password_category', { title: 'Password Management System' , loginUser:loginUser, msg:'', image:getImage , records:data });
  
    });
  }
});
    }); 
  
    router.get('/delete/:id', checkLoginUser, function(req, res, next) {
      var loginUser = req.session.userName;
      var checkUser = userModule.findOne({username:loginUser});
      var getCategory = passCatModel.find({username:loginUser});
    checkUser.exec((err, doc)=>{
      if(err) throw err;
      if(doc !== null) {
        var getImage = doc.image;
      var passcat_id = req.params.id;
      var passdelete = passCatModel.findByIdAndDelete(passcat_id);
      passdelete.exec(function(err,data){
        if(err) throw err;
        getCategory.exec(function(err,data){
          if(err) throw err;
        res.render('password_category', { title: 'Password Management System' , loginUser:loginUser, image:getImage , msg:'Password Category Deleted Successfully', records:data });
      });
      });
    }
  });
      });
  
      router.get('/edit/:id', checkLoginUser, function(req, res, next) { 
        var loginUser = req.session.userName;
        var checkUser = userModule.findOne({username:loginUser});
        checkUser.exec((err, doc)=>{
          if(err) throw err;
          if(doc !== null) {
            var getImage = doc.image;
        console.log(getImage);
        var passcat_id = req.params.id;
        var getpassCategory = passCatModel.findById(passcat_id);
        getpassCategory.exec(function(err,data){
          if(err) throw err;
          
          res.render('edit_pass_category', { title: 'Password Management System' , loginUser:loginUser, image:getImage , msg:'', records:data , success:'', errors:'', id:passcat_id });
           
        });
         }
        });
        });
  
        router.post('/edit/', checkLoginUser, function(req, res, next) {
          var loginUser = req.session.userName;
          var checkUser = userModule.findOne({username:loginUser});
          var getCategory = passCatModel.find({username:loginUser});
    checkUser.exec((err, data1)=>{
      if(err) throw err;
      if(data1 !== null) {
        var getImage = data1.image;
          var passcatbody_id = req.body.id;
          console.log(passcatbody_id);
          var passwordCategory = req.body.passwordCategory;
          var update_passCat = passCatModel.findByIdAndUpdate(passcatbody_id, {password_category:passwordCategory});
          update_passCat.exec(function(err,doc){
            if(err) throw err;
            getCategory.exec(function(err,data){
              if(err) throw err;
            res.render('password_category', { title: 'Password Management System' , loginUser:loginUser, image:getImage , msg:'Password Category Updated Successfully', records:data });
          });
          }); 
        }
      });
          });

module.exports = router;