const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
/* mongodb://localhost:27017 */
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
/* mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
   
}).catch(err=>console.log(err)); */
checkDB();
let docterSchema = mongoose.Schema({
    DrName:String,
    DrEmail:String,
    DrPasswd:String,
    DrAge:String,
    DrAddr:String,
    DrGenger:String,
    MedicalCertificate:String,
    DrrImg:String,
    statusCheck:{
        type:Number,
        default:1 /* 1=notcheck 2=passtocheck */
    },
    StatusLevel:{
        type:Number,
        default:2
    }
});
/* Hash the password before saving */
docterSchema.pre('save', async function (next) {
    try {
      if (this.isModified('DrPasswd') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.DrPasswd, salt);
        this.DrPasswd = hashedPassword;
      }
      next();
    } catch (error) {
      next(error);
    }
  });
 /* Compare password */ 
docterSchema.methods.comparePassword = async function (DrPasswd) {
    try {
      return await bcrypt.compare(DrPasswd, this.DrPasswd);
    } catch (error) {
      throw new Error(error);
    }
  };

let Doctor = mongoose.model("doctors",docterSchema);

module.exports = Doctor;

module.exports.saveDoctor = function(model,data){
    model.save(data);
}