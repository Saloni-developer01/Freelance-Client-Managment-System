// const PricingModal = ({ setShowPricing, userId, token }) => {
//   return (
//     <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
//       <div className="bg-[#161b2c] border border-slate-800 p-8 rounded-[2.5rem] max-w-4xl w-full relative overflow-hidden">
//         <button onClick={() => setShowPricing(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X/></button>
        
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-black text-white mb-2">Scale Your <span className="text-indigo-500">Freelance Flow</span></h2>
//           <p className="text-slate-400">Choose the plan that fits your growth</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Free Plan */}
//           <div className="bg-[#0b0f1a] p-8 rounded-3xl border border-slate-800">
//             <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
//             <div className="text-4xl font-black text-white mb-6">₹0 <span className="text-sm text-slate-500 font-medium">/ forever</span></div>
//             <ul className="space-y-3 mb-8 text-sm">
//               <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Up to 3 Clients</li>
//               <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Basic Invoicing</li>
//               <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Revenue Tracking</li>
//             </ul>
//             <button disabled className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl font-bold cursor-not-allowed">Current Plan</button>
//           </div>

//           {/* Pro Plan */}
//           <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-600/10 p-8 rounded-3xl border-2 border-indigo-500 relative">
//             <div className="absolute -top-3 right-8 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Most Popular</div>
//             <h3 className="text-xl font-bold text-white mb-2">Pro Business</h3>
//             <div className="text-4xl font-black text-white mb-6">₹499 <span className="text-sm text-slate-500 font-medium">/ month</span></div>
//             <ul className="space-y-3 mb-8 text-sm">
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Unlimited Clients</li>
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Custom Invoices (Logo)</li>
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Advanced Analytics</li>
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Priority Support</li>
//             </ul>
//             <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all">UPGRADE NOW</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




























// import React from 'react';
// import axios from 'axios';
// import { X, CheckCircle } from 'lucide-react';

// const PricingModal = ({ setShowPricing, token }) => {
  
//   const handleUpgrade = async () => {
//     try {
//       // Stripe backend endpoint ko call kar rahe hain
//       const res = await axios.post('http://localhost:5000/api/create-subscription', {}, {
//         headers: { 'auth-token': token }
//       });
//       // User ko Stripe ke checkout page par bhej rahe hain
//       window.location.href = res.data.url; 
//     } catch (err) {
//       console.error(err);
//       alert("Payment failed to initialize. Check if server is running!");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
//       <div className="bg-[#161b2c] border border-slate-800 p-8 rounded-[2.5rem] max-w-4xl w-full relative overflow-hidden">
//         {/* Close Button */}
//         <button 
//           onClick={() => setShowPricing(false)} 
//           className="absolute top-6 right-6 text-slate-500 hover:text-white"
//         >
//           <X size={24}/>
//         </button>
        
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-black text-white mb-2">Scale Your <span className="text-indigo-500">Freelance Flow</span></h2>
//           <p className="text-slate-400">Choose the plan that fits your growth</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Free Plan */}
//           <div className="bg-[#0b0f1a] p-8 rounded-3xl border border-slate-800">
//             <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
//             <div className="text-4xl font-black text-white mb-6">₹0 <span className="text-sm text-slate-500 font-medium">/ forever</span></div>
//             <ul className="space-y-3 mb-8 text-sm">
//               <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Up to 3 Clients</li>
//               <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Basic Invoicing</li>
//               <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Revenue Tracking</li>
//             </ul>
//             <button disabled className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl font-bold cursor-not-allowed">Current Plan</button>
//           </div>

