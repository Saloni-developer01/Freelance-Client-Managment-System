// import mongoose from "mongoose";

// // --- UPDATED CLIENT SCHEMA (Linked to User) ---
// const clientSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // IMPORTANT FOR SaaS
//     name: String,
//     email: { type: String, required: true }, // Naya field
//     // password: { type: String }, // Add this for portal login
//     projectTitle: String,
//     budget: Number,
//     received: { type: Number, default: 0 },
//     status: { type: String, default: 'Active' },
//     // milestones: [
//     //     {
//     //         label: String,       // e.g., "UI Design"
//     //         percentage: Number,  // e.g., 25
//     //         isCompleted: { type: Boolean, default: false }
//     //     }
//     // ],
//     createdAt: { type: Date, default: Date.now },
//     // feedback: [{ message: String, date: Date }] // Feedback store karne ke liye
// });
// // const Client = mongoose.model('Client', clientSchema);
// module.exports = mongoose.model('Client', clientSchema);