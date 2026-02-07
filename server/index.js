const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const stripe = require('stripe')('aapki_stripe_secret_key');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const sendInvoiceRoute = require('./api/send-invoice');
const approveAndSendRoute = require('./api/approveAndSend');

require('dotenv').config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const User = require('./models/User'); // Import User model
const Expense = require('./models/Expense');
const Proposal = require('./models/Proposal');

const app = express();
app.use(express.json());
// const allowedOrigins = [
//   'http://localhost:5173', // Local development ke liye
//   'https://your-app-name.vercel.app' // Aapka Vercel deployment link
// ];
// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       return callback(new Error('CORS Policy block: This origin is not allowed'), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));
// app.use(cors());

// new
// Sirf apne Vercel URL aur Localhost ko allow karein
const allowedOrigins = [
  'http://localhost:5173',
  'https://freelance-client-managment-system.vercel.app', // Aapka Vercel URL
  'https://freelance-client-managment-system-42lb5vjrm.vercel.app',
  /\.vercel\.app$/
];
app.use(cors({
  origin: function (origin, callback) {
    // requests with no origin are allowed (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "auth-token", "Authorization"] // 'auth-token' add karna zaroori hai
}));


app.use('/api/send-invoice', sendInvoiceRoute);

// index.js ya middleware file mein
const checkSubscription = async (req, res, next) => {
    try {
        const token = req.headers['auth-token'];
        if (!token) return next();

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);

        if (user && user.isPro && user.subscriptionDate) {
            const now = new Date();
            const subDate = new Date(user.subscriptionDate);
            
            // Difference in days
            const diffTime = Math.abs(now - subDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 30) {
                // 30 din khatam! Plan expire karo
                user.isPro = false;
                user.subscriptionDate = null;
                await user.save();
            }
        }
        next();
    } catch (error) {
        next();
    }
};

// Isse saare routes par apply karein
app.use(checkSubscription);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/freelancedb')
.then(() => console.log("DB Connected!"))
.catch(err => console.log(err));

// --- UPDATED CLIENT SCHEMA (Linked to User) ---
const clientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // IMPORTANT FOR SaaS
    name: String,
    email: { type: String, required: true }, // Naya field
    // password: { type: String }, // Add this for portal login
    projectTitle: String,
    budget: Number,
    received: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    assets: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
            type: { type: String, default: 'Link' }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    // feedback: [{ message: String, date: Date }] // Feedback store karne ke liye
});
const Client = mongoose.model('Client', clientSchema);




// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ email: req.body.email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "User Registered" });
    } catch (err) { res.status(500).json(err); }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json("Invalid Password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
});

app.get('/api/clients', async (req, res) => {
    try {
        const token = req.headers['auth-token'];
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verifiedToken.id);

        // --- EXPIRY CHECK LOGIC ---
        if (user.isPro && user.subscriptionDate) {
            const now = new Date();
            const subDate = new Date(user.subscriptionDate);
            const diffTime = Math.abs(now - subDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 30) {
                // 30 din khatam! PRO status chhino
                user.isPro = false;
                await user.save();
            }
        }
        // --------------------------

        const clients = await Client.find({ userId: verifiedToken.id });
        res.json(clients);
    } catch (err) {
        res.status(500).send("Error");
    }
});

