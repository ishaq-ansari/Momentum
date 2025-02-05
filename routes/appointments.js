//routes/appointments.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Professional = require('../models/Professional');

// Get all appointments for the current user
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id }).populate('professionalId');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new appointment
router.post('/', auth, async (req, res) => {
    try {
        const { professionalId, datetime } = req.body;

        const newAppointment = new Appointment({
            userId: req.user.id,
            professionalId,
            datetime
        });

        const appointment = await newAppointment.save();

        // Add the appointment to the professional's appointments
        await Professional.findByIdAndUpdate(professionalId, {
            $push: { appointments: appointment._id }
        });

        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel an appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Remove the appointment from the professional's appointments
        await Professional.findByIdAndUpdate(appointment.professionalId, {
            $pull: { appointments: appointment._id }
        });

        res.json({ message: 'Appointment cancelled' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;