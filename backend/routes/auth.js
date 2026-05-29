const express=require('express');
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const router = express.Router();

// Donor Registration (default role)
router.post('/signup/donor',async(req,res)=>{
    const {name, email, password, phone, address} = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = new User({ 
            name, 
            email, 
            password, 
            role: 'donor',
            phone,
            address
        });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {expiresIn: '7d'});
        res.status(201).json({ 
            message: 'Donor registered successfully', 
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address
            } 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// NGO Registration
router.post('/signup/ngo',async(req,res)=>{
    const {
        name, 
        email, 
        password, 
        ngoName, 
        ngoDescription, 
        ngoAddress, 
        ngoPhone, 
        ngoWebsite,
        phone,
        address
    } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = new User({ 
            name, 
            email, 
            password, 
            role: 'ngo',
            ngoName,
            ngoDescription,
            ngoAddress,
            ngoPhone,
            ngoWebsite,
            ngoStatus: 'pending',
            phone,
            address
        });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {expiresIn: '7d'});
        res.status(201).json({ 
            message: 'NGO registered successfully. Your account is pending approval.', 
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                ngoStatus: user.ngoStatus,
                ngoName: user.ngoName,
                phone: user.phone,
                address: user.address
            } 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login',async (req,res)=>{
    const {email, password}=req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if NGO is trying to access portal before approval
        if (user.role === 'ngo' && user.ngoStatus !== 'accepted') {
            return res.status(403).json({ 
                error: 'Your NGO account is pending approval. Please wait for admin verification.',
                ngoStatus: user.ngoStatus
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                ngoStatus: user.ngoStatus,
                ngoName: user.ngoName,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update allowed fields
        const { name, phone, address } = req.body;
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json({ 
            message: 'Profile updated successfully',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Check NGO status
router.get('/ngo/status', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(decoded.userId).select('role ngoStatus ngoName');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'ngo') {
            return res.status(400).json({ error: 'User is not an NGO' });
        }

        res.json({ 
            ngoStatus: user.ngoStatus,
            ngoName: user.ngoName
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password
router.put('/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Validate new password
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;