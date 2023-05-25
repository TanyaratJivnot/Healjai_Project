const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';/*  */
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let adminSchema = mongoose.Schema({
    AdminName:String,
    AdminEmail:String,
    AdminPasswd:String,
    AdminImg:String,
    StatusLevel:{
        type:Number,
        default:3
    }

});

let Admin = mongoose.model("admin",adminSchema);

module.exports = Admin;

module.exports.saveAdmin = function(model,data){
    model.save(data);
}