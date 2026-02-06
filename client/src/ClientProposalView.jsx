// import React, { useState, useEffect } from 'react';
// import { Download, ShieldCheck, Clock } from 'lucide-react';
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// const ClientProposalView = ({ token }) => {
//     const [proposal, setProposal] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [clientName, setClientName] = useState("");
//     const [isSigned, setIsSigned] = useState(false);

//     useEffect(() => {
//         const fetchProposal = async () => {
//             try {
//                 const res = await fetch(`http://localhost:5000/api/proposals/share/${token}`);
//                 const data = await res.json();
//                 setProposal(data);
//                 if (data.status === 'Approved') setIsSigned(true);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching proposal");
//                 setLoading(false);
//             }
//         };
//         if (token) fetchProposal();
//     }, [token]);

//     const [userProfile, setUserProfile] = useState(() => {
//       // Page load hote hi local storage check karo
//       const saved = localStorage.getItem('user_profile');
//       return saved ? JSON.parse(saved) : {
//         companyName: "Saloni's Business",
//         email: "", // Login ke baad bharna chahiye
//         address: "",
//         phone: "",
//         signatureName: "The Freelancer",
//         upiId: ""
//       };
//     });

//     // YE FUNCTION AB INDEPENDENT HAI (userProfile par depend nahi karega)
//     // const generateInvoicePDF = (client, freelancerInfo) => {
//     //     const doc = new jsPDF();
        
//     //     // Agar freelancerInfo nahi hai toh fallback details
//     //     const fName = freelancerInfo?.companyName || "Saloni's Organization";
//     //     const fEmail = freelancerInfo?.email || "webhostingportfolio124@gmail.com";
//     //     const fAddress = freelancerInfo?.address || "India";
//     //     const fPhone = freelancerInfo?.phone || "N/A";
//     //     const fSig = freelancerInfo?.signatureName || fName;

//     //     // --- 1. Header ---
//     //     doc.setFontSize(20);
//     //     doc.setTextColor(63, 63, 191); 
//     //     doc.text(fName.toUpperCase(), 14, 22); 
        
//     //     doc.setFontSize(10);
//     //     doc.setTextColor(100);
//     //     doc.text([fAddress, `Phone: ${fPhone}`, `Email: ${fEmail}`], 14, 30);

//     //     doc.setFontSize(28);
//     //     doc.setTextColor(200);
//     //     doc.text("INVOICE", 140, 25);

//     //     // --- 2. Client Section ---
//     //     doc.setDrawColor(230);
//     //     doc.line(14, 45, 196, 45); 
//     //     doc.setFontSize(12);
//     //     doc.setTextColor(0);
//     //     doc.text("BILL TO:", 14, 55);
//     //     doc.setFont(undefined, 'bold');
//     //     doc.text(client.name, 14, 62);
//     //     doc.setFont(undefined, 'normal');
//     //     doc.text(`Project: ${client.projectTitle}`, 14, 68);

//     //     // --- 3. Table ---
//     //     autoTable(doc, {
//     //         startY: 75,
//     //         head: [['Description', 'Status', 'Total Amount']],
//     //         body: [[client.projectTitle, client.status, `Rs. ${client.budget}`]],
//     //         headStyles: { fillColor: [79, 70, 229] },
//     //         theme: 'striped'
//     //     });

//     //     const finalY = doc.lastAutoTable.finalY + 20;

//     //     // --- 4. Signature Section ---
//     //     doc.setFont("courier", "italic"); 
//     //     doc.setFontSize(16);
//     //     doc.text(fSig, 170, finalY + 30, { align: "center" });
//     //     doc.line(145, finalY + 33, 195, finalY + 33);
//     //     doc.setFont("helvetica", "normal");
//     //     doc.setFontSize(9);
//     //     doc.text("Authorised Signature", 170, finalY + 38, { align: "center" });

//     //     return { doc }; 
//     // };



//     const generatePremiumPDF = (proposalData) => {
//         const doc = new jsPDF();
//         const primaryColor = [79, 70, 229];

//         doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
//         doc.rect(0, 0, 210, 40, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(24);
//         doc.setFont("helvetica", "bold");
//         doc.text("PROJECT PROPOSAL", 14, 25);
        
//         // Fix ID: ShareToken use kar rahe hain
//         const displayId = proposalData.shareToken ? proposalData.shareToken.slice(-6).toUpperCase() : 'INV-124';
//         doc.setFontSize(10);
//         doc.text(`ID: ${displayId}`, 160, 25);

//         doc.setTextColor(40, 40, 40);
//         doc.setFontSize(12);
//         doc.text("PREPARED FOR:", 14, 55);
//         doc.setFont("helvetica", "bold");
//         doc.text(proposalData.clientName || "Client", 14, 62);
        
//         doc.setFont("helvetica", "normal");
//         doc.text("DATE:", 140, 55);
//         doc.text(new Date().toLocaleDateString(), 140, 62);

//         doc.setDrawColor(200, 200, 200);
//         doc.line(14, 75, 196, 75);
//         doc.setFontSize(14);
//         doc.text(`Project: ${proposalData.title}`, 14, 85);

//         const tableColumn = ["Service Description", "Price (INR)"];
//         const tableRows = proposalData.items.map(item => [item.service, `Rs. ${item.price}`]);

//         autoTable(doc, {
//             startY: 95,
//             head: [tableColumn],
//             body: tableRows,
//             headStyles: { fillColor: primaryColor },
//             theme: 'grid'
//         });

//         const finalY = doc.lastAutoTable.finalY + 10;
//         doc.text(`Total: Rs. ${proposalData.totalAmount}`, 145, finalY + 10);
//         return doc;
//     };






//     // const generateInvoicePDF = (client) => {
//     //     const doc = new jsPDF();

//     //     // Check karein ki client object exists karta hai
//     // const cName = client?.name || "Client";
//     // const cProject = client?.projectTitle || "Project";
        
//     //     // --- 1. Header & Logo area ---
//     //     doc.setFontSize(20);
//     //     doc.setTextColor(63, 63, 191); 
//     //     doc.text(userProfile.companyName?.toUpperCase() || "MY BUSINESS", 14, 22); 
        
//     //     doc.setFontSize(10);
//     //     doc.setTextColor(100);
//     //     doc.text([
//     //         userProfile.address || "Address not provided",
//     //         `Phone: ${userProfile.phone || 'N/A'}`,
//     //         `Email: ${userProfile.email}`
//     //     ], 14, 30);
    
