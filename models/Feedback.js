const mongoose = require('mongoose');

// Define the Feedback schema
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
    trim: true, // Trim any extra spaces around the name
  },
  content: {
    type: String,
    required: true, // Content is required
    trim: true, // Trim any extra spaces around the content
  },
}, { timestamps: true }); // This will add createdAt and updatedAt timestamps to the document

// Create and export the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
