const mongoose=require('mongoose');
const express=require('express');
const multer = require('multer');
const Cloth=require('../models/Cloths');
const User=require('../models/User');
const {verifyToken}=require('./verifyToken');
const {analyzeClothImage}=require('../services/geminiService');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

const router=express.Router();

router.post('/add-cloth', verifyToken, upload.single('image'), async(req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('File:', req.file);
        console.log("Reqqq",req.user.userId);
        const { type, size, condition, description } = req.body;
        
        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({message: 'Image is required for donation'});
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        // Use req.file.path which multer provides (full path to uploaded file)
        const imagePath = req.file.path;
        
        // Analyze image with Gemini AI
        console.log('Analyzing image with Gemini AI...');
        let aiAnalysis;
        let finalStatus = 'pending';
        let aiCondition = condition; // Use user's condition as fallback
        
        try {
            aiAnalysis = await analyzeClothImage(imagePath);
            finalStatus = aiAnalysis.status;
            aiCondition = aiAnalysis.condition;
            console.log('AI Analysis Result:', aiAnalysis);
        } catch (aiError) {
            console.error('Error in AI analysis:', aiError);
            // Continue with pending status if AI fails
            aiAnalysis = {
                condition: condition || 'good',
                status: 'pending',
                confidence: 'low',
                analysis: 'AI analysis unavailable. Manual review required.'
            };
        }
        
        const newCloth = new Cloth({
            type,
            size,
            condition: aiCondition, // Use AI-determined condition
            description,
            imageUrl,
            donorId: req.user.userId,
            status: finalStatus // Set status based on AI analysis
        });
        
        await newCloth.save();
        
        res.status(201).json({
            message: finalStatus === 'approved' 
                ? 'Donation approved! Your item passed AI verification.' 
                : finalStatus === 'rejected'
                ? 'Donation rejected. The item did not meet quality standards.'
                : 'Donation submitted. Pending manual review.',
            cloth: newCloth,
            aiAnalysis: {
                condition: aiAnalysis.condition,
                status: finalStatus,
                confidence: aiAnalysis.confidence,
                analysis: aiAnalysis.analysis
            }
        });
    } catch(error) {
        console.error('Error adding cloth:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

router.get('/clothes', verifyToken ,async(req,res)=>{
    try{
        const clothes=await Cloth.find();
        res.status(200).json(clothes);
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message});
    }
});

// Get donations by donor ID
router.get('/my-donations', verifyToken, async(req, res) => {
    try {
        const donations = await Cloth.find({ donorId: req.user.userId })
            .sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(donations);
    } catch(error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Public stats endpoint (no authentication required)
router.get('/public-stats', async(req, res) => {
    try {
        const totalClothes = await Cloth.countDocuments();
        const approvedClothes = await Cloth.countDocuments({ status: 'approved' });
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalNGOs = await User.countDocuments({ role: 'ngo', ngoStatus: 'accepted' });
        
        // Calculate approximate lives touched (assuming 2-3 people per clothing item)
        const livesTouched = Math.floor(approvedClothes * 2.5);
        
        res.status(200).json({
            totalClothes,
            approvedClothes,
            totalDonors,
            totalNGOs,
            livesTouched
        });
    } catch(error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports=router;