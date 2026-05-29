const express = require('express');
const Request = require('../models/Request');
const Cloth = require('../models/Cloths');
const User = require('../models/User');
const { verifyToken } = require('./verifyToken');
const router = express.Router();

// Create a new request (NGO only)
router.post('/create', verifyToken, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User ID:', req.user.userId);
        
        const user = await User.findById(req.user.userId);
        
        // Check if user exists
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check if user is an NGO
        if (user.role !== 'ngo') {
            console.log('User is not an NGO:', user.role);
            return res.status(403).json({ error: 'Only NGOs can create requests' });
        }

        // Check if NGO is accepted
        if (user.ngoStatus !== 'accepted') {
            console.log('NGO not accepted, status:', user.ngoStatus);
            return res.status(403).json({ error: 'Your NGO account must be approved before making requests' });
        }

        const { clothId, notes } = req.body;

        if (!clothId) {
            console.log('Cloth ID missing');
            return res.status(400).json({ error: 'Cloth ID is required' });
        }

        console.log('Looking for cloth with ID:', clothId);
        // Check if cloth exists and is approved
        const cloth = await Cloth.findById(clothId);
        if (!cloth) {
            console.log('Cloth not found');
            return res.status(404).json({ error: 'Clothing item not found' });
        }

        console.log('Cloth found, status:', cloth.status);
        if (cloth.status !== 'approved') {
            return res.status(400).json({ error: 'This item is not available for request. Status: ' + cloth.status });
        }

        // Check if NGO has already requested this item
        const existingRequest = await Request.findOne({
            ngoId: req.user.userId,
            clothId: clothId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingRequest) {
            console.log('Duplicate request found');
            return res.status(400).json({ error: 'You have already requested this item' });
        }

        // Create the request
        const newRequest = new Request({
            ngoId: req.user.userId,
            clothId: clothId,
            notes: notes || '',
            status: 'pending'
        });

        await newRequest.save();
        console.log('Request created successfully:', newRequest._id);

        // Populate the request with cloth and ngo details
        await newRequest.populate('clothId', 'type size condition description imageUrl');
        await newRequest.populate('ngoId', 'name email ngoName');

        res.status(201).json({
            message: 'Request created successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
});

// Get requests by NGO (for NGO portal)
router.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user || user.role !== 'ngo') {
            return res.status(403).json({ error: 'Only NGOs can view their requests' });
        }

        const requests = await Request.find({ ngoId: req.user.userId })
            .populate('clothId', 'type size condition description imageUrl status')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

