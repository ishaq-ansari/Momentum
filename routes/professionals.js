//routes/professionals.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Professional = require('../models/Professional');

// Get all professionals
router.get('/', async (req, res) => {
    try {
        const professionals = await Professional.find({});
        res.json(professionals);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific professional
router.get('/:id', async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id);

        if (!professional) {
            return res.status(404).json({ message: 'Professional not found' });
        }

        res.json(professional);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new professional
router.post('/', auth, async (req, res) => {
    try {
        const { name, specialty, description } = req.body;

        const newProfessional = new Professional({
            name,
            specialty,
            description
        });

        const professional = await newProfessional.save();
        res.status(201).json(professional);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;