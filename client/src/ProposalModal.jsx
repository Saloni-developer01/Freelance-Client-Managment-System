import React, { useState } from 'react';
import { X, Plus, Trash2, Download, Send, CheckCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import toast from 'react-hot-toast';
import autoTable from "jspdf-autotable";


const ProposalModal = ({ isOpen, onClose, selectedClient }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([{ service: '', price: '' }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


    const [userProfile, setUserProfile] = useState(() => {
      // Page load hote hi local storage check karo
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : {
        companyName: "Saloni's Business",
        email: "", // Login ke baad bharna chahiye
        address: "",
        phone: "",
        signatureName: "The Freelancer",
        upiId: "",
        taxRate: 0 // <--- Ye add karna zaroori hai
      };
    });
    

  if (!isOpen) return null;

  const addItem = () => setItems([...items, { service: '', price: '' }]);
  
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => items.reduce((acc, item) => acc + Number(item.price || 0), 0);


const handleSendToClient = async () => {
  setLoading(true)
  try {
    // Basic validation check
    if (!selectedClient || !selectedClient.email) {
      return toast.error("Client email missing hai!");
    }

    // --- YAHAN TAX LOGIC ADD KAREIN ---
    const baseAmount = items.reduce((acc, item) => acc + Number(item.price || 0), 0);
    const taxRate = Number(userProfile.taxRate || 0); // Profile se tax uthaya
    const taxAmount = (baseAmount * taxRate) / 100;
    const totalWithTax = baseAmount + taxAmount;

    // const selectedClientData = clients.find(c => c.name === selectedClient);

    // 1. Save Proposal logic
    const response = await fetch(`${API_URL}/api/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: selectedClient._id,
        clientEmail: selectedClient.email, // <--- Ye database mein save hoga ab
        title: title,
        items: items,
        // totalAmount: calculateTotal(),
        // Naye fields jo humne add kiye
        baseAmount: baseAmount,
        taxRate: taxRate,
        taxAmount: taxAmount,
        totalAmount: totalWithTax, // Final amount database mein jayega
      }),
    });

    if (!response.ok) throw new Error("Proposal save failed");

    const data = await response.json();
    const shareableLink = `${window.location.origin}/view-proposal/${data.shareToken}`;
    
    // 2. Email API call (Error handle karne ke liye try-catch)
    try {
        await fetch(`${API_URL}/api/send-proposal-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientEmail: selectedClient.email,
            clientName: selectedClient.name,
            freelancerEmail: "webhostingportfolio124@gmail.com", 
            freelancerName: "FreelanceFlow Pro",
            proposalTitle: title,
            shareLink: shareableLink
          }),
        });
    } catch (e) { console.log("Email failed but moving to WhatsApp"); }

    // 3. WhatsApp Logic - Safe version (Yahan fix hai!)
    // Agar phone number hai toh replace karein, nahi toh khali string
    const clientPhone = selectedClient.phone ? String(selectedClient.phone).replace(/\D/g, '') : "";
    
    if (clientPhone) {
      const message = encodeURIComponent(`Hi ${selectedClient.name}, please check this proposal: ${shareableLink}`);
      const whatsappUrl = `https://wa.me/${clientPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
    
    navigator.clipboard.writeText(shareableLink);
    toast.success("Proposal sent & Link copied!");
    onClose();

  } catch (err) {
    console.error("Main Error:", err);
    toast.error("Kuch gadbad hai! Client data check karein.");
  }finally {
        setLoading(false); // 2. Loading stop
    }
};


 
  // const downloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(20);
  //   doc.text("PROPOSAL", 105, 20, { align: "center" });
    
  //   doc.setFontSize(12);
  //   doc.text(`Client: ${selectedClient?.name || 'Client Name'}`, 20, 40);
  //   doc.text(`Project: ${title}`, 20, 50);
  //   doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

  //   let yPos = 80;
  //   doc.text("Service", 20, yPos);
  //   doc.text("Price", 150, yPos);
  //   doc.line(20, yPos + 2, 180, yPos + 2);

  //   items.forEach((item) => {
  //     yPos += 10;
  //     doc.text(item.service, 20, yPos);
  //     doc.text(`Rs. ${item.price}`, 150, yPos);
  //   });

  //   doc.setFontSize(14);
  //   doc.text(`Total: Rs. ${calculateTotal()}`, 150, yPos + 20);
    
  //   doc.save(`${title}_Proposal.pdf`);
  // };


// 1. Pehle ye function banayein jo PDF download handle karega


// const handleSendToClient = async () => {
//   try {
//     // 1. Pehle pura client data dhoondo jo dropdown mein select hua hai
//     // Hum maan rahe hain ki 'selectedClient' mein sirf client ka naam hai
//     const selectedClientData = clients.find(c => c.name === selectedClient);

//     if (!selectedClientData || !selectedClientData.email) {
//       return toast.error("Client email missing hai! Pehle client ka email save karein.");
//     }

//     // 2. Proposal Save Logic (Database mein clientEmail zaroor bhejein)
//     const response = await fetch('http://localhost:5000/api/proposals', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         clientId: selectedClientData._id,
//         clientName: selectedClientData.name,  // Naam save hoga
//         clientEmail: selectedClientData.email, // <--- YAHAN FIX HAI: Database mein jayega
//         title: title,
//         items: items, // Make sure 'items' aapke state ka naam hai
//         totalAmount: calculateTotal(),
//         status: 'Sent' // Default status
//       }),
//     });

//     if (!response.ok) throw new Error("Proposal save failed");

//     const data = await response.json();
    
//     // 3. Shareable Link (Vite hai toh 5173 port check kar lena)
//     const shareableLink = `${window.location.origin}/view-proposal/${data.shareToken}`;
    
//     // 4. Email API call (Backend: send-proposal-email)
//     try {
//         await fetch('http://localhost:5000/api/send-proposal-email', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             clientEmail: selectedClientData.email,
//             clientName: selectedClientData.name,
//             freelancerEmail: "webhostingportfolio124@gmail.com", 
//             freelancerName: "FreelanceFlow Pro",
//             proposalTitle: title,
//             shareLink: shareableLink
//           }),
//         });
//     } catch (e) { 
//         console.log("Email failed, but moving ahead..."); 
//     }

//     // 5. WhatsApp Logic (Agar phone number hai)
//     const clientPhone = selectedClientData.phone ? String(selectedClientData.phone).replace(/\D/g, '') : "";
    
//     if (clientPhone) {
//       const message = encodeURIComponent(`Hi ${selectedClientData.name}, please check this proposal: ${shareableLink}`);
//       const whatsappUrl = `https://wa.me/${clientPhone}?text=${message}`;
//       window.open(whatsappUrl, '_blank');
//     }
    
//     // 6. Finishing up
//     navigator.clipboard.writeText(shareableLink);
//     toast.success("Proposal saved & Link copied!");
//     onClose();

//   } catch (err) {
//     console.error("Main Error:", err);
//     toast.error("Kuch gadbad hai! Console check karein.");
//   }
// };

const handleDownloadPDF = () => {
    // Ye object waisa hi hai jaisa generatePremiumPDF ko chahiye
    const proposalData = {
        clientName: selectedClient.name,
        title: title,
        items: items,
        totalAmount: calculateTotal()
    };

    const doc = generatePremiumPDF(proposalData);
    doc.save(`${title}_Proposal.pdf`); // Ye file download kar dega
};


const generatePremiumPDF = (proposalData) => {
  const doc = new jsPDF();
  const primaryColor = [79, 70, 229]; // Indigo color

  // --- Header Section ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT PROPOSAL", 14, 25);
  
  doc.setFontSize(10);
  // doc.text(`ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 160, 25);
  // doc.text(`ID: ${proposalData._id ? proposalData._id.slice(-6).toUpperCase() : 'TEMP-123'}`, 160, 25);
  doc.text(`ID: ${proposalData.shareToken ? proposalData.shareToken.slice(-6).toUpperCase() : 'INV-' + Math.floor(Math.random()*1000)}`, 160, 25);

  // --- Client & Freelancer Info ---
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.text("PREPARED FOR:", 14, 55);
  doc.setFont("helvetica", "bold");
  doc.text(proposalData.clientName, 14, 62);
  
  doc.setFont("helvetica", "normal");
  doc.text("DATE:", 140, 55);
  doc.setFont("helvetica", "bold");
  doc.text(new Date().toLocaleDateString(), 140, 62);

  // --- Project Title ---
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 75, 196, 75);
  doc.setFontSize(14);
  doc.text(`Project: ${proposalData.title}`, 14, 85);

  // --- Services Table ---
  const tableColumn = ["Service Description", "Price (INR)"];
  const tableRows = proposalData.items.map(item => [
    item.service,
    `Rs. ${item.price}`
  ]);

  // doc.autoTable({
  //   startY: 95,
  //   head: [tableColumn],
  //   body: tableRows,
  //   headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
  //   alternateRowStyles: { fillColor: [245, 247, 255] },
  //   margin: { left: 14, right: 14 },
  //   theme: 'grid'
  // });

  autoTable(doc, {
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    margin: { left: 14, right: 14 },
    theme: 'grid'
});

  // --- Total Amount Box ---
  // const finalY = doc.lastAutoTable.finalY + 10;
  // doc.setFillColor(248, 250, 252);
  // doc.rect(140, finalY, 56, 15, 'F');
  // doc.setFontSize(12);
  // doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  // doc.text(`Total: Rs. ${proposalData.totalAmount}`, 145, finalY + 10);



  // --- Total Amount Section (Replace existing Total Box) ---
const finalY = doc.lastAutoTable.finalY + 10;
const taxRate = Number(userProfile.taxRate || 0);
const baseAmount = calculateTotal();
const taxAmount = (baseAmount * taxRate) / 100;
const totalWithTax = baseAmount + taxAmount;

doc.setFontSize(10);
doc.setTextColor(100, 100, 100);
doc.text(`Subtotal: Rs. ${baseAmount.toFixed(2)}`, 140, finalY);
doc.text(`Tax (${taxRate}%): Rs. ${taxAmount.toFixed(2)}`, 140, finalY + 7);

doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
doc.rect(135, finalY + 12, 65, 12, 'F');
doc.setFontSize(12);
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.text(`Total: Rs. ${totalWithTax.toFixed(2)}`, 140, finalY + 20);


  // --- Footer / Terms ---
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text("Terms: This proposal is valid for 15 days. Digital signature required for approval.", 14, 280);

  return doc;
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0b0f1a] w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-white">Create Proposal</h2>
            <p className="text-slate-400 text-sm">For {selectedClient?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><X /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider">Project Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-black/40 border border-slate-800 rounded-xl text-white focus:border-indigo-500 outline-none transition-all" 
              placeholder="e.g. Website Redesign" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-500 block uppercase tracking-wider">Services & Pricing</label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 group">
                <input 
                  value={item.service}
                  onChange={(e) => updateItem(index, 'service', e.target.value)}
                  placeholder="Service Name" 
                  className="flex-1 p-3 bg-black/20 border border-slate-800 rounded-xl text-white text-sm"
                />
                <input 
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                  placeholder="Price" 
                  type="number" 
                  className="w-32 p-3 bg-black/20 border border-slate-800 rounded-xl text-white text-sm"
                />
                <button onClick={() => removeItem(index)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button onClick={addItem} className="flex items-center gap-2 text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors mt-2">
              <Plus size={16} /> Add Another Service
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-black/20 flex items-center justify-between">
          <div className="text-white">
            {/* <span className="text-slate-500 text-sm">Total Amount:</span> */}
            {/* <div className="text-2xl font-bold text-indigo-400">₹{calculateTotal()}</div> */}
            <div className="text-slate-500 text-[10px] uppercase tracking-tighter">
     Base: ₹{calculateTotal()} + {userProfile.taxRate}% Tax
  </div>
  <div className="text-2xl font-bold text-indigo-400">
    ₹{(calculateTotal() + (calculateTotal() * (Number(userProfile.taxRate || 0)) / 100)).toFixed(2)}
  </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all">
              <Download size={18} /> PDF
            </button>
            <button onClick={handleSendToClient} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all">
              {/* <Send size={18} />  */}
              {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Sending...</span>
        </>
    ) : (
      <>
      <Send size={18} /> 
       <span>Send to Client</span>
    </>
    )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;