app.post('/api/clients', async (req, res) => {
    try {
        const token = req.headers['auth-token'];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // User ko database se dhoondo
        const user = await User.findById(verified.id);
        
        // Pehle se kitne clients hain?
        const clientCount = await Client.countDocuments({ userId: verified.id });

        // Agar PRO nahi hai aur 3 clients ho chuke hain
        if (!user.isPro && clientCount >= 3) {
            return res.status(403).json({ 
                error: "Limit Reached", 
                message: "Upgrade to PRO to add more than 3 clients!" 
            });
        }

        // ... baaki ka purana code (client create karne wala) ...
        const newClient = new Client({ ...req.body, userId: verified.id });
        await newClient.save();
        res.json(newClient);
        
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Pehle wale do /api/proposals hata kar sirf ye ek rakhein
app.post('/api/proposals', async (req, res) => {
  try {
    const proposalData = {
      ...req.body,
      // Unique token generate karna zaroori hai link ke liye
      shareToken: crypto.randomBytes(16).toString('hex') 
    };
    const newProposal = new Proposal(proposalData);
    await newProposal.save();
    res.status(201).json(newProposal);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Email bhejne ka route (Agar nahi hai toh add kar lo)
app.post('/api/send-proposal-email', async (req, res) => {
  const { clientEmail, clientName, freelancerEmail, freelancerName, proposalTitle, shareLink } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'webhostingportfolio124@gmail.com', // Aapka email
      pass: 'luyx vtzs nosl rupt'     // Gmail App Password
    }
  });

//   const mailOptions = {
//     from: `"${freelancerName}" <webhostingportfolio124@gmail.com>`,
//     to: clientEmail,
//     bcc: freelancerEmail, // Freelancer ko copy milegi
//     subject: `New Proposal: ${proposalTitle}`,
//     html: `<h3>Hi ${clientName},</h3><p>${freelancerName} has sent you a proposal. <a href="${shareLink}">Click here to view and sign it.</a></p>`
//   };

const mailOptions = {
    from: `"${freelancerName}" <your-email@gmail.com>`,
    to: clientEmail,
    bcc: freelancerEmail,
    subject: `Project Proposal: ${proposalTitle}`,
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Project Proposal</h1>
        </div>
        <div style="padding: 40px; background-color: white; color: #1e293b;">
            <p style="font-size: 18px;">Hi <b>${clientName}</b>,</p>
            <p style="line-height: 1.6;">I have prepared a detailed proposal for <b>${proposalTitle}</b>. You can review the services, pricing, and digitally sign it using the secure link below:</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${shareLink}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);">View & Sign Proposal</a>
            </div>
            <p style="font-size: 14px; color: #64748b; font-style: italic;">Note: This link is unique to you. Please do not share it with others.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
            Sent via <b>FreelanceFlow Pro</b> by ${freelancerName}
        </div>
    </div>
    `
};

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email Sent");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.delete('/api/clients/:id/assets/:assetIndex', async (req, res) => {
  try {
    const { id, assetIndex } = req.params;
    
    // Check karein ki id valid hai ya nahi
    const client = await Client.findById(id);
    if (!client) return res.status(404).send('Client nahi mila');

    // Index ko number mein convert karein aur delete karein
    const idx = parseInt(assetIndex);
    if (idx >= 0 && idx < client.assets.length) {
      client.assets.splice(idx, 1);
      await client.save();
      return res.json(client); // Updated client bhej rahe hain
    } else {
      return res.status(400).send('Invalid Index');
    }
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).send(err.message);
  }
});

// Proposal find by Token (Public)
app.get('/api/proposals/share/:token', async (req, res) => {
  const proposal = await Proposal.findOne({ shareToken: req.params.token });
  if (!proposal) return res.status(404).send("Not found");
  res.json(proposal);
});

// Approve Proposal
// app.put('/api/proposals/approve/:token', async (req, res) => {
//   const proposal = await Proposal.findOneAndUpdate(
//     { shareToken: req.params.token },
//     { 
//       status: 'Approved', 
//       clientSignature: req.body.clientSignature,
//       signedAt: new Date() 
//     },
//     { new: true }
//   );
//   res.json(proposal);
// });


app.put('/api/proposals/approve/:token', async (req, res) => {
  try {
    const { clientSignature } = req.body;
    const updatedProposal = await Proposal.findOneAndUpdate(
      { shareToken: req.params.token },
      { 
        status: 'Approved', 
        clientSignature: clientSignature,
        signedAt: new Date() 
      },
      { new: true }
    );
    res.json(updatedProposal);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.put('/api/clients/:id', async (req, res) => {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).json("Access Denied");

    try {
        // FIX: process.env.JWT_SECRET use karein
        const verified = jwt.verify(token, process.env.JWT_SECRET); 
        
        const updatedClient = await Client.findOneAndUpdate(
            { _id: req.params.id, userId: verified.id }, 
            { $set: req.body }, 
            { new: true }
        );

        if (!updatedClient) return res.status(404).json("Client not found or Unauthorized");
        res.json(updatedClient);
    } catch (err) { 
        res.status(400).json("Invalid Token"); 
    }
});

// --- 4. Delete Client (Secure) ---
app.delete('/api/clients/:id', async (req, res) => {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).json("Access Denied");

    try {
        // FIX: process.env.JWT_SECRET use karein
        const verified = jwt.verify(token, process.env.JWT_SECRET); 
        
        const deletedClient = await Client.findOneAndDelete({ 
            _id: req.params.id, 
            userId: verified.id 
        });

        if (!deletedClient) return res.status(404).json("Client not found or Unauthorized");
        res.json({ message: "Deleted Successfully" });
    } catch (err) { 
        res.status(400).json("Invalid Token"); 
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    const token = req.headers['auth-token'];
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: { name: 'FreelanceFlow Pro Plan' },
                unit_amount: 19900, // Rs. 499.00
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        client_reference_id: verified.id, // User ki ID track karne ke liye
    });

    res.json({ id: session.id });
});

//old
// app.post('/api/verify-payment', async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     // Signature create karein
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//         .update(sign.toString())
//         .digest("hex");

//     if (razorpay_signature === expectedSign) {
//         try {
//             const token = req.headers['auth-token'];
//             if (!token) return res.status(401).json({ success: false, message: "Token missing" });

//             const verified = jwt.verify(token, process.env.JWT_SECRET);
            
//             // Database update: Pro status aur Date dono ek saath
//             const updatedUser = await User.findByIdAndUpdate(
//                 verified.id, 
//                 { 
//                     isPro: true, 
//                     subscriptionDate: new Date() 
//                 },
//                 { new: true }
//             );

//             return res.status(200).json({ 
//                 success: true, 
//                 message: "Payment Verified Successfully!",
//                 user: updatedUser // Frontend ko updated data bhej sakte hain
//             });
//         } catch (err) {
//             console.error("Update Error:", err);
//             return res.status(500).json({ success: false, message: "Server Error during update" });
//         }
//     } else {
//         return res.status(400).json({ success: false, message: "Invalid Signature!" });
//     }
// });

//new
app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const token = req.headers['auth-token'];

    //new
    // console.log("Token Received:", token);
    //new
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided!" });
    }

    try {
        // 1. Signature Verify karein
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ success: false, message: "Invalid Signature!" });
        }

        // 2. User ID nikalne ka sahi tarika
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userId = verified.id || verified._id; // Check dono (id aur _id)

        // 3. Database Update
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { isPro: true, subscriptionDate: new Date() },
            { new: true }
        ).select("-password");

        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        // console.error("Verification Error:", err);
        //new
        console.error("DETAILED ERROR:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


app.put('/api/users/update', async (req, res) => {
    try {
        const { email, ...updateData } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, 
            { $set: updateData }, // Yeh sari nayi fields ko ek saath update kar dega
            { new: true }
        );
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/user/profile_info', async (req, res) => {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).json("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select('-password'); // Password chhod kar sab bhej do
        res.json(user);
    } catch (err) {
        res.status(400).json("Error fetching data");
    }
});

/// or yee go pro pr propsal dono kai liye
app.post('/api/create-order', async (req, res) => {
    try {
        const amount = req.body.amount || 199; 

        const options = {
            amount: amount * 100, // Rs to Paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating order");
    }
});


app.get('/api/proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ date: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/api/payment-success-email', async (req, res) => {
    const { clientEmail, clientName, amount, projectTitle, paymentId } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webhostingportfolio124@gmail.com',
            pass: 'luyx vtzs nosl rupt'
        }
    });

    const mailOptions = {
        from: '"FreelanceFlow Payments" <webhostingportfolio124@gmail.com>',
        to: clientEmail,
        subject: `Payment Confirmed: ${projectTitle}`,
        html: `
            <div style="font-family: sans-serif; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4f46e5;">Payment Received!</h2>
                <p>Hi ${clientName},</p>
                <p>Thank you for the payment. Your project <b>${projectTitle}</b> has been officially started.</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><b>Amount Paid:</b> ₹${amount}</p>
                    <p><b>Payment ID:</b> ${paymentId}</p>
                    <p><b>Status:</b> Success ✅</p>
                </div>
                <p>Regards,<br/>Saloni's Organization</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Success email sent!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/api/proposals/mark-paid/:id', async (req, res) => {
  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid' },
      { new: true }
    );
    res.json(updatedProposal);
  } catch (err) {
    res.status(500).send(err.message);
  }
});





// Stripe Subscription Fix (Metadata yahan aayega)
// app.post('/api/create-subscription', async (req, res) => {
//     const token = req.headers['auth-token'];
//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [{
//                 price_data: {
//                     currency: 'inr',
//                     product_data: { name: 'FreelanceFlow Pro' },
//                     unit_amount: 19900,
//                 },
//                 quantity: 1,
//             }],
//             mode: 'payment',
//             // SUCCESS URL MEIN METADATA NAHI, SESSION_ID BHEJTE HAIN
//             success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.FRONTEND_URL}`,
//             metadata: { userId: verified.id } // YAHAN HAI METADATA!
//         });
//         res.json({ url: session.url });
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });



