/* แชท */
const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let MessageSchema = mongoose.Schema({
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
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
});

let Message = mongoose.model("Message",MessageSchema);

module.exports = Message;

module.exports.saveMessage = function(model,data){
    model.save(data);
}