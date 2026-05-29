const express = require('express');
const User = require('../models/User');
const Request = require('../models/Request');
const Cloth = require('../models/Cloths');
const { verifyToken } = require('./verifyToken');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all pending NGOs
router.get('/ngos/pending', verifyToken, isAdmin, async (req, res) => {
    try {
        const pendingNGOs = await User.find({ 
            role: 'ngo', 
            ngoStatus: 'pending' 
        }).select('-password');
        
        res.json({ pendingNGOs });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all NGOs
router.get('/ngos', verifyToken, isAdmin, async (req, res) => {
    try {
        const ngos = await User.find({ role: 'ngo' }).select('-password');
        res.json({ ngos });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve NGO
router.put('/ngos/:id/approve', verifyToken, isAdmin, async (req, res) => {
    try {
        const ngo = await User.findById(req.params.id);
        if (!ngo || ngo.role !== 'ngo') {
            return res.status(404).json({ error: 'NGO not found' });
        }

        ngo.ngoStatus = 'accepted';
        await ngo.save();

        res.json({ 
            message: 'NGO approved successfully',
            ngo: {
                id: ngo._id,
                name: ngo.name,
                email: ngo.email,
                ngoName: ngo.ngoName,
                ngoStatus: ngo.ngoStatus
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reject NGO
router.put('/ngos/:id/reject', verifyToken, isAdmin, async (req, res) => {
    try {
        const { reason } = req.body;
        const ngo = await User.findById(req.params.id);
        if (!ngo || ngo.role !== 'ngo') {
            return res.status(404).json({ error: 'NGO not found' });
        }

        ngo.ngoStatus = 'rejected';
        await ngo.save();

        res.json({ 
            message: 'NGO rejected successfully',
            ngo: {
                id: ngo._id,
                name: ngo.name,
                email: ngo.email,
                ngoName: ngo.ngoName,
                ngoStatus: ngo.ngoStatus
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get dashboard stats
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalNGOs = await User.countDocuments({ role: 'ngo' });
        const pendingNGOs = await User.countDocuments({ role: 'ngo', ngoStatus: 'pending' });
        const acceptedNGOs = await User.countDocuments({ role: 'ngo', ngoStatus: 'accepted' });
        const rejectedNGOs = await User.countDocuments({ role: 'ngo', ngoStatus: 'rejected' });
        const pendingRequests = await Request.countDocuments({ status: 'pending' });

        res.json({
            stats: {
                totalUsers,
                totalDonors,
                totalNGOs,
                pendingNGOs,
                acceptedNGOs,
                rejectedNGOs,
                pendingRequests
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all requests (for admin)
router.get('/requests', verifyToken, isAdmin, async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('ngoId', 'name email ngoName ngoPhone ngoAddress')
            .populate('clothId', 'type size condition description imageUrl status donorId')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve a request
router.put('/requests/:id/approve', verifyToken, isAdmin, async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        request.status = 'approved';
        if (adminNotes) {
            request.adminNotes = adminNotes;
        }
        await request.save();

        // Populate before sending response
        await request.populate('ngoId', 'name email ngoName');
        await request.populate('clothId', 'type size condition description imageUrl');

        res.json({
            message: 'Request approved successfully',
            request
        });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reject a request
router.put('/requests/:id/reject', verifyToken, isAdmin, async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        request.status = 'rejected';
        if (adminNotes) {
            request.adminNotes = adminNotes;
        }
        await request.save();

        // Populate before sending response
        await request.populate('ngoId', 'name email ngoName');
        await request.populate('clothId', 'type size condition description imageUrl');

        res.json({
            message: 'Request rejected successfully',
            request
        });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fulfill a request (mark as fulfilled)
router.put('/requests/:id/fulfill', verifyToken, isAdmin, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'approved') {
            return res.status(400).json({ error: 'Only approved requests can be fulfilled' });
        }

        request.status = 'fulfilled';
        await request.save();

        // Populate before sending response
        await request.populate('ngoId', 'name email ngoName');
        await request.populate('clothId', 'type size condition description imageUrl');

        res.json({
            message: 'Request marked as fulfilled',
            request
        });
    } catch (error) {
        console.error('Error fulfilling request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
