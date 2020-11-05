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
    checkUser.exec((err, data)=>{
      if(err) throw err;
      if(data !== null) {
        var getImage = data.image;
    res.render('add_new_category', { title: 'Password Management System' , loginUser:loginUser, msg:'' ,errors:'', image:getImage ,success:'' });
      }
    });
  });
  router.post('/', checkLoginUser, [check('passwordCategory', "Enter Password Category Name").isLength({ min:1 })] ,function(req, res, next) {
    var loginUser = req.session.userName;
    var checkUser = userModule.findOne({username:loginUser});
    checkUser.exec((err, data)=>{
      if(err) throw err;
      if(data !== null) {
        var getImage = data.image;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('add_new_category', { title: 'Password Management System' , loginUser:loginUser, msg:'', errors:errors.mapped(), image:getImage ,success:'' });
  
    }else{
      var passCatName = req.body.passwordCategory;
      var passCatDetails = new passCatModel({
        password_category: passCatName,
        username:loginUser 
      });
      passCatDetails.save(function(err,doc){
        if(err) throw err;
        res.render('add_new_category', { title: 'Password Management System' , loginUser:loginUser, msg:'', errors: '', image:getImage ,success:'Password Category Added Successfully' });
      });
      
  
    }
  }
});
    });

module.exports = router;