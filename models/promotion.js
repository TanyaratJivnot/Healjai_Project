const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let promotionSchema = mongoose.Schema({
    patientID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    status: { 
        type: Boolean, 
        required: true 
    },
    appliedDate: { 
        type: Date, 
        default: Date.now 
    },
    expirationDate: { 
        type: Date, 
        required: true 
    },
});

let Promotion = mongoose.model("Promotion",promotionSchema);

module.exports = Promotion;

module.exports.savePromotion = function(model,data){
    model.save(data);
}