//     //     doc.setFontSize(28);
//     //     doc.setTextColor(200);
//     //     doc.text("INVOICE", 140, 25);
    
//     //     // --- 2. Client Section ---
//     //     doc.setDrawColor(230);
//     //     doc.line(14, 45, 196, 45); 
        
//     //     doc.setFontSize(12);
//     //     doc.setTextColor(0);
//     //     doc.text("BILL TO:", 14, 55);
//     //     doc.setFont(undefined, 'bold');
//     //     doc.text(client.name, 14, 62);
//     //     doc.setFont(undefined, 'normal');
//     //     doc.text(`Project: ${client.projectTitle}`, 14, 68);
    
//     //     // --- 3. Final Calculations (Dono jagah same rahegi) ---
//     //     const taxRate = Number(userProfile.taxRate || 0);
//     //     const budget = Number(client.budget || 0);
//     //     const received = Number(client.received || 0);
        
//     //     const taxAmount = (budget * taxRate) / 100;
//     //     const finalTotal = budget + taxAmount;
//     //     const balanceWithTax = (finalTotal - received).toFixed(2); 
    
//     //     const currency = userProfile.currency === "₹" ? "Rs." : (userProfile.currency || "$");
    
//     //     // --- 4. Table ---
//     //     autoTable(doc, {
//     //         startY: 75,
//     //         head: [['Description', 'Status', 'Budget', `Tax (${taxRate}%)`, 'Total', 'Paid', 'Balance']],
//     //         body: [[
//     //             client.projectTitle,
//     //             client.status,
//     //             `${currency} ${budget}`,
//     //             `${currency} ${taxAmount.toFixed(2)}`,
//     //             `${currency} ${finalTotal.toFixed(2)}`,
//     //             `${currency} ${received}`,
//     //             `${currency} ${balanceWithTax}`
//     //         ]],
//     //         headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
//     //         theme: 'striped'
//     //     });
    
//     //     // --- 5. Footer Section ---
//     //     const finalY = doc.lastAutoTable.finalY + 20;
//     //     const isPro = userProfile.isPro;
        
//     //     doc.setFontSize(10);
//     //     doc.setTextColor(0);
//     //     doc.text(`Membership Status: ${isPro ? "PRO" : "FREE"}`, 14, finalY);
        
//     //     // Membership logic fix: FREE users ko expiry date nahi dikhegi
//     //     if (isPro) {
//     //         doc.text(`Valid Until: 28 Feb 2026`, 14, finalY + 7);
//     //     } else {
//     //         doc.setFontSize(8);
//     //         doc.setTextColor(150);
//     //         doc.text(`Plan: Standard Edition (No Expiry)`, 14, finalY + 7);
//     //     }
    
//     //     // Total Due (Display on Right)
//     //     doc.setFontSize(14);
//     //     doc.setFont(undefined, 'bold');
//     //     doc.setTextColor(0);
//     //     doc.text(`Total Due: ${currency} ${balanceWithTax}`, 140, finalY + 5);
    
//     //     // --- 6. Signature Section ---
//     //     const sigName = userProfile.signatureName || "The Freelancer";
//     //     doc.setFont("courier", "italic"); 
//     //     doc.setFontSize(16);
//     //     doc.setTextColor(40);
//     //     doc.text(sigName, 170, finalY + 30, { align: "center" });
        
//     //     doc.setDrawColor(150);
//     //     doc.line(145, finalY + 33, 195, finalY + 33);
        
//     //     doc.setFont("helvetica", "normal");
//     //     doc.setFontSize(9);
//     //     doc.setTextColor(100);
//     //     doc.text("Authorised Signature", 170, finalY + 38, { align: "center" });
    
//     //     return { doc, balanceWithTax, finalTotal }; 
//     // };







//     const generateInvoicePDF = (client) => {
//         const doc = new jsPDF();
        
//         // --- 1. Header & Logo area ---
//         doc.setFontSize(22);
//         // doc.setTextColor(63, 63, 191); 
//         doc.setTextColor(63, 63, 150); // Deep Indigo color
//         doc.setFont("helvetica", "bold");
//         doc.text(userProfile.companyName?.toUpperCase() || "MY BUSINESS", 14, 22); 
        
//         doc.setFontSize(9);
//         doc.setTextColor(100);
//         doc.setFont("helvetica", "normal");
//         doc.text([
//             userProfile.address || "Address not provided",
//             `Phone: ${userProfile.phone || 'N/A'}`,
//             `Email: ${userProfile.email}`
//         ], 14, 30);
    
//         doc.setFontSize(28);
//         // doc.setTextColor(200);
//         doc.setTextColor(200, 200, 200); // Light Grey for 'INVOICE'
//         doc.text("INVOICE", 145, 25);
    
//         // --- 2. Client Section ---
//         doc.setDrawColor(200);
//         // doc.line(14, 45, 196, 45); 
//         doc.line(14, 48, 196, 48); // Divider Line
        
//         doc.setFontSize(11);
//         doc.setTextColor(0);
//         doc.text("BILL TO:", 14, 58);
//         // doc.setFont(undefined, 'bold');
//         doc.setFont("helvetica", "bold");
//         doc.text(client.name, 14, 65);
//         // doc.setFont(undefined, 'normal');
//         doc.setFont("helvetica", "normal");
//         doc.text(`Project: ${client.projectTitle}`, 14, 71);
    
//         // --- 3. Final Calculations ---
//         const taxRate = Number(userProfile.taxRate || 0);
//         const budget = Number(client.budget || 0);
//         const received = Number(client.received || 0);
//         const taxAmount = (budget * taxRate) / 100;
//         const finalTotal = budget + taxAmount;
//         const balanceWithTax = (finalTotal - received).toFixed(2); 
    
//         const currencySymbol = userProfile.currency === "₹" ? "Rs." : (userProfile.currency || "$");
    
