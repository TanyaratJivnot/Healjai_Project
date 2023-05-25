const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let patainServiceDoctorSchema = mongoose.Schema({
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
    promotionID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Promotion', 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

let patainServiceDoctor = mongoose.model("patainServiceDoctor",patainServiceDoctorSchema);

module.exports = patainServiceDoctor;

module.exports.savepatainServiceDoctor = function(model,data){
    model.save(data);
}