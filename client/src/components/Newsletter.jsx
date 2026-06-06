import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, type: 'idle', message: '' }); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, type: 'loading', message: '' });

        try {
            await axios.post(`${API_URL}/api/newsletter/subscribe`, { email });
            setStatus({ loading: false, type: 'success', message: 'Welcome to the inner circle! Check your inbox.' });
            setEmail('');

            // Reset after 5 seconds to allow another sub if needed
            setTimeout(() => setStatus({ loading: false, type: 'idle', message: '' }), 5000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setStatus({ loading: false, type: 'error', message: errorMsg });
        }
    };

    return (
        <section className="py-20 bg-primary relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-black blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Unlock Exclusive Tastes</h2>
                <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
                    Join our privileged guest list to receive private invitations to tastings, chef's table events, and seasonal menu reveals.
                </p>

                {status.type === 'success' ? (
                    <div className="flex items-center justify-center gap-2 text-white bg-white/20 backdrop-blur-md p-4 rounded-xl animate-fade-in">
                        <CheckCircle className="w-6 h-6 text-green-300" />
                        <span className="font-bold">{status.message}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow px-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all font-medium disabled:opacity-70"
                                disabled={status.loading}
                            />
                            <button
                                type="submit"
                                disabled={status.loading}
                                className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 group whitespace-nowrap"
                            >
                                {status.loading ? 'Joining...' : 'Subscribe'}
                                {!status.loading && <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                        {status.type === 'error' && (
                            <div className="flex items-center justify-center gap-2 text-red-200 text-sm animate-fade-in mt-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{status.message}</span>
                            </div>
                        )}
                    </form>
                )}

                <p className="mt-6 text-xs text-orange-200/60 uppercase tracking-widest">
                    No spam. Only culinary excellence.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