//         // --- 4. Table ---
//         autoTable(doc, {
//             startY: 75,
//             head: [['Description', 'Status', 'Budget', `Tax (${taxRate}%)`, 'Total', 'Paid', 'Balance']],
//             body: [[
//                 client.projectTitle,
//                 client.status,
//                 `${currencySymbol} ${budget}`,
//                 `${currencySymbol} ${taxAmount.toFixed(2)}`,
//                 `${currencySymbol} ${finalTotal.toFixed(2)}`,
//                 `${currencySymbol} ${received}`,
//                 `${currencySymbol} ${balanceWithTax}`
//             ]],
//             // headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
//             // theme: 'striped'
//             headStyles: { fillColor: [63, 63, 150], textColor: [255, 255, 255], fontStyle: 'bold' },
//             alternateRowStyles: { fillColor: [245, 245, 255] },
//             theme: 'striped'
//         });
    
//         // --- 5. Payment & QR Code Section (Table ke baad) ---
//         const afterTableY = doc.lastAutoTable.finalY + 35;
    
//         if (afterTableY > 250) { 
//         doc.addPage(); // Naya page agar jagah khatam ho jaye
//     }
        
//         if (userProfile.upiId && userProfile.currency === "₹") {
//             // Payment Info Text
//             doc.setFontSize(12);
//             doc.setTextColor(0);
//             doc.setFont("helvetica", "bold");
//             doc.text("PAYMENT INFORMATION:", 14, afterTableY);
    
//             doc.setFontSize(10);
//             doc.setFont("helvetica", "normal");
//             doc.setTextColor(100);
//             doc.text(`UPI ID: `, 14, afterTableY + 9);
//             doc.setTextColor(16, 185, 129); // Green color
//             doc.setFont("helvetica", "bold");
//             doc.text(`${userProfile.upiId}`, 30, afterTableY + 9);
    
//             // Dynamic QR Code Logic
//             const qrData = `upi://pay?pa=${userProfile.upiId}&pn=${encodeURIComponent(userProfile.companyName)}&am=${balanceWithTax}&cu=INR`;
//             const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
            
//             // Add QR Code Image (Positioned right)
//             doc.addImage(qrCodeUrl, 'PNG', 145, afterTableY - 10, 35, 35);
//             doc.setFontSize(7);
//             doc.setTextColor(150);
//             doc.text("Scan to pay Due Amount", 146, afterTableY + 28);
    
//             doc.setFontSize(8);
//             doc.setTextColor(150);
//             doc.setFont("helvetica", "normal");
//             doc.text("*Please share a screenshot after making the payment.", 14, afterTableY + 16);
//         }
    
//         // yaha sai 
//         // --- 6. Membership & Totals Section ---
//         // const finalY = Math.max(afterTableY + 40, doc.lastAutoTable.finalY + 60);
//         // const isPro = userProfile.isPro;
        
//         // doc.setFontSize(10);
//         // doc.setTextColor(0);
//         // doc.text(`Membership Status: ${isPro ? "PRO" : "FREE"}`, 14, finalY);
        
//         // if (isPro) {
//         //     doc.text(`Valid Until: 28 Feb 2026`, 14, finalY + 7);
//         // } else {
//         //     doc.setFontSize(8);
//         //     doc.setTextColor(150);
//         //     doc.text(`Plan: Standard Edition (No Expiry)`, 14, finalY + 7);
//         // }
    
//         // // Total Due on the Right
//         // doc.setFontSize(14);
//         // doc.setFont("helvetica", "bold");
//         // doc.text(`Total Due: ${currencySymbol} ${balanceWithTax}`, 140, finalY + 5);
    
//         // // --- 7. Signature Section ---
//         // const sigName = userProfile.signatureName || "The Freelancer";
//         // doc.setFont("courier", "italic"); 
//         // doc.setFontSize(16);
//         // doc.text(sigName, 170, finalY + 25, { align: "center" });
        
//         // doc.setDrawColor(150);
//         // doc.line(145, finalY + 28, 195, finalY + 28);
        
//         // doc.setFont("helvetica", "normal");
//         // doc.setFontSize(9);
//         // doc.setTextColor(100);
//         // doc.text("Authorised Signature", 170, finalY + 33, { align: "center" });
    
//         // return { doc, balanceWithTax, finalTotal }; 
//         // yaha tak
    
    
//         // --- 6. Totals & Signature ---
//         const finalY = Math.max(afterTableY + 40, doc.lastAutoTable.finalY + 75);
        
//         // Total Due (Right Side)
//         doc.setFontSize(14);
//         doc.setTextColor(0);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Total Due: ${currencySymbol} ${balanceWithTax}`, 140, finalY + 5);
    
//         // Signature Area
//         const sigName = userProfile.signatureName || "The Freelancer";
//         doc.setFont("courier", "italic"); 
//         doc.setFontSize(16);
//         doc.text(sigName, 170, finalY + 25, { align: "center" });
//         doc.setDrawColor(180);
//         doc.line(145, finalY + 28, 195, finalY + 28);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(9);
//         doc.text("Authorised Signature", 170, finalY + 33, { align: "center" });
    
//         // Membership Info (Bottom Left)
//         doc.setFontSize(8);
//         doc.setTextColor(150);
//         doc.text(`Membership: ${userProfile.isPro ? "PRO" : "FREE"}`, 14, finalY + 25);
//         doc.text(`Plan: Standard Edition (No Expiry)`, 14, finalY + 30);
    
//         return { doc, balanceWithTax, finalTotal };
//     };





    
//     const triggerInvoiceEmail = async (proposalData) => {
//         // const doc = generatePremiumPDF(proposalData);
//         const { doc } = generateInvoicePDF(client);
//         const pdfBase64 = doc.output('datauristring');

//         await fetch('http://localhost:5000/api/send-invoice', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 clientEmail: proposalData.clientEmail, // FIXED: selectedClient hata diya
//                 clientName: clientName,
//                 pdfBase64: pdfBase64,
//                 // freelancerName: "Saloni's Organization",
//                 freelancerName: userProfile.signatureName,
//                 invoiceDetails: {
//                     projectTitle: proposalData.title,
//                     budget: proposalData.totalAmount
//                 }
//             })
//         });
//     };

    



// //     const triggerInvoiceEmail = async (proposalData) => {
// //     // 1. Premium Invoice Generate karo (App.jsx wala logic)
// //     // Hum userProfile ki jagah proposalData se ya hardcoded info pass karenge
// //     const { doc, balanceWithTax } = generateInvoicePDF({
// //         name: proposalData.clientName,
// //         projectTitle: proposalData.title,
// //         budget: proposalData.totalAmount,
// //         received: 0, // Kyunki abhi advance deposit baki hai
// //         status: "Approved"
// //     });

