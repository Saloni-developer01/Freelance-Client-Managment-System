import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Users, DollarSign, Search, Plus, Trash2, FileText, Briefcase, TrendingUp, X, Settings, CheckCircle, CreditCard, LogOut, Crown, Receipt, FolderOpen, ExternalLink, PlusSquare, FilePlus, Bell, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Auth from './Auth';
import PricingModal from './PricingModal';
import Success from './Success'; // Pehle file banayein phir import karein
import { Mail } from 'lucide-react'; // Icons import karein
import { Toaster, toast } from 'react-hot-toast';
import ProposalModal from './ProposalModal';
import ClientProposalView from './ClientProposalView';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showPricing, setShowPricing] = useState(false);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expenses, setExpenses] = useState([]); // Ye line missing thi, isliye error aaya
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ title: '', amount: '', category: 'Software' });
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newAsset, setNewAsset] = useState({ name: '', url: '' });
  const path = window.location.pathname;
  const isProposalView = path.startsWith('/view-proposal/');
  const proposalToken = isProposalView ? path.split('/').pop() : null;
  const [proposals, setProposals] = useState([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


  // const [userProfile, setUserProfile] = useState({
  //   companyName: user?.companyName || 'Freelance Flow Pro',
  //   address: '123 Tech Park, India',
  //   email: user?.email || '',
  // });

  //   const [userProfile, setUserProfile] = useState({
  //   companyName: user?.companyName || 'My Freelance Business',
  //   address: user?.address || 'Your Address Here',
  //   phone: user?.phone || 'Your Phone Number',
  //   email: user?.email || '',
  //   upiId: user?.upiId || 'paytm@upi', // New Field for Payment Link
  // });



  // Frontend: Settings ya Dashboard file mein
  const [userProfile, setUserProfile] = useState(() => {
    // Page load hote hi local storage check karo
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      companyName: "Saloni's Business",
      email: "", // Login ke baad bharna chahiye
      address: "",
      phone: "",
      signatureName: "The Freelancer",
      upiId: ""
    };
  });

  const [formData, setFormData] = useState({ name: '', email: '', projectTitle: '', budget: '', received: 0, status: 'Active' });

  const fetchExpenses = async () => {
    const storedToken = localStorage.getItem('token');
    if (!userProfile?._id || !storedToken) return;

    try {
      const res = await fetch(`${API_URL}/api/expenses/${userProfile._id}`, {
        headers: { 'auth-token': storedToken }
      });
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`${API_URL}/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'auth-token': localStorage.getItem('token') }
      });

      if (res.ok) {
        toast.success("Expense removed!");
        fetchExpenses(); // List aur Profit automatic update ho jayenge
      }
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  };

  // 2. Main Dashboard useEffect
  useEffect(() => {
    const loadDashboardData = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return;

      try {
        // Profile Fetch
        const profileRes = await fetch(`${API_URL}/api/user/profile_info`, {
          headers: { 'auth-token': storedToken }
        });
        const profileData = await profileRes.json();
        if (profileData) {
          setUserProfile({ ...profileData, taxRate: profileData.taxRate || 0 });
          localStorage.setItem('user_profile', JSON.stringify(profileData));
        }

        // Clients Fetch
        const clientsRes = await fetch(`${API_URL}/api/clients`, {
          headers: { 'auth-token': storedToken }
        });
        const clientsData = await clientsRes.json();
        if (clientsData) setClients(clientsData);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    loadDashboardData();
  }, [token]); // Khali array taaki sirf mount par chale

  // 3. Separate useEffect Expenses ke liye (Jab profile load ho jaye)
  useEffect(() => {
    // if (userProfile?._id) {
    //     fetchExpenses();
    // }
    if (token) {
      fetchExpenses();
    }
  }, [token]);


  useEffect(() => {
    const fetchProposals = async () => {
      const res = await fetch(`${API_URL}/api/proposals`);
      const data = await res.json();
      setProposals(data);
    };
    fetchProposals();
  }, []);

  const fetchClients = () => {
    axios.get(`${API_URL}/api/clients`, {
      headers: { 'auth-token': token }
    })
      .then(res => setClients(res.data))
      .catch(err => console.log("Fetch Error", err));
  };

  const handleLogout = () => {
    // 1. LocalStorage se sab clear karein
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile"); // Agar aapne profile save ki hai toh

    // 2. User State ko reset karein
    setUserProfile({
      companyName: "",
      email: "",
      isPro: false, // Ise false par reset karna zaroori hai
      taxRate: 0,
      address: "",
      phone: "",
      signatureName: "",
      upiId: ""
      // ... baki fields
    });

    // 3. Login page par redirect karein
    window.location.href = "/login";

    toast.success("Logged out successfully!");
  };


  // 2. Delete Function Fix (Headers add kiye hain)
  const handleDelete = (id) => {
    if (window.confirm("Delete this client?")) {
      axios.delete(`${API_URL}/api/clients/${id}`, {
        headers: { 'auth-token': token } // Yeh line zaroori hai!
      })
        .then(() => fetchClients())
        .catch(err => toast.error("Delete failed"));
    }
  };

  const handleAddClient = (e) => {
    e.preventDefault();

    // Check if user is free and already has 3 clients
    if (!userProfile.isPro && clients.length >= 3) {
      toast.error("Free limit reached! Upgrade to PRO to add more clients.");
      return;
    }

    axios.post(`${API_URL}/api/clients`, formData, {
      headers: { 'auth-token': token }
    })
      .then(() => {
        fetchClients();
        setShowForm(false);
        setFormData({ name: '', projectTitle: '', budget: '', received: 0, status: 'Active' });
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          toast.error(err.response.data.message); // "Upgrade to PRO..." wala message
          setShowPricing(true); // Direct pricing dikhao
        } else {
          toast.error("Something went wrong!");
        }
      });
  };

  const exportToCSV = () => {
    if (clients.length === 0) {
      toast.error("No data available to export!");
      return;
    }

    // 1. Naye Headers: Tax aur Total columns ke saath
    const headers = [
      "Client Name",
      "Project Title",
      "Status",
      "Base Budget",
      "Tax Rate (%)",
      "Tax Amount",
      "Total (Inc. Tax)",
      "Paid Amount",
      "Balance Due"
    ];

    // 2. Mapping client data with Tax logic
    const csvRows = clients.map(client => {
      const budget = Number(client.budget || 0);
      const received = Number(client.received || 0); // Sahi variable name 'received' hai
      const taxRate = Number(userProfile.taxRate || 0);

      const taxAmount = (budget * taxRate) / 100;
      const totalWithTax = budget + taxAmount;
      const balance = totalWithTax - received;

      return [
        `"${client.name}"`,
        `"${client.projectTitle}"`,
        `"${client.status}"`,
        budget.toFixed(2),
        `${taxRate}%`,
        taxAmount.toFixed(2),
        totalWithTax.toFixed(2),
        received.toFixed(2),
        balance.toFixed(2)
      ].join(",");
    });

    // 3. Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. File Name fix (Slashes '/' file name mein error de sakte hain)
    const fileNameDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 5. Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FreelanceFlow_Report_${fileNameDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Detailed report downloaded! 📊");
  };

  const handleSaveProfile = async () => {
    try {
      // 1. Local storage mein save karo (Immediate effect for refresh)
      localStorage.setItem('freelancer_profile', JSON.stringify(userProfile));

      // 2. Database (MongoDB) mein update bhejo
      const response = await fetch(`${API_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // new
        },
        // body: JSON.stringify(userProfile)

        // /new
        body: JSON.stringify({
          ...userProfile, // Isse saari fields chali jayengi
          taxRate: Number(userProfile.taxRate) // Confirm karein ki ye ja raha hai
        })
      });

      if (response.ok) {
        toast.success("Profile updated and saved!");
        setShowSettings(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };


  const addAsset = async () => {
    if (!newAsset.name || !newAsset.url) {
      toast.error("Please fill all fields");
      return;
    }

    if (newAsset.url.length > 2000) {
      return toast.error("Link is too long! Paste only the URL, not the image data.");
    }

    try {
      const res = await fetch(`${API_URL}/api/clients/${selectedClient._id}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(newAsset)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Asset added! 📁");

        // Local state update taaki modal mein turant dikhe
        const updatedClients = clients.map(c =>
          c._id === selectedClient._id ? { ...c, assets: data.assets } : c
        );
        setClients(updatedClients);

        // Selected client ki assets list bhi update karo
        setSelectedClient({ ...selectedClient, assets: data.assets });

        setNewAsset({ name: '', url: '' }); // Clear input
      }
    } catch (err) {
      toast.error("Failed to add asset");
    }
  };


  const handleDeleteAsset = async (clientId, assetIndex) => {
    if (!window.confirm("Are you sure want to delete this?")) return;

    try {
      const res = await fetch(`${API_URL}/api/clients/${clientId}/assets/${assetIndex}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedClient = await res.json();
        // 1. Poori clients list update karein
        setClients(prev => prev.map(c => c._id === clientId ? updatedClient : c));

        // 2. IMPORTANT: Modal ke data ko bhi update karein
        setSelectedClient(updatedClient);

        toast.success("Asset deleted successfully!");
      } else {
        const errorData = await res.text();
        console.error("Server Error:", errorData);
        toast.error("Server Error!");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Network issue!");
    }
  };

  const calculateTax = (amount) => (amount * 0.18).toFixed(2);
  const calculateTotal = (amount) => (Number(amount) + Number(calculateTax(amount))).toFixed(2);

  const generateInvoicePDF = (client) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    // doc.setTextColor(63, 63, 191); 
    doc.setTextColor(63, 63, 150); // Deep Indigo color
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
    // doc.setTextColor(200);
    doc.setTextColor(200, 200, 200); // Light Grey for 'INVOICE'
    doc.text("INVOICE", 145, 25);

    // --- 2. Client Section ---
    doc.setDrawColor(200);
    // doc.line(14, 45, 196, 45); 
    doc.line(14, 48, 196, 48); // Divider Line

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("BILL TO:", 14, 58);
    // doc.setFont(undefined, 'bold');
    doc.setFont("helvetica", "bold");
    doc.text(client.name, 14, 65);
    // doc.setFont(undefined, 'normal');
    doc.setFont("helvetica", "normal");
    doc.text(`Project: ${client.projectTitle}`, 14, 71);

    // --- 3. Final Calculations ---
    const taxRate = Number(userProfile.taxRate || 0);
    const budget = Number(client.budget || 0);
    const received = Number(client.received || 0);
    const taxAmount = (budget * taxRate) / 100;
    const finalTotal = budget + taxAmount;
    const balanceWithTax = (finalTotal - received).toFixed(2);

    const currencySymbol = userProfile.currency === "₹" ? "Rs." : (userProfile.currency || "$");

    // --- 4. Table ---
    autoTable(doc, {
      startY: 75,
      head: [['Description', 'Status', 'Budget', `Tax (${taxRate}%)`, 'Total', 'Paid', 'Balance']],
      body: [[
        client.projectTitle,
        client.status,
        `${currencySymbol} ${budget}`,
        `${currencySymbol} ${taxAmount.toFixed(2)}`,
        `${currencySymbol} ${finalTotal.toFixed(2)}`,
        `${currencySymbol} ${received}`,
        `${currencySymbol} ${balanceWithTax}`
      ]],
      // headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      // theme: 'striped'
      headStyles: { fillColor: [63, 63, 150], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      theme: 'striped'
    });

    // --- 5. Payment & QR Code Section (Table ke baad) ---
    const afterTableY = doc.lastAutoTable.finalY + 35;

    if (afterTableY > 250) {
      doc.addPage(); // Naya page agar jagah khatam ho jaye
    }

    if (userProfile.upiId && userProfile.currency === "₹") {
      // Payment Info Text
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT INFORMATION:", 14, afterTableY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`UPI ID: `, 14, afterTableY + 9);
      doc.setTextColor(16, 185, 129); // Green color
      doc.setFont("helvetica", "bold");
      doc.text(`${userProfile.upiId}`, 30, afterTableY + 9);

      // Dynamic QR Code Logic
      const qrData = `upi://pay?pa=${userProfile.upiId}&pn=${encodeURIComponent(userProfile.companyName)}&am=${balanceWithTax}&cu=INR`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

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
    const finalY = Math.max(afterTableY + 40, doc.lastAutoTable.finalY + 75);

    // Total Due (Right Side)
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Due: ${currencySymbol} ${balanceWithTax}`, 140, finalY + 5);

    // Signature Area
    const sigName = userProfile.signatureName || "The Freelancer";
    doc.setFont("courier", "italic");
    doc.setFontSize(16);
    doc.text(sigName, 170, finalY + 25, { align: "center" });
    doc.setDrawColor(180);
    doc.line(145, finalY + 28, 195, finalY + 28);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Authorised Signature", 170, finalY + 33, { align: "center" });

    // Membership Info (Bottom Left)
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Membership: ${userProfile.isPro ? "PRO" : "FREE"}`, 14, finalY + 25);
    doc.text(`Plan: Standard Edition (No Expiry)`, 14, finalY + 30);

    return { doc, balanceWithTax, finalTotal };
  };

  const downloadInvoice = (client) => {
    const { doc } = generateInvoicePDF(client);
    doc.save(`Invoice_${client.name}.pdf`);
  };

  const sendEmailWithPDF = async (client) => {
    const { doc, balanceWithTax } = generateInvoicePDF(client);
    const pdfBase64 = doc.output('datauristring');

    try {
      await fetch(`${API_URL}/api/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: client.email,
          clientName: client.name,
          freelancerName: userProfile.signatureName || userProfile.companyName,
          freelancerEmail: userProfile.email, // <--- Ye freelancer ki ID hai BCC ke liye
          pdfBase64: pdfBase64,
          taxRate: userProfile.taxRate, // <--- Ye line add karein
          invoiceDetails: {
            projectTitle: client.projectTitle,
            budget: client.budget,
            balance: balanceWithTax
          }
        })
      });
      toast.success("Invoice sent and copy BCC'd to you!");
    } catch (err) {
      toast.error("Failed to send email");
    }
  };



  const getDaysLeft = (date) => {
    if (!date) return 0;

    // 1. Aaj ki date (sirf date, time zero kar dete hain)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Subscription ki date (iska bhi time zero kar dete hain)
    const subDate = new Date(date);
    subDate.setHours(0, 0, 0, 0);

    // 3. Difference nikaalte hain
    const diffTime = today.getTime() - subDate.getTime();

    // 4. Milliseconds ko Days mein badlein
    const daysPassed = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const remaining = 30 - daysPassed;

    return remaining > 0 ? remaining : 0;
  };

  const totalExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);

  const currentStats = (() => {
    let totalWithTax = 0;
    let totalCollected = 0;

    clients.forEach(client => {
      const budget = Number(client.budget || 0);
      const received = Number(client.received || 0);

      // Global tax rate jo apne setting mein save kiya hai
      const taxRate = Number(userProfile.taxRate || 0);
      const taxAmount = (budget * taxRate) / 100;

      totalWithTax += (budget + taxAmount);
      totalCollected += received;
    });

    return {
      totalValue: totalWithTax,
      collected: totalCollected,
      pending: totalWithTax - totalCollected

    };
  })();

  const netProfit = currentStats.totalValue - (Number(totalExpenses) || 0);



  const shareOnWhatsApp = (client) => {
    // 1. Same Calculations as PDF
    const taxRate = Number(userProfile.taxRate || 0);
    const budget = Number(client.budget || 0);
    const received = Number(client.received || 0);
    const taxAmount = (budget * taxRate) / 100;
    const finalTotal = budget + taxAmount;
    const balanceWithTax = (finalTotal - received).toFixed(2);

    const upiId = userProfile.upiId;

    // 2. UPI Link with correct amount (am=${balanceWithTax})
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(userProfile.companyName)}&am=${balanceWithTax}&cu=INR`;

    // 3. Professional Message
    const message = `Hi *${client.name}*,\nYour invoice for *${client.projectTitle}* is ready.\n\n*Total Due:* ₹${balanceWithTax}\n*Payment Link:* ${upiLink}\n\nPlease pay using the link above or let me know if you need the PDF!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };


  const StatCard = ({ label, val, icon, color }) => (
    <div className="bg-[#161b2c] p-6 rounded-3xl border border-slate-800">
      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-slate-900 ${color}`}>{icon}</div>
      <div className="text-slate-500 text-xs font-bold uppercase mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{val}</div>
    </div>
  );


  const sendEmailInvoice = async (client) => {
    try {
      const response = await fetch(`${API_URL}/api/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: client.email || 'client-email@example.com', // Client ka email database se
          clientName: client.name,
          freelancerName: userProfile.signatureName || userProfile.companyName,
          invoiceDetails: {
            projectTitle: client.projectTitle,
            budget: client.budget,
            balance: client.budget - (client.paidAmount || 0)
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Email sent to " + client.name);
      }
    } catch (err) {
      toast.error("Error sending email");
    }
  };

  const saveExpense = async () => {
    try {
      const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseData,
          userId: userProfile._id // Login user ki ID
        })
      });

      if (res.ok) {
        toast.success("Expense added!");
        setShowExpenseModal(false);
        fetchExpenses();
      }
    } catch (err) {
      toast.error("Failed to add expense");
    }
  };

  const handleUpdate = (id, field, value) => {
    const finalValue = (field === 'received' || field === 'budget') ? Number(value) : value;

    axios.put(`${API_URL}/api/clients/${id}`, { [field]: finalValue }, {
      headers: { 'auth-token': token }
    })
      .then(() => {
        setClients(clients.map(c => c._id === id ? { ...c, [field]: finalValue } : c));

        if (field === 'received') {
          toast.success("Payment status updated!");
        }
      })
      .catch(err => toast.error("Update failed!"));
  };


  if (isProposalView) {
    return <ClientProposalView token={proposalToken} />;
  }
  if (!token) return <Auth setToken={setToken} setUser={setUser} />;
  if (path === '/success') return <Success />;


  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 p-4 md:p-8 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">

        {/* Navbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Briefcase className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Freelance<span className="text-indigo-500">Flow</span></h1>
            {/* //new */}
            <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">MANAGEMENT SUITE</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* SEARCH */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-2.5 bg-[#161b2c] border border-slate-800 rounded-xl outline-none focus:border-indigo-500 w-64 text-sm transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0"></div>
            {user?.isPro ? (
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  PRO MEMBER
                </span>
                <span className="text-[9px] text-slate-500 mt-0.5">
                  {getDaysLeft(user.subscriptionDate)} Days remaining
                </span>
              </div>
            ) : (
              <button onClick={() => setShowPricing(true)} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-600/20 active:scale-95 transition-transform">
                <Crown size={18} /> GO PRO
              </button>
            )}


            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 transition-all text-sm font-medium"
              title="Export to Excel/CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>


            {/* <button onClick={exportToCSV} className="p-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all shadow-sm" title="Export CSV">
              <Download size={18} />
            </button> */}

            <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"><Plus size={18} /> <span className="hidden sm:inline">ADD</span></button>


            <button onClick={() => setShowSettings(true)} className="p-2.5 bg-[#161b2c] border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 transition-all"><Settings size={20} /></button>
            <button onClick={handleLogout} className="p-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><LogOut size={20} /></button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard
            label="Total Value"
            val={`${userProfile.currency}${currentStats.totalValue.toFixed(2)}`}
            icon={<DollarSign />}
            color="text-emerald-500"
          />
          <StatCard label="Clients" val={clients.length} icon={<Users />} color="text-blue-500" />
          <StatCard
            label="Collected"
            val={`${userProfile.currency}${currentStats.collected.toFixed(2)}`}
            icon={<CheckCircle />}
            color="text-indigo-500"
          />
          <StatCard
            label="Pending"
            val={`${userProfile.currency}${currentStats.pending.toFixed(2)}`}
            icon={<CreditCard />}
            color="text-orange-500"
          />

          <div className="bg-[#161b2c] p-5 rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Net Profit</p>
                <h3 className={`text-xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {userProfile.currency}{netProfit.toFixed(2)}
                </h3>
              </div>
              <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <TrendingUp size={18} />
              </div>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="mt-4 w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all text-[10px] font-black uppercase tracking-tighter"
            >
              - Add Expense
            </button>
          </div>


          {/* <StatCard
            label="Net Profit"
            val={`${userProfile.currency}${netProfit.toFixed(2)}`}
            icon={<TrendingUp size={20} />}
            color={netProfit >= 0 ? "text-emerald-400" : "text-red-400"}
            desc={`After ${userProfile.currency}${totalExpenses} expenses`}
          /> */}

          {/* // Dashboard.jsx mein stats ke paas ye button: */}
          {/* <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
          >
            - Add Expense
          </button> */}

        </div>


        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
        <div className="flex flex-col gap-8">

          {/* Main Table */}
          <div className="lg:col-span-2 bg-[#161b2c] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden transition-all hover:border-slate-700">
            <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-800/10">
              <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                <Briefcase size={16} className="text-indigo-500" /> Active Projects
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Manage your ongoing client work and payments</p>
              <div className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {clients.length} Total Projects
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0b0f1a]/30 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800/50">
                  <tr>
                    <th className="px-6 py-4">Client & Project</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total (Tax Inc.)</th> {/* Naya Column */}
                    <th className="px-6 py-4">Payment Tracking ({userProfile.currency})</th>
                    <th className="px-6 py-4 text-center">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {clients.filter(client =>
                    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.status.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(client => {
                    const budget = Number(client.budget || 0);
                    const taxRate = Number(userProfile.taxRate || 0);
                    const totalWithTax = budget + (budget * taxRate / 100);

                    return (
                      <tr key={client._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-white">{client.name}</div>
                          <div className="text-xs text-indigo-400">{client.projectTitle}</div>
                        </td>

                        <td className="p-5">
                          <select
                            value={client.status}
                            onChange={(e) => handleUpdate(client._id, 'status', e.target.value)}
                            className="text-xs font-bold px-3 py-1 rounded-full bg-[#0b0f1a] border border-slate-700 text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>

                        {/* Total with Tax Column */}
                        <td className="p-5">
                          <div className="text-sm font-medium text-slate-300">
                            {userProfile.currency}{totalWithTax.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500">Base: {budget} + {taxRate}% tax</div>
                        </td>

                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            {proposals.some(p => p.clientName === client.name && p.status === 'Paid') ? (
                              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded text-xs">
                                ✓ FULL PAID
                              </span>
                            ) : (
                              <>
                                <input
                                  type="number"
                                  value={client.received || 0}
                                  onChange={(e) => handleUpdate(client._id, 'received', e.target.value)}
                                  className="w-20 bg-[#0b0f1a] border border-slate-700 rounded px-2 py-1 text-emerald-400 text-sm outline-none focus:border-emerald-500/50"
                                />
                                <span className="text-slate-500 text-xs">/ {totalWithTax.toFixed(0)}</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => downloadInvoice(client)} title="Download PDF" className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"><FileText size={16} /></button>

                            <button onClick={() => shareOnWhatsApp(client)} title="Share on WhatsApp" className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all">
                              <svg size={16} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.27 9.27 0 01-4.703-1.277L4 21.18l1.303-4.756a9.278 9.278 0 01-1.23-4.623c0-5.117 4.16-9.277 9.274-9.277 2.482 0 4.812.966 6.565 2.72a9.213 9.213 0 012.718 6.557c0 5.119-4.16 9.277-9.278 9.277m8.536-17.805A10.737 10.737 0 0012.04 2C6.079 2 1.242 6.837 1.242 12.798c0 1.908.489 3.768 1.419 5.432L1 23l4.91-.1.285.285c1.597.915 3.42 1.397 5.28 1.397 5.961 0 10.798-4.837 10.798-10.798a10.718 10.718 0 00-3.141-7.618z" />
                              </svg>
                            </button>

                            <button onClick={() => sendEmailWithPDF(client)} title="Send Email" className="p-2 bg-slate-800 text-emerald-400 rounded-lg hover:bg-slate-700 transition-all"><Mail size={16} /></button>
                            {/* Proposal Button ko icon ke saath sundar banate hain */}
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setIsProposalOpen(true);
                              }}
                              title="Create Proposal"
                              className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                            >
                              {/* <PlusSquare size={16}/> Icon use karein text ki jagah, jagah bachegi */}
                              <Briefcase size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setShowAssetModal(true);
                              }}
                              className="p-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500 hover:text-white transition-all"
                              title="Project Assets"
                            >
                              <FolderOpen size={16} />
                            </button>
                            <button onClick={() => handleDelete(client._id)} title="Delete Client" className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="space-y-6"> */}
          <div className="bg-[#161b2c] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={22} /> Revenue Analytics
                </h3>
                <p className="text-xs text-slate-500">Visualizing your growth over the last 7 projects</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full"></span> Total Value
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={clients.slice(-7).map(c => {
                    const budget = Number(c.budget || 0);
                    const taxRate = Number(userProfile.taxRate || 0);
                    // Har client ke liye Total calculate karo (Base + Tax)
                    const totalWithTax = budget + (budget * taxRate / 100);

                    return {
                      name: c.name,
                      total: totalWithTax, // Graph ab total dikhayega
                      received: Number(c.received || 0)
                    };
                  })}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${userProfile.currency}${val}`} // Currency dynamic kar di
                  />
                  <Tooltip
                    // contentStyle={{ backgroundColor: '#161b2c', border: '1px solid #334155', borderRadius: '12px' }}
                    // itemStyle={{ color: '#fff', fontSize: '12px' }}
                    contentStyle={{ backgroundColor: '#0b0f1a', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value) => [`${userProfile.currency}${Number(value).toFixed(2)}`, "Total Value"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total" // Yahan "total" use kiya hai
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100] transition-all">
          <div className="bg-[#161b2c] p-6 md:p-10 rounded-[2rem] md:rounded-[2rem] w-full max-w-2xl border border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">

            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Profile Settings</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">Configure your business identity & billing details</p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 bg-[#0b0f1a] hover:bg-red-500/10 hover:text-red-500 text-slate-500 rounded-xl transition-all border border-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Business Identity</h3>
                </div>
              {/* Company Name */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">Company Name</label>
                <input
                  type="text"
                  value={userProfile.companyName}
                  className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl mt-2 text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  onChange={(e) => setUserProfile({ ...userProfile, companyName: e.target.value })}
                />
              </div>

              {/* Account Email */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">Account Email</label>
                <input
                  type="text"
                  value={userProfile.email}
                  disabled
                  className="w-full p-4 bg-[#0b0f1a]/50 border border-slate-800/50 rounded-2xl mt-2 text-slate-600 cursor-not-allowed italic font-medium"
                />
              </div>

              {/* Signature Name Field (Naya Add Kiya) */}
              <div className="md:col-span-2">
                <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider ml-1">Signature Name (On Invoice)</label>
                <input
                  type="text"
                  placeholder="e.g. Saloni Yadav"
                  value={userProfile.signatureName || ''}
                  className="w-full p-4 bg-[#0b0f1a] border border-indigo-900/20 rounded-2xl mt-2 text-white outline-none focus:border-indigo-500 transition-all font-serif italic text-lg shadow-inner"
                  onChange={(e) => setUserProfile({ ...userProfile, signatureName: e.target.value })}
                />
                <p className="text-[9px] text-slate-500 mt-2 ml-1 italic opacity-70">*This name will appear as a digital signature on generated PDFs.</p>
              </div>
              </div>


              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
                <div className="md:col-span-2">
                  <h3 className="text-[10px] font-black       text-emerald-500 uppercase tracking-[0.2em]  mb-4">Contact & Billing</h3>
                </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">Business Address</label>
                <textarea
                  rows="2"
                  value={userProfile.address}
                  className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl mt-2 text-white outline-none focus:border-indigo-500 transition-all resize-none"
                  onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                />
              </div>

              {/* Phone & UPI (Two Columns for better look) */}
              {/* <div className="grid grid-cols-1 gap-5"> */}
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">Phone Number</label>
                  <input
                    type="text"
                    value={userProfile.phone}
                    className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl mt-2 text-white outline-none focus:border-indigo-500 transition-all"
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider ml-1">UPI ID (For Payments)</label>
                  <input
                    type="text"
                    value={userProfile.upiId}
                    className="w-full p-4 bg-[#0b0f1a] border border-emerald-900/20 rounded-2xl mt-2 text-emerald-400 outline-none focus:border-emerald-500 transition-all font-mono"
                    onChange={(e) => setUserProfile({ ...userProfile, upiId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">Currency</label>
                
                <select
                  value={userProfile.currency}
                  onChange={(e) => setUserProfile({ ...userProfile, currency: e.target.value })}
                  className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl mt-2 text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="₹">INR (₹)</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                </select>
              </div>


              {/* Tax Rate Field */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-1">Tax Rate (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 18"
                  value={userProfile.taxRate || ''}
                  className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl mt-2 text-white outline-none focus:border-indigo-500 transition-all"
                  onChange={(e) => setUserProfile({ ...userProfile, taxRate: e.target.value })}
                />
              </div>
              </div>


              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-sm tracking-widest mt-4 shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.97] flex items-center justify-center gap-3"
              >
               <CheckCircle size={20} /> SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CLIENT MODAL */}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} user={user} />}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddClient} className="bg-[#161b2c] p-8 rounded-[2rem] w-full max-w-md border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-white">Create New Project</h2>
            <input type="text" placeholder="Client Name" className="w-full p-3 mb-4 bg-[#0b0f1a] border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-white" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

            <input
              type="email"
              placeholder="Client Email"
              className="w-full p-3 mb-4 bg-[#0b0f1a] border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-white" // Aapki styling ke hisaab se
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required />

            <input type="text" placeholder="Project Title" className="w-full p-3 mb-4 bg-[#0b0f1a] border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-white" onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })} required />
            <input type="number" placeholder="Total Budget" className="w-full p-3 mb-6 bg-[#0b0f1a] border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-white" onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required />
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">CONFIRM & START</button>
            <button type="button" onClick={() => setShowForm(false)} className="w-full mt-2 py-3 text-slate-500 font-medium">Cancel</button>
          </form>
        </div>
      )}


      {/* // Modal UI Component */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b2c] border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Add New Expense</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Vercel Pro Plan"
                  className="w-full bg-[#0b0f1a] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                  onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">Amount ({userProfile.currency})</label>
                <input
                  type="number"
                  className="w-full bg-[#0b0f1a] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                  onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-2">Category</label>
                <select
                  className="w-full bg-[#0b0f1a] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                  onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                >
                  <option value="Software">Software/Tools</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outsource">Outsource</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveExpense} // Ye function niche hai
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#161b2c] p-6 rounded-3xl border border-slate-800 shadow-xl mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="text-red-500" size={18} /> Expense History
          </h3>
          <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
            Total: {userProfile.currency}{expenses.reduce((s, e) => s + Number(e.amount), 0).toFixed(2)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-bold uppercase text-slate-500 border-b border-slate-800">
              <tr>
                <th className="pb-4">Title</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-500 text-sm italic">
                    No expenses recorded yet. Click "- Add Expense" to start.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp._id} className="group hover:bg-slate-800/10 transition-all">
                    <td className="py-4">
                      <div className="text-sm text-white font-medium">{exp.title}</div>
                      <div className="text-[10px] text-slate-500">{new Date(exp.date).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4">
                      <span className="text-[10px] px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-red-400 font-bold">
                      -{userProfile.currency}{Number(exp.amount).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Expense"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      <ProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        selectedClient={selectedClient}
      />
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b2c] border border-slate-800 p-8 rounded-3xl w-full max-w-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderOpen className="text-indigo-400" size={22} /> {selectedClient?.name}'s Assets
              </h2>
              <button onClick={() => setShowAssetModal(false)} className="text-slate-500 hover:text-white text-2xl">&times;</button>
            </div>

            {/* Input Section */}
            <div className="flex gap-2 mb-8">
              <input
                placeholder="Asset Name (e.g. Logo)"
                className="flex-1 bg-[#0b0f1a] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              />
              <input
                placeholder="URL (Drive/Figma Link)"
                className="flex-1 bg-[#0b0f1a] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none"
                value={newAsset.url}
                onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
              />
              <button onClick={addAsset} className="bg-indigo-600 p-2 rounded-xl text-white hover:bg-indigo-500">
                <Plus size={20} />
              </button>
            </div>

            {/* Assets List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {selectedClient?.assets?.length === 0 && <p className="text-slate-500 text-center text-sm">No assets yet.</p>}
              {selectedClient?.assets?.map((asset, index) => (
                <div key={index} className="flex justify-between items-center bg-[#0b0f1a] p-4 rounded-2xl border border-white/5 group hover:bg-black/40 transition-all">
                  {/* // <div key={index} className="group flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"> */}
                  <div>
                    <div className="text-sm font-bold text-white">{asset.name}</div>
                    <div className="text-xs text-indigo-400 truncate max-w-[200px] opacity-80">{asset.url}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Open Link Button */}
                    <a href={asset.url} target="_blank" rel="noreferrer"
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                      <ExternalLink size={16} />
                    </a>

                    {/* Delete Asset Button */}
                    <button
                      onClick={() => handleDeleteAsset(selectedClient._id, index)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





function StatCard({ label, val, icon, color }) {
  return (
    <div className="bg-[#161b2c] p-5 rounded-3xl border border-slate-800 shadow-lg">
      <div className={`p-2 w-fit rounded-lg bg-slate-800 mb-3 ${color}`}>{icon}</div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <h2 className="text-2xl font-black text-white">{val}</h2>
    </div>
  );
}

export default App;