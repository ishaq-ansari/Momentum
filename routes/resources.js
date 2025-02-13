// routes/resources.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET /api/resources
router.get('/', async (req, res) => {
  try {
    const { country, state } = req.query;
    
    let query = {};
    
    if (country === 'global') {
      query.isGlobal = true;
    } else {
      query = {
        $or: [
          { country, isGlobal: true },
          { country }
        ]
      };
      
      if (state) {
        query.state = state;
      }
    }
    
    const resources = await Resource.find(query);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error });
  }
});

// POST /api/resources (Admin only)
router.post('/', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: 'Error creating resource', error });
  }
});

module.exports = router;