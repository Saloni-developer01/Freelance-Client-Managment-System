import React from 'react';
import { X } from 'lucide-react';

const LegalModal = ({ setShowLegal }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[200] custom-scrollbar">
      <div className="bg-[#161b2c] border border-slate-800 p-8 rounded-[2rem] max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <button onClick={() => setShowLegal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
          <X size={24}/>
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">Terms, Privacy & Contact Info</h1>
        
        <div className="space-y-6 text-slate-300 text-sm">
          <section>
            <h2 className="text-lg font-semibold text-indigo-400 mb-2">1. Refund & Cancellation Policy</h2>
            <p>We offer a 7-day money-back guarantee. If you are not satisfied with our Pro services, please contact us via email for a full refund. Cancellations can be made anytime through the dashboard.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-indigo-400 mb-2">2. Privacy Policy</h2>
            <p>Your data, including client details and invoices, is securely stored. We do not share or sell your personal information to any third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-indigo-400 mb-2">3. Shipping & Delivery</h2>
            <p>This is a digital SaaS product. Services are activated immediately upon successful payment verification.</p>
          </section>

          <section className="bg-[#0b0f1a] p-4 rounded-xl border border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-2">Contact Us</h2>
            <p><strong>Business Name:</strong> FreelanceFlow</p>
            <p><strong>Proprietor:</strong> Saloni Yadav</p>
            <p><strong>Email:</strong> webhostingportfolio124@gmail.com</p>
            <p><strong>Address:</strong> [Prayagraj, Uttar Pradesh, India]</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;