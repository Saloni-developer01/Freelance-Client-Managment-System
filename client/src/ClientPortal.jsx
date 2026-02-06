import React, { useEffect, useState } from 'react';

const ClientPortal = () => {
    const [myProject, setMyProject] = useState(null);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        // Fetch client-specific data using token
        fetch(`${API_URL}/api/my-project`, {
            headers: { 'auth-token': localStorage.getItem('client-token') }
        })
        .then(res => res.json())
        .then(data => setMyProject(data));
    }, []);

    if (!myProject) return <div className="text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0a0f1c] p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Welcome, {myProject.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#161b2c] p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-400">Project Status</p>
                    <h2 className="text-2xl font-bold text-indigo-400">{myProject.status}</h2>
                </div>
                {/* Add more cards for Payment, Progress etc. */}
            </div>

            <div className="mt-10 bg-[#161b2c] p-6 rounded-2xl border border-slate-800">
                <h3 className="text-xl mb-4">Project Feedback</h3>
                <textarea className="w-full bg-gray-800 p-3 rounded-lg" placeholder="Share your feedback..."></textarea>
                <button className="bg-indigo-600 px-6 py-2 rounded-lg mt-3">Submit Feedback</button>
            </div>
        </div>
    );
};

export default ClientPortal;