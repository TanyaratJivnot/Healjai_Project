const mongoose = require('mongoose');

const dbUrlPath = 'mongodb://localhost:27017/HealjaiDB';
mongoose.connect(dbUrlPath,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).catch(err=>console.log(err));

let videoCallSchema = mongoose.Schema({
    doctorID:{
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
        ref: 'Promotion' 
    },
    startTime: { 
        type: Date 
    },
    endTime: { 
        type: Date 
    },
});
videoCallSchema.pre('save', async function (next) {
    if (this.promotion) {
      try {
        const promotion = await mongoose.model('Promotion').findById(this.promotion);
        if (promotion) {
          this.startTime = promotion.startTime;
          this.endTime = promotion.endTime;
        }
      } catch (error) {
        console.error('Error retrieving promotion:', error);
      }
    }
    next();
  });

let videoCall = mongoose.model("videoCall",videoCallSchema);

module.exports = videoCall;

module.exports.saveVideoCall = function(model,data){
    model.save(data);
}