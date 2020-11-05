const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Pushpendra_1:Pushpendra@cluster0.olypp.mongodb.net/nodepass',{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var conn =mongoose.Collection;
var userSchema =new mongoose.Schema({
    username: {
      type:String,
      required:true,
      index:{
        unique:true,  
    }}, 


    email: {
        type:String,
        required: true,
        index: {
            unique: true,
        },},

    password: {
        type:String,
        required: true
    },

    image:String,

    date:{
        type:Date,
        default:Date.now
    }
});

var userModel = mongoose.model('users',userSchema);
module.exports=userModel;