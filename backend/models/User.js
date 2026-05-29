const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['donor','ngo','admin'],
        default:'donor'
    },
    // NGO specific fields
    ngoStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    ngoName: {
        type: String,
        trim: true
    },
    ngoDescription: {
        type: String,
        trim: true
    },
    ngoAddress: {
        type: String,
        trim: true
    },
    ngoPhone: {
        type: String,
        trim: true
    },
    ngoWebsite: {
        type: String,
        trim: true
    },
    ngoDocuments: [{
        type: String // URLs to uploaded documents
    }],
    // Common fields
    phone: {
        type: String,
        trim: true
    },
    address: {
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    this.updatedAt = Date.now();
    next();
});

// Method to check if NGO is accepted
userSchema.methods.isNGOVerified = function() {
    return this.role === 'ngo' && this.ngoStatus === 'accepted';
};

// Method to check if user can access NGO portal
userSchema.methods.canAccessNGOPortal = function() {
    return this.role === 'ngo' && this.ngoStatus === 'accepted';
};

// Method to check if user can access Donor portal
userSchema.methods.canAccessDonorPortal = function() {
    return this.role === 'donor';
};

const User=mongoose.model('User',userSchema);
module.exports=User;
