const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Pushpendra_1:Pushpendra@cluster0.olypp.mongodb.net/nodepass',{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var conn =mongoose.Collection;
var passSchema =new mongoose.Schema({
   password_category: {
      type:String,
      required:true,
      }, 
    project_name: {
        type:String,
        required:true,
        }, 
    password_detail: {
        type:String,
        required:true,
        },
    username: {
            type:String,
            },  

    date:{
        type:Date,
        default:Date.now
    }
});

var passModel = mongoose.model('password_details',passSchema);
module.exports=passModel;