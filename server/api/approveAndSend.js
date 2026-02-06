const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const { 
        clientEmail, 
        clientName, 
        pdfBase64,       // Ye Invoice PDF hai
        proposalBase64,  // Ye Signed Proposal PDF hai
        freelancerName, 
        freelancerEmail, 
        invoiceDetails 
    } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webhostingportfolio124@gmail.com',
            pass: 'luyx vtzs nosl rupt'
        }
    });

    // const mailOptions = {
    //     from: `"${freelancerName} via FreelanceFlow" <webhostingportfolio124@gmail.com>`,
    //     to: clientEmail,
    //     bcc: freelancerEmail,
    //     replyTo: freelancerEmail,
    //     subject: `Proposal Approved & Invoice: ${invoiceDetails?.projectTitle}`,
    //     html: `
    //         <div style="font-family: sans-serif; padding: 20px; color: #333;">
    //             <h2>Hello ${clientName},</h2>
    //             <p>Great news! Your proposal for <b>${invoiceDetails?.projectTitle}</b> has been digitally signed and approved.</p>
    //             <p>Attached you will find both the <b>Signed Proposal</b> and the <b>Invoice</b> for your records.</p>
    //             <p><b>Total Amount:</b> Rs. ${invoiceDetails?.budget}</p>
    //             <br/>
    //             <p>Regards,<br/>${freelancerName}</p>
    //         </div>
    //     `,
    //     attachments: [
    //         {
    //             filename: `Invoice_${clientName}.pdf`,
    //             path: pdfBase64, // Invoice
    //         },
    //         {
    //             filename: `Signed_Proposal_${clientName}.pdf`,
    //             path: proposalBase64, // Signed Proposal
    //         }
    //     ]
    // };


    // ... (Nodemailer setup same rahega)
const mailOptions = {
    from: `"${freelancerName} via FreelanceFlow" <webhostingportfolio124@gmail.com>`,
    to: clientEmail,
    subject: `Proposal Approved & Invoice: ${invoiceDetails?.projectTitle}`,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; background-color: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 10px; border-top: 5px solid #4F46E5;">
                <h2 style="color: #4F46E5;">Hello ${clientName},</h2>
                <p>Great news! Your proposal for <b>${invoiceDetails?.projectTitle}</b> has been approved and digitally signed.</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><b>Base Amount:</b> Rs. ${invoiceDetails?.budget}</p>
                    <p style="margin: 5px 0; color: #ef4444;"><b>Tax (${invoiceDetails.taxRate}%):</b> Rs. ${invoiceDetails.taxAmount}</p>
                    <hr>
                    <p style="margin: 5px 0; font-size: 18px;"><b>Total Payable:</b> Rs. ${invoiceDetails?.balance}</p>
                </div>
                <p>Please find the <b>Signed Proposal</b> and <b>Official Invoice</b> attached below.</p>
                <br/>
                <p>Best Regards,<br/><strong>${freelancerName}</strong></p>
            </div>
        </div>
    `,
    attachments: [
        { filename: `Invoice_${clientName}.pdf`, path: pdfBase64 },
        { filename: `Signed_Proposal_${clientName}.pdf`, path: proposalBase64 }
    ]
};

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Both PDFs Sent!" });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;