// //     const pdfBase64 = doc.output('datauristring');

// //     // 2. Email Send karo
// //     await fetch('http://localhost:5000/api/send-invoice', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //             clientEmail: proposalData.clientEmail,
// //             clientName: proposalData.clientName,
// //             // Freelancer details dynamic (App.jsx wale variable use honge agar props se aa rahe hain)
// //             freelancerName: "Saloni's Organization", 
// //             freelancerEmail: "webhostingportfolio124@gmail.com",
// //             pdfBase64: pdfBase64,
// //             emailBody: `Hi ${proposalData.clientName},\n\nYour proposal for "${proposalData.title}" has been approved and digitally signed. Please find the official invoice attached.\n\nRegards,\nSaloni's Organization`,
// //             invoiceDetails: {
// //                 projectTitle: proposalData.title,
// //                 budget: proposalData.totalAmount,
// //                 balance: balanceWithTax
// //             }
// //         })
// //     });
// // };

//     // const triggerInvoiceEmail = async (proposalData) => {
//     //     // Yahan freelancer ki info manually ya data se pass karein
//     //     const freelancer = {
//     //         companyName: "Saloni's Organization",
//     //         email: "webhostingportfolio124@gmail.com",
//     //         address: "Lucknow, UP",
//     //         phone: "+91 XXXXX XXXXX",
//     //         signatureName: "Saloni"
//     //     };

//     //     const { doc } = generateInvoicePDF({
//     //         name: proposalData.clientName,
//     //         projectTitle: proposalData.title,
//     //         budget: proposalData.totalAmount,
//     //         status: "Approved"
//     //     }, freelancer);

//     //     const pdfBase64 = doc.output('datauristring');

//     //     await fetch('http://localhost:5000/api/send-invoice', {
//     //         method: 'POST',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         body: JSON.stringify({
//     //             clientEmail: proposalData.clientEmail,
//     //             clientName: proposalData.clientName,
//     //             freelancerName: freelancer.companyName,
//     //             freelancerEmail: freelancer.email,
//     //             pdfBase64: pdfBase64,
//     //             // YE RAHA TERA REGARDS WALA SECTION
//     //             emailBody: `Hi ${proposalData.clientName},\n\nYour proposal for "${proposalData.title}" has been approved and digitally signed. Attached is your official signed invoice.\n\nRegards,\n${freelancer.companyName}`,
//     //             invoiceDetails: {
//     //                 projectTitle: proposalData.title,
//     //                 budget: proposalData.totalAmount
//     //             }
//     //         })
//     //     });
//     // };

//     // const handleSignAndApprove = async () => {
//     //     if (!clientName) return alert("Please enter your name for signature!");
//     //     try {
//     //         const res = await fetch(`http://localhost:5000/api/proposals/approve/${token}`, {
//     //             method: 'PUT',
//     //             headers: { 'Content-Type': 'application/json' },
//     //             body: JSON.stringify({ clientSignature: clientName })
//     //         });

//     //         if (res.ok) {
//     //             const updatedData = await res.json();
//     //             setProposal(updatedData);
//     //             setIsSigned(true);
//     //             await triggerInvoiceEmail(updatedData); 
//     //             alert("Digital Signature Verified! The invoice has been sent to your email.");
//     //         }
//     //     } catch (err) {
//     //         alert("Approval failed!");
//     //     }
//     // };




// // const triggerInvoiceEmail = async (proposalData) => {
// //     // proposalData se direct fields nikalein
// //     const clientForPDF = {
// //         name: proposalData.clientName || "Client",
// //         projectTitle: proposalData.title || "Project",
// //         budget: proposalData.totalAmount || 0,
// //         received: 0,
// //         status: "Approved"
// //     };

// //     // PDF Generate karein
// //     const { doc, balanceWithTax } = generateInvoicePDF(clientForPDF);

// //     const pdfBase64 = doc.output('datauristring');

// //     // Email API call
// //     await fetch('http://localhost:5000/api/send-invoice', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //             clientEmail: proposalData.clientEmail,
// //             clientName: proposalData.clientName,
// //             freelancerName: userProfile.companyName || "Saloni's Organization", 
// //             freelancerEmail: "webhostingportfolio124@gmail.com",
// //             pdfBase64: pdfBase64,
// //             emailBody: `Hi ${proposalData.clientName},\n\nYour proposal for "${proposalData.title}" has been approved. Please find the invoice attached.\n\nRegards,\n${userProfile.companyName}`,
// //             invoiceDetails: {
// //                 projectTitle: proposalData.title,
// //                 budget: proposalData.totalAmount,
// //                 balance: balanceWithTax
// //             }
// //         })
// //     });
// // };




// /// dono pdf bhejne kai liye



// // const triggerInvoiceEmail = async (proposalData) => {
// //     // 1. Client and Project Details (Safely handle undefined)
// //     const cName = proposalData.clientName || "Client";
// //     const pTitle = proposalData.title || "Project";
// //     const total = proposalData.totalAmount || 0;
// //     const cSig = proposalData.clientSignature || cName; // Client ka digital sign

// //     // --- A. INVOICE PDF GENERATE KAREIN (With Both Signatures) ---
// //     const invoiceInfo = {
// //         name: cName,
// //         projectTitle: pTitle,
// //         budget: total,
// //         received: 0,
// //         status: "Approved",
// //         clientSignature: cSig // Pass signature to PDF function
// //     };
// //     const { doc: invoiceDoc, balanceWithTax } = generateInvoicePDF(invoiceInfo);
// //     const invoiceBase64 = invoiceDoc.output('datauristring');

// //     // --- B. SIGNED PROPOSAL PDF GENERATE KAREIN ---
// //     // Aap ek naya function generateProposalPDF bana sakte hain, 
// //     // yahan main simplified version de raha hoon:
// //     const proposalDoc = new jsPDF();
// //     proposalDoc.setFontSize(22);
// //     proposalDoc.text("SIGNED PROJECT PROPOSAL", 14, 22);
// //     proposalDoc.setFontSize(12);
// //     proposalDoc.text(`Project: ${pTitle}`, 14, 40);
// //     proposalDoc.text(`Client: ${cName}`, 14, 48);
    
