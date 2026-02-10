const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const { 
        clientEmail, 
        clientName, 
        pdfBase64, 
        freelancerName, 
        freelancerEmail, 
        invoiceDetails,
        taxRate // <--- Frontend se taxRate bhi pass karein 
    } = req.body;

    // Calculation logic
    const baseBudget = Number(invoiceDetails?.budget || 0);
    const rate = Number(taxRate || 0); // User Profile wala tax
    const taxAmount = (baseBudget * rate) / 100;
    const finalTotal = baseBudget + taxAmount;

    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'webhostingportfolio124@gmail.com',
    //         pass: 'luyx vtzs nosl rupt' // Aapka app password
    //     }
    // });

    //new
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 587 ke liye false hona chahiye
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Ye connection ko block hone se rokta hai
  },
  connectionTimeout: 20000, // Wait time badha kar 20 seconds kar diya
});

    const mailOptions = {
        from: `"${freelancerName} via FreelanceFlow" <webhostingportfolio124@gmail.com>`,
        to: clientEmail,
        bcc: freelancerEmail,
        replyTo: freelancerEmail,
        subject: `Invoice: ${invoiceDetails?.projectTitle || 'Project'}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #3f3fbf;">Hello ${clientName},</h2>
                <p>Please find the invoice attached for <b>${invoiceDetails?.projectTitle}</b>.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><b>Base Amount:</b> Rs. ${baseBudget.toFixed(2)}</p>
                <p><b>Tax (${rate}%):</b> Rs. ${taxAmount.toFixed(2)}</p>
                <p style="font-size: 18px; color: #10b981;"><b>Total Amount: Rs. ${finalTotal.toFixed(2)}</b></p>
                <br/>
                <p>Regards,<br/><b>${freelancerName}</b></p>
            </div>
        `,
        attachments: [
            {
                filename: `Invoice_${clientName}.pdf`,
                path: pdfBase64, // Base64 string yahan work karegi
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email Sent!" });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; // Router export karein