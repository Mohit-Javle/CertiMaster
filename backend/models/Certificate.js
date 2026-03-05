const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    issueDate: { type: String, required: true },
    templateId: { type: String, required: true },
    type: { type: String, enum: ['single', 'bulk'], default: 'single' },

    // Additional data for re-rendering
    issuedBy: { type: String },
    signature1: { type: String },
    signature2: { type: String },
    styleData: {
        fontFamily: String,
        primaryColor: String,
        textColor: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
