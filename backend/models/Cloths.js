const mongoose=require('mongoose');

const clothSchema=new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Cloth=mongoose.model('Cloth',clothSchema);
module.exports=Cloth;