app.post('/api/create-subscription', async (req, res) => {
    const token = req.headers['auth-token'];
    
    // 1. Pehle check karo user login hai ya nahi
    if (!token) return res.status(401).json({ success: false, message: "No Token Provided" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Razorpay Subscription options
        const options = {
            plan_id: "plan_SCuKbq5WtfZjMV", // <-- Apni Real Plan ID yahan dalein
            customer_notify: 1, 
            total_count: 12, // 1 saal tak monthly chalega
            notes: {
                userId: verified.id // User ki ID track karne ke liye
            }
        };

        // 3. Razorpay se Subscription ID generate karein
        const subscription = await razorpay.subscriptions.create(options);
        
        // 4. Frontend ko subscription_id bhej dein
        res.json({
            success: true,
            subscription_id: subscription.id, 
        });

    } catch (error) {
        console.error("Razorpay Subscription Error:", error);
        res.status(500).json({ success: false, message: error.message || "Subscription fail ho gayi" });
    }
});


// server/api/expenses.js
app.post('/api/expenses', async (req, res) => {
    try {
        const { title, amount, category, userId } = req.body;
        const newExpense = new Expense({
            title,
            amount: Number(amount),
            category,
            userId
        });
        await newExpense.save();
        res.status(201).json({ success: true, expense: newExpense });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Expenses Fetch karne ke liye
app.get('/api/expenses/:userId', async (req, res) => {
    const expenses = await Expense.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(expenses);
});


// server/api/expenses.js
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const expenseId = req.params.id;
        const result = await Expense.findByIdAndDelete(expenseId);
        
        if (!result) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        
        res.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route: Add asset to a specific client
app.post('/api/clients/:id/assets', async (req, res) => {
    try {
        const { name, url } = req.body;
        const clientId = req.params.id;

        if (!name || !url) {
            return res.status(400).json({ success: false, message: "Name and URL are required" });
        }

        // $push operator array ke andar naya object add kar deta hai
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { 
                $push: { 
                    assets: { name, url, type: 'Link' } 
                } 
            },
            { new: true } // Taaki update hone ke baad naya data return kare
        );

        if (!updatedClient) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.status(200).json({ success: true, assets: updatedClient.assets });
    } catch (error) {
        console.error("Asset Add Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Bonus: Delete Asset Route (Zaroorat padegi hi)
app.delete('/api/clients/:id/assets/:assetId', async (req, res) => {
    try {
        const { id, assetId } = req.params;
        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { $pull: { assets: { _id: assetId } } }, // $pull array se specific item nikal deta hai
            { new: true }
        );
        res.json({ success: true, assets: updatedClient.assets });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


app.listen(5000, () => console.log("Server running on port 5000"));