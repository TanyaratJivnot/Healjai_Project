/* ตาราง คนไข้นัดหมอ */
const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let UserCreateAppSchema = mongoose.Schema({
    doctorID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'doctors', 
        required: true 
    },
    patientID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    Text: { 
        type: String, 
        required: true 
    },
    appointmentDate: { 
        type: Date, 
        required: true 
    },
    reason: { 
        type: String, 
        required: true 
    },
});

let UserCreateApp = mongoose.model("UserCreateApp",UserCreateAppSchema);

module.exports = UserCreateApp;

module.exports.saveUserCreateApp = function(model,data){
    model.save(data);
}