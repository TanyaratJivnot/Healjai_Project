
const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let DoctorCreateQueueSchema = mongoose.Schema({
    doctorID: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    QueueID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DrQueueEmpty' 
    },
});

let DoctorCreateQueue = mongoose.model("DoctorCreateQueue",DoctorCreateQueueSchema);

module.exports = DoctorCreateQueue;

module.exports.saveDrQueueEmpty = function(model,data){
    model.save(data);
}