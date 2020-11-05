const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Pushpendra_1:Pushpendra@cluster0.olypp.mongodb.net/nodepass',{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var conn =mongoose.Collection;
var passcatSchema =new mongoose.Schema({
   password_category: {
      type:String,
      required:true,
      index:{
        unique:true,  
    }}, 

    username: {
        type:String,
        
        },

    date:{
        type:Date,
        default:Date.now
    }

    
});

var passcatModel = mongoose.model('password_categories',passcatSchema);
module.exports=passcatModel;