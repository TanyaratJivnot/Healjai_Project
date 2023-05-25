/* ตารางนัด */
const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let appointmentSchema = mongoose.Schema({
    doctorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    Title: { 
        type: String,
         required: true 
    },
    Date: {
         type: Date,
         required: true
     },
    Time: {
         type: String,
         required: true
     },
  Description: { 
    type: String
  },
});

let appointment = mongoose.model("appointment",appointmentSchema);

module.exports = appointment;

module.exports.saveAppointment = function(model,data){
    model.save(data);
}