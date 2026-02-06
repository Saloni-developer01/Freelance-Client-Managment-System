const mongoose = require('mongoose');

// server/models/Expense.js
const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,        // e.g., "Hosting for Client X"
    amount: Number,
    category: String,     // e.g., "Software", "Marketing", "Outsource"
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);