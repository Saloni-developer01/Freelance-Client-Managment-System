// server/models/Proposal.js
const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientEmail: String, // <--- Ye line add karo zaroori hai
  title: String,
  description: String,
  items: [{ 
    service: String, 
    price: Number 
  }],
  baseAmount: Number,   // <--- Add this
  taxRate: Number,      // <--- Add this
  taxAmount: Number,    // <--- Add this
  totalAmount: Number,  // <--- Add this
  // totalAmount: Number,
  status: { type: String, default: 'Draft' },
  clientSignature: String, // Client ka naam ya signature image string
  date: { type: Date, default: Date.now },
  shareToken: { type: String, unique: true } // Unique ID link ke liye
});

module.exports = mongoose.model('Proposal', proposalSchema);