// //     // Signature Section at Bottom
// //     const finalY = 150;
// //     proposalDoc.setFont("courier", "italic");
// //     proposalDoc.text(userProfile.signatureName || "Freelancer", 40, finalY, { align: "center" });
// //     proposalDoc.text(cSig, 150, finalY, { align: "center" });
// //     proposalDoc.line(20, finalY + 2, 70, finalY + 2); // Freelancer line
// //     proposalDoc.line(130, finalY + 2, 180, finalY + 2); // Client line
// //     proposalDoc.setFont("helvetica", "normal");
// //     proposalDoc.setFontSize(10);
// //     proposalDoc.text("Authorised (Freelancer)", 45, finalY + 7, { align: "center" });
// //     proposalDoc.text("Accepted (Client)", 155, finalY + 7, { align: "center" });
    
// //     const proposalBase64 = proposalDoc.output('datauristring');

// //     // --- 2. EMAIL API CALL (With Multiple Attachments) ---
// //     try {
// //         await fetch('http://localhost:5000/api/send-invoice', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({
// //                 clientEmail: proposalData.clientEmail,
// //                 clientName: cName, // Fixes "Hello undefined"
// //                 freelancerName: userProfile.companyName || "Saloni's Organization",
// //                 pdfBase64: invoiceBase64, // Primary attachment
// //                 proposalBase64: proposalBase64, // Secondary attachment
// //                 emailBody: `Hi ${cName},\n\nYour proposal for "${pTitle}" has been approved and digitally signed. Attached are your official Proposal and Invoice.\n\nRegards,\n${userProfile.companyName}`,
// //                 invoiceDetails: {
// //                     projectTitle: pTitle,
// //                     budget: total,
// //                     balance: balanceWithTax
// //                 }
// //             })
// //         });
// //     } catch (error) {
// //         console.error("Email Error:", error);
// //     }
// // };



// // const triggerInvoiceEmail = async (proposalData) => {
// //     // 1. Data Safety (Undefined check)
// //     const cName = proposalData.clientName || "Client";
// //     const pTitle = proposalData.title || "Project";
// //     const total = proposalData.totalAmount || 0;
// //     const cSig = proposalData.clientSignature || cName;

// //     // --- A. INVOICE PDF GENERATION ---
// //     const clientForPDF = {
// //         name: cName,
// //         projectTitle: pTitle,
// //         budget: total,
// //         received: 0,
// //         status: "Approved",
// //         clientSignature: cSig // Client sign add kiya
// //     };
// //     const { doc: invDoc, balanceWithTax } = generateInvoicePDF(clientForPDF);
// //     const invoiceBase64 = invDoc.output('datauristring');

// //     // --- B. SIGNED PROPOSAL PDF GENERATION ---
// //     // Yahan humne aapki requirement ke hisab se double signature add kiye hain
// //     const propDoc = new jsPDF();
// //     propDoc.setFontSize(20);
// //     propDoc.text("DIGITALLY SIGNED PROPOSAL", 105, 20, { align: "center" });
    
// //     propDoc.setFontSize(12);
// //     propDoc.text(`Client Name: ${cName}`, 20, 40);
// //     propDoc.text(`Project: ${pTitle}`, 20, 50);
// //     propDoc.text(`Total Value: Rs. ${total}`, 20, 60);

// //     // Double Signatures at the bottom
// //     const sigY = 150;
// //     propDoc.setFont("courier", "italic");
// //     propDoc.text(userProfile.companyName || "Freelancer", 50, sigY, { align: "center" });
// //     propDoc.text(cSig, 150, sigY, { align: "center" });
    
// //     propDoc.setDrawColor(0);
// //     propDoc.line(25, sigY+2, 75, sigY+2); // Freelancer Line
// //     propDoc.line(125, sigY+2, 175, sigY+2); // Client Line
    
// //     propDoc.setFont("helvetica", "normal");
// //     propDoc.setFontSize(10);
// //     propDoc.text("Authorised Signatory", 50, sigY+7, { align: "center" });
// //     propDoc.text("Client Acceptance", 150, sigY+7, { align: "center" });

// //     const proposalBase64 = propDoc.output('datauristring');

// //     // --- 3. CALL NEW BACKEND ROUTE ---
// //     await fetch('http://localhost:5000/api/approve-and-send', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //             clientEmail: proposalData.clientEmail,
// //             clientName: cName, // Fixed: Isse email me 'Hello undefined' nahi aayega
// //             freelancerName: userProfile.companyName || "Saloni's Organization", 
// //             freelancerEmail: "webhostingportfolio124@gmail.com",
// //             pdfBase64: invoiceBase64,      // Invoice PDF
// //             proposalBase64: proposalBase64, // Proposal PDF
// //             invoiceDetails: {
// //                 projectTitle: pTitle,
// //                 budget: total,
// //                 balance: balanceWithTax
// //             }
// //         })
// //     });
// // };



// const handleSignAndApprove = async () => {
//     if (!clientName) return alert("Please enter your name for signature!");

//     try {
//         const res = await fetch(`http://localhost:5000/api/proposals/approve/${token}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ clientSignature: clientName })
//         });

//         if (res.ok) {
//             const updatedData = await res.json();
//             setProposal(updatedData);
//             setIsSigned(true);
            
//             // Email bhejte waqt error handle karein
//             try {
//                 await triggerInvoiceEmail(updatedData); 
//                 alert("Digital Signature Verified! The invoice has been sent to your email.");
//             } catch (emailErr) {
//                 console.error("Email Error:", emailErr);
//                 alert("Signature saved, but email sending failed. Check console.");
//             }
//         } else {
//             alert("Server Error in Approval");
//         }
//     } catch (err) {
//         console.error("Approval Error:", err);
//         alert("Approval failed!");
//     }
// };



//     // ... baaki render logic same rahega ...
//     // if (loading) return <div className="text-white">Loading...</div>;
//         if (loading) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white italic">Loading Proposal Details...</div>;
//     if (!proposal) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white">Proposal Not Found!</div>;