//           {/* Pro Plan */}
//           <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-600/10 p-8 rounded-3xl border-2 border-indigo-500 relative">
//             <div className="absolute -top-3 right-8 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Most Popular</div>
//             <h3 className="text-xl font-bold text-white mb-2">Pro Business</h3>
//             <div className="text-4xl font-black text-white mb-6">₹499 <span className="text-sm text-slate-500 font-medium">/ month</span></div>
//             <ul className="space-y-3 mb-8 text-sm">
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Unlimited Clients</li>
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Custom Invoices (Logo)</li>
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Advanced Analytics</li>
//               <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Priority Support</li>
//             </ul>
//             <button 
//               onClick={handleUpgrade}
//               className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
//             >
//               UPGRADE NOW
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingModal; // Yeh export sabse zaroori hai
































  import React, { useState } from 'react';
  import axios from 'axios';
  import { X, CheckCircle } from 'lucide-react';

  const PricingModal = ({ setShowPricing, token, user }) => {

      const [isPaying, setIsPaying] = useState(false);
    
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      const handlePayment = async () => {


        // new
        setIsPaying(true); // 1. Loading start
        const token = localStorage.getItem('token');
      //new
      if (!token) {
        console.log("Token not found in localStorage!");
          alert("Aap logged in nahi hain. Please login karein.");
          return;
      }

      //old
      try {
        // 1. Backend se Order create karwao
        const { data: order } = await axios.post(`${API_URL}/api/create-order`, {}, {
          headers: { 'auth-token': token }
        });

        const options = {
          // key: process.env.RAZORPAY_KEY_ID, // Yahan apni rzp_test_... wali key daalein
          // key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "FreelanceFlow Pro",
          description: "Upgrade to Unlimited Clients",
          order_id: order.id,
          handler: async function (response) {
            // 2. Payment successful hone par backend ko verify bhejo
            try {
              // const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
              const verifyRes = await axios.post(`${API_URL}/api/verify-payment`, {
              // const verifyRes = await axios.post('http://localhost:5000/api/verify-payment', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }, { headers: { 'auth-token': token } });

              if (verifyRes.data.success) {
                // alert("Congratulations! You are now a PRO member.");
                // const updatedUser = JSON.parse(localStorage.getItem('user'));
                // updatedUser.isPro = true;
                // localStorage.setItem('user', JSON.stringify(updatedUser));
                // window.location.reload(); oldest
                // window.location.href = "/success";

                // new
                // ✅ FIX: Updated user data ko local storage mein save karein
                          localStorage.setItem('user', JSON.stringify(verifyRes.data.user));
                          alert("Congratulations! You are now a PRO member.");
                          // window.location.href = "/success";
                          window.location.href = "/"

              }
            } catch (err) {
              // alert("Verification Failed!");
              //new
              console.error("Verification Error:", err.response?.data);
                  alert("Verification Failed: " + (err.response?.data?.message || "Unknown error"));
            }
          },
          // ... PricingModal.jsx ke andar ...



  //         handler: async function (response) {
  //   try {
  //     const verifyRes = await axios.post('http://localhost:5000/api/verify-payment', {
  //       razorpay_payment_id: response.razorpay_payment_id,
  //       razorpay_order_id: response.razorpay_order_id,
  //       razorpay_signature: response.razorpay_signature,
  //     }, { headers: { 'auth-token': token } });

  //     if (verifyRes.data.success) {
  //       // ✅ FIX: Backend se jo 'user' aaya hai use save karein
  //       // Ismein updated isPro aur subscriptionDate dono honge
  //       localStorage.setItem('user', JSON.stringify(verifyRes.data.user));
        
  //       // Page redirect karein
  //       window.location.href = "/success";
  //     }
  //   } catch (err) {
  //     alert("Verification Failed!");
  //   }
  // },
          prefill: {
            email: user?.email || "",
          },
          theme: { color: "#6366f1" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (err) {
        console.error("Order Error:", err);
        alert("Could not start payment. Is backend running?");
      }finally {
          setIsPaying(false); // 2. Loading stop
      }

    };



    const verifyPayment = async (response) => {
    try {
        const token = localStorage.getItem('token');
        const { data } = await axios.post(`${API_URL}/api/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
        }, { headers: { 'auth-token': token } });

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert("Congratulations! You are now a PRO member.");
            window.location.href = "/";
        }
    } catch (err) {
        console.error("Verification Error:", err);
        alert("Payment verification failed. Please contact support.");
    }
};

    const handleSubscription = async () => {
      setIsPaying(true)
      try {
          // const token = localStorage.getItem('auth-token');
          const token = localStorage.getItem('token');
          const API_URL = import.meta.env.VITE_API_BASE_URL;

          // 1. Backend se Subscription ID mangwao
          const { data } = await axios.post(`${API_URL}/api/create-subscription`, {}, {
              headers: { 'auth-token': token }
          });

          if (data.success) {
              const options = {
                  key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Aapki Razorpay Key ID
                  subscription_id: data.subscription_id, // Ye backend se aayi hai
                  name: "FreelanceFlow Pro",
                  description: "Monthly Pro Plan Subscription",
                  handler: async function (response) {
                      // Jab payment successfully ho jaye
                      // response mein razorpay_payment_id aur razorpay_subscription_id milega
                      verifyPayment(response);
                  },
                  prefill: {
                      name: user?.companyName || "Freelancer", 
                      email: user?.email || ""
                  },
                  theme: { color: "#6366f1" }
              };

              const rzp = new window.Razorpay(options);
              rzp.open();
          }
      } catch (error) {
          console.error("Payment failed:", error);
          alert("Payment gateway open nahi ho pa raha!");
      }finally {
          setIsPaying(false); // 2. Loading stop
      }
  };


    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
        <div className="bg-[#161b2c] border border-slate-800 p-8 rounded-[2.5rem] max-w-4xl w-full relative overflow-hidden">
          {/* Close Button */}
          <button onClick={() => setShowPricing(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
            <X size={24}/>
          </button>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Scale Your <span className="text-indigo-500">Freelance Flow</span></h2>
            <p className="text-slate-400">Choose the plan that fits your growth</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-[#0b0f1a] p-8 rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
              <div className="text-4xl font-black text-white mb-6">₹0 <span className="text-sm text-slate-500 font-medium">/ forever</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Up to 3 Clients</li>
                <li className="flex items-center gap-2 text-slate-400"><CheckCircle size={16} className="text-emerald-500"/> Basic Invoicing</li>
              </ul>
              <button disabled className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl font-bold cursor-not-allowed">Current Plan</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-600/10 p-8 rounded-3xl border-2 border-indigo-500 relative">
              <div className="absolute -top-3 right-8 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Business</h3>
              <div className="text-4xl font-black text-white mb-6">₹199 <span className="text-sm text-slate-500 font-medium">/ month</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Unlimited Clients</li>
                <li className="flex items-center gap-2 text-white"><CheckCircle size={16} className="text-indigo-500"/> Advanced Analytics</li>
              </ul>
              <button onClick={handleSubscription} disabled={isPaying} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500">
                {isPaying ? "Processing..." : "UPGRADE NOW"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default PricingModal;