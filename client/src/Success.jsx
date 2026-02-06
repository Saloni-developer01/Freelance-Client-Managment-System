// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { CheckCircle } from 'lucide-react';

// export default function Success() {
//     useEffect(() => {
//         const verify = async () => {
//             const params = new URLSearchParams(window.location.search);
//             const sessionId = params.get('session_id');
//             if (sessionId) {
//                 try {
//                     const token = localStorage.getItem('token');
//                     await axios.post('http://localhost:5000/api/verify-payment', { sessionId }, {
//                         headers: { 'auth-token': token }
//                     });
//                     // User data refresh karein taaki "GO PRO" button gayab ho jaye
//                     const user = JSON.parse(localStorage.getItem('user'));
//                     user.isPro = true;
//                     localStorage.setItem('user', JSON.stringify(user));
                    
//                     setTimeout(() => { window.location.href = '/'; }, 3000);
//                 } catch (e) { console.error("Verification failed"); }
//             }
//         };
//         verify();
//     }, []);

//     // return (
//     //     <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center text-white">
//     //         <CheckCircle size={80} className="text-emerald-500 mb-6 animate-bounce" />
//     //         <h1 className="text-4xl font-black mb-2">PAYMENT SUCCESSFUL!</h1>
//     //         <p className="text-slate-400">You are now a PRO member. Redirecting to dashboard...</p>
//     //     </div>
//     // );



//      return (
//     <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-[#1e293b] border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
//         <div className="flex justify-center mb-6">
//           <div className="bg-green-500/20 p-4 rounded-full">
//             <CheckCircle className="w-16 h-16 text-green-500" />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
//         <p className="text-slate-400 mb-8">
//           Welcome to the PRO family. Your unlimited access is now active.
//         </p>
//         <button
//           onClick={() => navigate('/')}
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// }











// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CheckCircle } from 'lucide-react'; // Agar icons use kar rahe hain

// const Success = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-[#1e293b] border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
//         <div className="flex justify-center mb-6">
//           <div className="bg-green-500/20 p-4 rounded-full">
//             <CheckCircle className="w-16 h-16 text-green-500" />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
//         <p className="text-slate-400 mb-8">
//           Welcome to the PRO family. Your unlimited access is now active.
//         </p>
//         <button
//           onClick={() => navigate('/')}
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Success;



















import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    useEffect(() => {
        // 3 second baad automatically home par bhej dega
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#1e293b] border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-500/20 p-4 rounded-full">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                <p className="text-slate-400 mb-8">
                    Welcome to the PRO family. Your unlimited access is now active.
                    <br /> <span className="text-xs text-indigo-400">Redirecting in 5 seconds...</span>
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                    Go to Dashboard Now
                </button>
            </div>
        </div>
    );
}