//     // return (
//     //     <div className="min-h-screen bg-[#0b0f1a] py-12 px-4 text-white">
//     //         <div className="max-w-4xl mx-auto bg-[#111827] rounded-3xl p-8 border border-slate-800">
//     //             <h1 className="text-3xl font-black mb-6">{proposal.title}</h1>
//     //             <div className="p-8 bg-black/30 rounded-3xl border border-dashed border-slate-700">
//     //                 {!isSigned ? (
//     //                     <div className="space-y-4">
//     //                         <input 
//     //                             type="text" 
//     //                             placeholder="Type name to sign" 
//     //                             className="w-full bg-transparent border-b-2 border-slate-700 p-2 italic outline-none focus:border-indigo-500"
//     //                             onChange={(e) => setClientName(e.target.value)}
//     //                         />
//     //                         <button onClick={handleSignAndApprove} className="px-8 py-3 bg-indigo-600 rounded-lg font-bold">
//     //                             Approve & Sign
//     //                         </button>
//     //                     </div>
//     //                 ) : (
//     //                     <div className="text-center">
//     //                         <p className="text-4xl font-serif italic">{proposal.clientSignature}</p>
//     //                         <p className="text-slate-500 text-[10px] mt-2">Digitally Signed & Verified</p>
//     //                     </div>
//     //                 )}
//     //             </div>
//     //         </div>
//     //     </div>
//     // );




//         return (
//         <div className="min-h-screen bg-[#0b0f1a] py-12 px-4">
//             <div className="max-w-4xl mx-auto bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
//                 <div className={`p-4 text-center text-sm font-bold uppercase ${isSigned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
//                     {isSigned ? "✓ Approved & Digitally Signed" : "• Awaiting Your Approval"}
//                 </div>

//                 {/* YE RAHA STATUS BAR */}
//       {/* <div className={`p-4 text-center text-sm font-bold uppercase tracking-widest 
//           ${proposal.status === 'Paid' ? 'bg-blue-500/20 text-blue-400' : 
//             isSigned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
//           {proposal.status === 'Paid' ? "✓ Payment Received - Project Started" : 
//            isSigned ? "✓ Approved & Digitally Signed" : "• Awaiting Your Approval"}
//       </div> */}

//                 <div className="p-8 md:p-12">
//                     <h1 className="text-3xl font-black text-white mb-6">{proposal.title}</h1>
                    
//                     <div className="mb-10">
//                         <table className="w-full text-left">
//                             <thead className="border-b border-slate-800 text-slate-500 text-xs">
//                                 <tr>
//                                     <th className="py-4">Service</th>
//                                     <th className="py-4 text-right">Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="text-white">
//                                 {proposal.items.map((item, i) => (
//                                     <tr key={i} className="border-b border-slate-800/50">
//                                         <td className="py-5">{item.service}</td>
//                                         <td className="py-5 text-right text-indigo-400 font-bold">{userProfile.currency}{item.price}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/*<div className="flex justify-end mb-12">
//                         <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-right">
//                             <p className="text-slate-400 text-xs">Total Project Value</p>
//                             <p className="text-2xl font-black text-white">₹{proposal.totalAmount}</p>
//                         </div>
//                     </div>*/}

//                     <div className="flex justify-between text-green-400 mb-10 mt-24">
//         <span>Tax ({proposal.taxRate}%)</span>
//         <span>+{userProfile.currency}{proposal.taxAmount}</span>
//     </div>

//                     <div className="flex mb-10 mt-1 justify-between items-center bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
//         <span className="text-lg font-bold text-white">Total Project Value</span>
//         <span className="text-2xl font-black text-white">
//             {userProfile.currency}{proposal.totalAmount}
//         </span>
//     </div>

//                     <div className="bg-black/30 p-8 rounded-3xl border border-dashed border-slate-700">
//                         <h3 className="text-white font-bold mb-4 flex items-center gap-2">
//                             <ShieldCheck className="text-indigo-400" /> Digital Acceptance
//                         </h3>
//                         {!isSigned ? (
//                             <div className="space-y-4">
//                                 <input 
//                                     type="text"
//                                     placeholder="Type your full name to sign"
//                                     className="w-full bg-transparent border-b-2 border-slate-700 p-2 text-xl text-white italic outline-none focus:border-indigo-500"
//                                     onChange={(e) => setClientName(e.target.value)}
//                                 />
//                                 <button onClick={handleSignAndApprove} className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all">
//                                     Approve & Sign
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="text-center py-4 border-t border-slate-800">
//                                 <p className="text-4xl font-serif text-white italic">{proposal.clientSignature}</p>
//                                 <p className="text-slate-500 text-[10px] mt-2 uppercase">Signed Digitally • Verified Document</p>
//                             </div>
//                         )}


//                         {/* // UI mein Signature ke niche dikhayein: */}
// {/* {isSigned && (
//     <div className="mt-6 text-center">
//         <p className="text-green-400 mb-4 font-semibold">Proposal Approved & Digitally Signed!</p>
//         <button 
//             onClick={handlePayment}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg"
//         >
//             Pay Advance ₹{proposal.totalAmount}
//         </button>
//     </div>
// )} */}



// {/* // UI Section (Return ke andar Signature ke niche) */}
// {/* {isSigned && (
//     <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
//         <p className="text-emerald-400 font-bold mb-4">Verification Complete! ✓</p>
//         <button 
//             onClick={handlePayment}
//             className="group relative flex items-center gap-3 mx-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
//         >
//             Pay Project Deposit (₹{proposal.totalAmount})
//         </button>
//     </div>
// )} */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

// };

// export default ClientProposalView;















































