const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let PaymentStatusDoctorSchema = mongoose.Schema({
    doctorID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'doctors', 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
});

let PaymentStatusDoctor = mongoose.model("PaymentStatusDoctor",PaymentStatusDoctorSchema);

module.exports = PaymentStatusDoctor;

module.exports.savePaymentStatusDoctor = function(model,data){
    model.save(data);
}