const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clothId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cloth',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'fulfilled'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true
    },
    adminNotes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
requestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;

