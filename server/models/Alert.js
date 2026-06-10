const mongoose = require('mongoose');
const alertSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required:true
    },
    emergencyType:{
        type:String,
        required:true,
        enum:['cardiac','trauma','burns','stroke','other']
    },
    patientAge:{
        type:Number,
        required:true,
        min:0,
        max:120
    },
    notes:{
        type:String,
        trim:true,
        maxlength:100,
        default: ''
    },
    status:{
        type:String,
        enum:['sent','acknowledged'],
        default:'sent'
    }
}, {
    timestamps:true
});
const Alert = mongoose.model('Alert', alertSchema);
module.exports=Alert;
