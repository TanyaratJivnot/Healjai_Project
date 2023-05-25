/* ตารางที่หมอว่าง */
const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let DrQueueEmptySchema = mongoose.Schema({
    doctorID: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    appointmentID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'appointment' 
    },
    Date: { 
        type: Date, 
        required: true 
    },
    Available: { 
        type: Boolean, 
        default: true },
});

let DrQueueEmpty = mongoose.model("DrQueueEmpty",DrQueueEmptySchema);

module.exports = DrQueueEmpty;

module.exports.saveDrQueueEmpty = function(model,data){
    model.save(data);
}