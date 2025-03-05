const express = require('express');
const router = express.Router();
const Resource = require('../models/Resources');

// Get all resources
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new resource
router.post('/', async (req, res) => {
    const resource = new Resource({
        name: req.body.name,
        type: req.body.type,
        country: req.body.country,
        state: req.body.state,
        description: req.body.description,
        phone: req.body.phone,
        website: req.body.website,
        isGlobal: req.body.isGlobal
    });
    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a single resource
router.get('/:id', getResource, (req, res) => {
    res.json(res.resource);
});

// Update a resource
router.patch('/:id', getResource, async (req, res) => {
    if (req.body.name != null) {
        res.resource.name = req.body.name;
    }
    if (req.body.type != null) {
        res.resource.type = req.body.type;
    }
    if (req.body.country != null) {
        res.resource.country = req.body.country;
    }
    if (req.body.state != null) {
        res.resource.state = req.body.state;
    }
    if (req.body.description != null) {
        res.resource.description = req.body.description;
    }
    if (req.body.phone != null) {
        res.resource.phone = req.body.phone;
    }
    if (req.body.website != null) {
        res.resource.website = req.body.website;
    }
    if (req.body.isGlobal != null) {
        res.resource.isGlobal = req.body.isGlobal;
    }
    try {
        const updatedResource = await res.resource.save();
        res.json(updatedResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a resource
router.delete('/:id', getResource, async (req, res) => {
    try {
        await res.resource.remove();
        res.json({ message: 'Deleted Resource' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get resource by ID
async function getResource(req, res, next) {
    let resource;
    try {
        resource = await Resource.findById(req.params.id);
        if (resource == null) {
            return res.status(404).json({ message: 'Cannot find resource' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.resource = resource;
    next();
}

module.exports = router;