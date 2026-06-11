import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Ciao! I'm your Alviro Concierge. I can help you book a table or recommend a dish.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [reservationStep, setReservationStep] = useState(0); // 0: Idle, 1: Guests, 2: Date, 3: Time, 4: Name, 5: Contact, 6: Confirm
    const [reservationData, setReservationData] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/menu`);
                setMenuItems(response.data);
            } catch (error) {
                console.error("Error fetching menu for chatbot:", error);
            }
        };
        fetchMenu();
    }, []);

    const handleSend = async (e, forcedInput = null) => {
        if (e && e.preventDefault) e.preventDefault();
        const msgText = forcedInput || input;
        if (!msgText.trim()) return;

        const userMsg = { id: Date.now(), text: msgText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        setTimeout(async () => {
            let botResponse = "";
            let nextStep = reservationStep;
            const lowerInput = msgText.toLowerCase();

            // --- GLOBAL INTERRUPTS (Priority over Reservation Flow) ---
            if (lowerInput.includes('special') || lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
                if (menuItems.length > 0) {
                    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
                    const specials = shuffled.slice(0, 2);
                    botResponse = "Here are today's **Chef's Specials**:\n\n" +
                        specials.map(item => `🍝 **${item.name}** - ${item.description} ($${item.price})`).join('\n\n');
                } else {
                    botResponse = "Our chef recommends the **Truffle Risotto** and the **Osso Buco**. (Fetching menu...)";
                }
                nextStep = 0;
            }
            else if (lowerInput.includes('surprise') || lowerInput.includes('random')) {
                if (menuItems.length > 0) {
                    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
                    botResponse = `🎲 Feeling adventurous? You must try the **${randomItem.name}**!\n\n"${randomItem.description}"`;
                } else {
                    botResponse = "How about our signature **Lobster Ravioli**? It's a surprise favorite!";
                }
                nextStep = 0;
            }
            else if (lowerInput.includes('menu')) {
                botResponse = "You can explore our full menu by clicking the 'Menu' link in the navigation bar.";
                nextStep = 0;
            }
            else if (lowerInput.includes('book') || lowerInput.includes('reserve') || lowerInput.includes('table')) {
                botResponse = "I'd be delighted to secure a table for you. How many guests will be joining?";
                nextStep = 1; // Direct jump to reservation start
            }
            else if (lowerInput.includes('cancel') || lowerInput.includes('stop')) {
                botResponse = "Reservation process cancelled. How else can I help you today?";
                nextStep = 0;
            }

            // --- RESERVATION FLOW ---
            else if (reservationStep > 0) {
                switch (reservationStep) {
                    case 1: // Guests
                        setReservationData(prev => ({ ...prev, guests: msgText }));
                        botResponse = "Perfect. What date would you like to visit? (e.g., Tomorrow, 25th Dec)";
                        nextStep = 2;
                        break;
                    case 2: // Date
                        setReservationData(prev => ({ ...prev, date: msgText }));
                        botResponse = "Noted. What time do you prefer? (e.g., 7:00 PM)";
                        nextStep = 3;
                        break;
                    case 3: // Time
                        setReservationData(prev => ({ ...prev, time: msgText }));
                        botResponse = "Almost done. May I have your full name?";
                        nextStep = 4;
                        break;
                    case 4: // Name
                        setReservationData(prev => ({ ...prev, name: msgText }));
                        botResponse = "Thank you. Finally, please provide an email or phone number.";
                        nextStep = 5;
                        break;
                    case 5: // Contact & Submit
                        const finalData = { ...reservationData, email: msgText, phone: msgText };
                        setReservationData(finalData);
                        botResponse = "Processing your request...";
                        setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
                        try {
                            const payload = {
                                name: finalData.name,
                                email: finalData.email.includes('@') ? finalData.email : 'guest@example.com',
                                phone: !finalData.email.includes('@') ? finalData.email : '000-000-0000',
                                date: new Date().toISOString(),
                                time: finalData.time,
                                guests: parseInt(finalData.guests) || 2,
                                specialRequest: "Booked via Chatbot"
                            };
                            await axios.post(`${API_URL}/api/reservations`, payload);
                            botResponse = `Fantastico! Your table for ${finalData.guests} on ${finalData.date} at ${finalData.time} is confirmed.`;
                            nextStep = 0;
                        } catch (err) {
                            console.error(err);
                            botResponse = "Couldn't connect to reservation system. Please call us.";
                            nextStep = 0;
                        }
                        break;
                    default: break;
                }
            }
            // --- IDLE (Fallback) ---
            else {
                if (['pasta', 'dessert', 'steak', 'salad', 'starter', 'wine', 'drink'].some(cat => lowerInput.includes(cat))) {
                    const relevantItems = menuItems.filter(item =>
                        item.category.toLowerCase().includes(lowerInput) ||
                        item.description.toLowerCase().includes(lowerInput) ||
                        item.name.toLowerCase().includes(lowerInput)
                    ).slice(0, 3);
                    if (relevantItems.length > 0) {
                        botResponse = `Excellent choice. Top picks:\n\n` +
                            relevantItems.map(item => `🔹 **${item.name}** ($${item.price})`).join('\n');
                    } else {
                        botResponse = `We have a wonderful selection. Please check our full menu page.`;
                    }
                }
                else {
                    botResponse = "I can help with reservations, specials, or recommendations. Tips: Click 'Specials' or 'Book a Table'.";
                }
            }

            setReservationStep(nextStep);
            if (nextStep !== 200) {
                setMessages(prev => [...prev, { id: Date.now() + 2, text: botResponse, sender: 'bot' }]);
            }
        }, 800);
    };

    return (

        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[90] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all 
                ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'bg-gradient-to-r from-primary to-amber-600 text-white shadow-primary/30'}`}
            >
                <MessageSquare />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 z-[100] md:w-96 h-[80vh] md:h-auto md:max-h-[600px] 
                        bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col 
                        font-sans"
                    >
                        {/* Header with Gold Gradient */}
                        <div className="bg-gradient-to-r from-secondary/90 via-black/50 to-secondary/90 border-b border-white/5 p-4 flex justify-between items-center text-white backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-primary" />
                                <h3 className="font-header font-bold tracking-widest text-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-200 to-primary">Concierge</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors text-gray-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area with Glassmorphism */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/20 scrollbar-hide">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm 
                                        ${msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-primary/90 to-amber-700/90 text-white rounded-br-none border border-white/10'
                                                : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className="mb-1 last:mb-0">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions (Wrapped Layout) */}
                        <div className="px-4 py-2 flex flex-wrap justify-center gap-2">
                            {['Book a Table', 'Specials', 'Surprise Me', 'View Menu'].map(action => (
                                <button
                                    key={action}
                                    onClick={(e) => {
                                        setInput(action);
                                        handleSend({ preventDefault: () => { } }, action);
                                    }}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-full text-[10px] uppercase tracking-wider text-gray-300 hover:text-primary transition-all duration-300 backdrop-blur-md"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>

                        {/* Floating Input Area (Padded right) */}
                        <div className="p-4 bg-transparent mb-0 md:mb-0 pb-4 md:pb-4 safe-area-bottom">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={reservationStep > 0 ? "Type your answer..." : "Ask the Concierge..."}
                                    className="w-full px-5 py-3 pr-12 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all backdrop-blur-md shadow-inner"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 p-2 bg-gradient-to-r from-primary to-amber-600 rounded-full text-white shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
