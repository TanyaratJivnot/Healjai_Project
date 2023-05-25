const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
const checkDB = async ()=>{
  try{
    await mongoose.connect(dbUrlPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  }catch(error){
    console.error('Failed to connect to the database:', error);
  }
}
checkDB();
let userSchema = mongoose.Schema({
    UserName:String,
    UserEmail:String,
    UserPasswd:String,
    UserAddr:String,
    UserAge:String,
    UserGenger:String,
    UserIDCard:String,
    First_LastName:String,
    UserImg:String,
    StatusLevel:{
        type:Number,
        default:1
    },
    MemberShip:{
        type:Number,
        default: 2
    }

});
/* Hash the password before saving */
userSchema.pre('save', async function (next) {
    try {
      if (this.isModified('UserPasswd') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.UserPasswd, salt);
        this.UserPasswd = hashedPassword;
      }
      next();
    } catch (error) {
      next(error);
    }
  });
 /* Compare password */ 
userSchema.methods.comparePassword = async function (UserPasswd) {
    try {
      return await bcrypt.compare(UserPasswd, this.UserPasswd);
    } catch (error) {
      throw new Error(error);
    }
  };

let User = mongoose.model("users",userSchema);

module.exports = User;

module.exports.saveUser = function(model,data){
    model.save(data);
}