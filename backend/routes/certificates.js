const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Certificate = require('../models/Certificate');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route   GET /api/certificates
// @desc    Get all certificates for logged in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(certificates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/certificates
// @desc    Save a new generated certificate
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newCert = new Certificate({
            ...req.body,
            user: req.user.id
        });

        const certificate = await newCert.save();
        res.json(certificate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/certificates/:id
// @desc    Delete a certificate
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

        // Make sure user owns this certificate
        if (certificate.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await certificate.deleteOne();
        res.json({ message: 'Certificate removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
