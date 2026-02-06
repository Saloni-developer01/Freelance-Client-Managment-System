// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     companyName: { type: String, default: 'My Freelance Business' },
//     isPro: { type: Boolean, default: false }, // SaaS logic: true matlab paid user
//     subscriptionId: String,
//     createdAt: { type: Date, default: Date.now },
//     subscriptionDate: { type: Date, default: null } // Nayi field
// });

// module.exports = mongoose.model('User', userSchema);






const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Business Details
    companyName: { type: String, default: 'My Freelance Business' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    upiId: { type: String, default: '' },
    currency: { type: String, default: '₹' },
    taxRate: { type: Number, default: 0 }, // <-- Ye line add karein
    
    // Invoice Signature logic
    signatureName: { type: String, default: 'The Freelancer' },

    // SaaS & Subscription logic
    isPro: { type: Boolean, default: false }, 
    subscriptionId: { type: String, default: null },
    subscriptionDate: { type: Date, default: null },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);