import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, ShieldCheck, Clock } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ClientProposalView = ({ token }) => {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clientName, setClientName] = useState(""); // This is for the input field
    const [isSigned, setIsSigned] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const res = await fetch(`${API_URL}/api/proposals/share/${token}`);
                const data = await res.json();
                setProposal(data);
                if (data.status === 'Approved') setIsSigned(true);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching proposal");
                setLoading(false);
            }
        };
        if (token) fetchProposal();
    }, [token]);

    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('user_profile');
        return saved ? JSON.parse(saved) : {
            companyName: "Saloni's Business",
            email: "webhostingportfolio124@gmail.com",
            address: "India",
            phone: "",
            signatureName: "The Freelancer",
            upiId: "",
            currency: "₹",
            taxRate: 0
        };
    });

    const generateInvoicePDF = (clientData) => {
        const doc = new jsPDF();
    console.log("Client data from generateInvoicePDF",clientData);
        
        // --- 1. Header & Logo ---
        doc.setFontSize(22);
        doc.setTextColor(63, 63, 150);
        doc.setFont("helvetica", "bold");
        doc.text(userProfile.companyName?.toUpperCase() || "MY BUSINESS", 14, 22); 
        
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text([
            userProfile.address || "Address not provided",
            `Phone: ${userProfile.phone || 'N/A'}`,
            `Email: ${userProfile.email}`
        ], 14, 30);

        doc.setFontSize(28);
        doc.setTextColor(200, 200, 200);
        doc.text("INVOICE", 145, 25);

        // --- 2. Client Section ---
        doc.setDrawColor(200);
        doc.line(14, 48, 196, 48);
        
        doc.setFontSize(11);
        doc.setTextColor(0);
        //old
        // doc.text("BILL TO:", 14, 58);
        // doc.setFont("helvetica", "bold");
        // doc.text(clientData.name || "Client", 14, 65);

        //new
        doc.setFont("helvetica", "bold");
        doc.text(`BILL TO: ${clientData.name || "Client"}`, 14, 58);
        doc.setFont("helvetica", "normal");
        doc.text(`Project: ${clientData.projectTitle}`, 14, 71);

        // --- 3. Calculations ---
        const taxRate = Number(userProfile.taxRate || 0);
        const budget = Number(clientData.budget || 0);
        const received = 0; 
        // const taxAmount = (budget * taxRate) / 100;
        const taxAmount = 0;
        const finalTotal = budget + taxAmount;
        const balanceWithTax = (finalTotal - received).toFixed(2); 
        const currencySymbol = userProfile.currency === "₹" ? "Rs." : (userProfile.currency || "$");

        //new
        // Pehle items ko table format mein ready karein
        // const tableBody = proposal.items.map(item => [
        //     item.service,
        //     `${currencySymbol} ${item.price.toFixed(2)}`
        // ]);

        //new 
        const tableBody = proposal.items.map(item => [
    { content: item.service, styles: { halign: 'left' } },
    { content: `${currencySymbol} ${item.price.toFixed(2)}`, styles: { halign: 'right' } }
    ]);

        //new
        // Summary rows (Tax aur Total) ke liye hum extra rows add karenge niche
        // tableBody.push(
        //     ['Subtotal', `${currencySymbol} ${budget}`],
        //     [`Tax (${taxRate}%)`, `${currencySymbol} ${taxAmount.toFixed(2)}`],
        //     [{ content: 'Total Amount', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, 
        //      { content: `${currencySymbol} ${finalTotal.toFixed(2)}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]
        // );

        //new
        tableBody.push(
    [
        { content: 'Subtotal', styles: { fontStyle: 'bold', halign: 'right', textColor: [100, 116, 139] } },
        { content: `${currencySymbol} ${budget}`, styles: { halign: 'right' } }
    ],
    [
        { content: `Tax (${taxRate}%)`, styles: { fontStyle: 'bold', halign: 'right', textColor: [100, 116, 139] } },
        { content: `${currencySymbol} ${taxAmount.toFixed(2)}`, styles: { halign: 'right' } }
    ],
    [
        { content: 'Grand Total', styles: { fontStyle: 'bold', halign: 'right', fillColor: [79, 70, 229], textColor: [255, 255, 255] } },
        { content: `${currencySymbol} ${finalTotal.toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'right', fillColor: [79, 70, 229], textColor: [255, 255, 255] } }
    ]
);


        // --- 4. Table --- old
        // autoTable(doc, {
        //     startY: 75,
        //     head: [['Description', 'Status', 'Budget', `Tax (${taxRate}%)`, 'Total', 'Paid', 'Balance']],
        //     body: [[
        //         clientData.projectTitle,
        //         clientData.status,
        //         `${currencySymbol} ${budget}`,
        //         `${currencySymbol} ${taxAmount.toFixed(2)}`,
        //         `${currencySymbol} ${finalTotal.toFixed(2)}`,
        //         `${currencySymbol} ${received}`,
        //         `${currencySymbol} ${balanceWithTax}`
        //     ]],
        //     headStyles: { fillColor: [63, 63, 150], textColor: [255, 255, 255], fontStyle: 'bold' },
        //     alternateRowStyles: { fillColor: [245, 245, 255] },
        //     theme: 'striped'
        // });


        //new
        // --- 4. Table ---
        // autoTable(doc, {
        //     startY: 75,
        //     head: [['Service Description', 'Price']], // Header clean rakhein
        //     body: tableBody,
        //     headStyles: { fillColor: [63, 63, 150], textColor: [255, 255, 255], fontStyle: 'bold' },
        //     columnStyles: {
        //         1: { halign: 'right' } // Price wale column ko right align karne ke liye
        //     },
        //     alternateRowStyles: { fillColor: [245, 245, 255] },
        //     theme: 'striped'
        // });

        //new
        autoTable(doc, {
    startY: 75,
    head: [['Service Description', 'Amount']],
    body: tableBody,
    
    // --- Styling Fixes ---
    theme: 'grid', // 'grid' zyada clean lagta hai formal invoices mein
    headStyles: { 
        fillColor: [63, 63, 150], 
        textColor: [255, 255, 255], 
        fontSize: 10, 
        cellPadding: 4 
    },
    bodyStyles: { 
        fontSize: 9, 
        cellPadding: 4, 
        textColor: [50, 50, 50],
        lineColor: [230, 230, 230] // Light grey borders
    },
    columnStyles: {
        0: { cellWidth: 'auto' }, // Description ko space do
        1: { cellWidth: 40, halign: 'right' } // Amount column fixed rakho
    },
    margin: { left: 15, right: 15 },
    styles: { font: 'helvetica' }
});


        // --- 5. Payment & QR ---
        const afterTableY = doc.lastAutoTable.finalY + 20;
        if (afterTableY > 250) { 
         doc.addPage(); // Naya page agar jagah khatam ho jaye
     }
        if (userProfile.upiId && userProfile.currency === "₹") {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("PAYMENT INFORMATION:", 14, afterTableY);
            //old
            // doc.setFontSize(10);
            // doc.setFont("helvetica", "normal");
            // doc.setTextColor(16, 185, 129); // Green color
            // doc.text(`UPI ID: ${userProfile.upiId}`, 14, afterTableY + 8);

            //new
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100);
            doc.text(`UPI ID: `, 14, afterTableY + 9);
            doc.setTextColor(16, 185, 129); // Green color
            doc.setFont("helvetica", "bold");
            doc.text(`${userProfile.upiId}`, 30, afterTableY + 9);

            const qrData = `upi://pay?pa=${userProfile.upiId}&pn=${encodeURIComponent(userProfile.companyName)}&am=${balanceWithTax}&cu=INR`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
            // doc.addImage(qrCodeUrl, 'PNG', 145, afterTableY - 10, 35, 35);
             
            //new
            // Add QR Code Image (Positioned right)
        doc.addImage(qrCodeUrl, 'PNG', 145, afterTableY - 10, 35, 35);
        doc.setFontSize(7);
        doc.setTextColor(150);
        doc.text("Scan to pay Due Amount", 146, afterTableY + 28);

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setFont("helvetica", "normal");
        doc.text("*Please share a screenshot after making the payment.", 14, afterTableY + 16);
        }
        


        // --- 6. Totals & Signature ---
        const finalY = Math.max(afterTableY + 40, doc.lastAutoTable.finalY + 60);
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Due: ${currencySymbol} ${balanceWithTax}`, 140, finalY + 5);


        // Signature Area
        const sigName = userProfile.signatureName || "The Freelancer";
        doc.setFont("courier", "italic"); 
        doc.setFontSize(16);
        doc.text(sigName, 170, finalY + 25, { align: "center" });
        // doc.line(145, finalY + 23, 195, finalY + 23);

        //new
         doc.setDrawColor(180);
         doc.line(145, finalY + 28, 195, finalY + 28);      
         doc.setFont("helvetica", "normal");
         doc.setFontSize(9);
        //  doc.setTextColor(100);
         doc.text("Authorised Signature", 170, finalY + 33, { align: "center" });
        
        return { doc, balanceWithTax, finalTotal };
    };

    const triggerInvoiceEmail = async (proposalData) => {
        // Yahan mapping karni hogi proposalData se client structure mein
        const clientInfo = {
            name: proposalData.clientName,
            projectTitle: proposalData.title,
            budget: proposalData.totalAmount, // Base amount (proposal ka total)
            status: "Active"
        };

        console.log("Client info from triggertInvoiceEmail",clientInfo);
        const { doc } = generateInvoicePDF(clientInfo);
        const pdfBase64 = doc.output('datauristring');
        

        const emailData = {
        clientEmail: proposalData.clientEmail, // Ensure karein ki key 'email' hai ya 'clientEmail'
        clientName: proposalData.clientSignature || proposalData.clientName || "Client", // ✅ FIX: undefined hatane ke liye
        freelancerName: userProfile.companyName || "Freelancer", 
        freelancerEmail: userProfile.email,
        taxRate: 0, // ✅ FIX: Proposal mein tax added hai, isliye yahan 0 bhejein taaki backend phir se calculate na kare
        invoiceDetails: {
            projectTitle: proposalData.title,
            budget: proposalData.totalAmount || proposalData.budget // Jo final amount hai wahi bhejein
        },
        pdfBase64: pdfBase64 // Agar PDF nahi bhej rahe toh khali chhodein
    };

    await axios.post(`${API_URL}/api/send-invoice`, emailData);

        // await fetch('http://localhost:5000/api/send-invoice', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         clientEmail: proposalData.clientEmail,
        //         clientName: proposalData.clientName,
        //         pdfBase64: pdfBase64,
        //         freelancerName: userProfile.companyName,
        //         freelancerEmail: userProfile.email,
        //         taxRate: userProfile.taxRate,
        //         invoiceDetails: {
        //             projectTitle: proposalData.title,
        //             budget: proposalData.totalAmount
        //         }
        //     })
        // });
    };

    const handleSignAndApprove = async () => {
        if (!clientName) return alert("Please enter your name for signature!");
        setIsApproving(true);
        try {
            const res = await fetch(`${API_URL}/api/proposals/approve/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientSignature: clientName })
            });

            if (res.ok) {
                const updatedData = await res.json();
                setProposal(updatedData);
                setIsSigned(true);
                try {
                    console.log(updatedData);
                    await triggerInvoiceEmail(updatedData); 
                    alert("Digital Signature Verified! The invoice has been sent to your email.");
                } catch (emailErr) {
                    console.error("Email Error:", emailErr);
                    alert("Signature saved, but email sending failed.");
                }
            }
        } catch (err) {
            alert("Approval failed!");
        } finally {
        setIsApproving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white italic">Loading...</div>;
    if (!proposal) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white">Proposal Not Found!</div>;

    return (
        <div className="min-h-screen bg-[#0b0f1a] py-12 px-4">
            <div className="max-w-4xl mx-auto bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className={`p-4 text-center text-sm font-bold uppercase ${isSigned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isSigned ? "✓ Approved & Digitally Signed" : "• Awaiting Your Approval"}
                </div>
                <div className="p-8 md:p-12">
                    <h1 className="text-3xl font-black text-white mb-6">{proposal.title}</h1>
                    
                    {/* Services Table */}
                    <div className="mb-10">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-800 text-slate-500 text-xs">
                                <tr>
                                    <th className="py-4">Service</th>
                                    <th className="py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                {proposal.items.map((item, i) => (
                                    <tr key={i} className="border-b border-slate-800/50">
                                        <td className="py-5">{item.service}</td>
                                        <td className="py-5 text-right text-indigo-400 font-bold">{userProfile.currency}{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                     <div className="flex justify-between text-green-400 mb-10 mt-24">
         <span>Tax ({proposal.taxRate}%)</span>
        <span>+{userProfile.currency}{proposal.taxAmount}</span>
    </div>

                    <div className="flex mb-10 justify-between items-center bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                        <span className="text-lg font-bold text-white">Total Project Value</span>
                        <span className="text-2xl font-black text-white">{userProfile.currency}{proposal.totalAmount}</span>
                    </div>

                    <div className="bg-black/30 p-8 rounded-3xl border border-dashed border-slate-700">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-indigo-400" /> Digital Acceptance
                        </h3>
                        {!isSigned ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Type your full name to sign"
                                    className="w-full bg-transparent border-b-2 border-slate-700 p-2 text-xl text-white italic outline-none focus:border-indigo-500"
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                                <button onClick={handleSignAndApprove} disabled={isApproving} className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all">
                                    {isApproving ? "Verifying & Sending..." : "Sign & Approve"}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-4 border-t border-slate-800">
                                <p className="text-4xl font-serif text-white italic">{proposal.clientSignature}</p>
                                <p className="text-slate-500 text-[10px] mt-2 uppercase">Signed Digitally • Verified Document</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProposalView;