import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ setToken, setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        const url = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/register`;
        try {
            const res = await axios.post(url, { email, password });
            if(isLogin) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setToken(res.data.token);
                setUser(res.data.user);
            } else {
                alert("Registered! Now Login.");
                setIsLogin(true);
            }
        } // Auth.jsx ke handleSubmit mein catch block badal dein
 catch (err) { 
    console.error("Login Error Details:", err.response?.data);
    alert(err.response?.data || "Something went wrong. Check if server is running!"); 
}finally {
            // 3. Loading stop (chahe success ho ya error)
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
            <div className="bg-[#161b2c] p-10 rounded-[2.5rem] border border-slate-800 w-full max-w-md shadow-2xl">
                <h1 className="text-2xl font-black text-white mb-6 text-center">FREELANCE<span className="text-indigo-500">FLOW</span></h1>
                <h2 className="text-slate-400 mb-8 text-center">{isLogin ? 'Login to your dashboard' : 'Create SaaS Account'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white" onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-[#0b0f1a] border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-white" onChange={e => setPassword(e.target.value)} />
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20" disabled={isLoading}>{isLoading ? (
                            <>
                                {isLogin ? 'LOGGING IN...' : 'SIGNING UP...'}
                            </>
                        ) : (
                            isLogin ? 'LOGIN' : 'SIGN UP'
                        )}</button>
                    {/* {isLogin ? 'LOGIN' : 'SIGN UP'} */}
                </form>
                {/* onClick={() => setIsLogin(!isLogin)} */}
                <p onClick={() => !isLoading && setIsLogin(!isLogin)} className="text-center mt-6 text-sm text-indigo-400 cursor-pointer">
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
}