import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import InteractiveMenu from '../components/InteractiveMenu';
import { BadgeCheck, ChefHat, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import FoodGallery from '../components/FoodGallery';
import Testimonials from '../components/Testimonials'; // Kept if needed, or remove if not in design.
import Newsletter from '../components/Newsletter';
import About from '../components/About';
import Team from '../components/Team';
import ReservationSection from '../components/ReservationSection';
import axios from 'axios';
import { API_URL } from '../config';

const Home = () => {
    const [featuredDishes, setFeaturedDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDishId, setExpandedDishId] = useState(null);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/menu`);
                // Get 6 random dishes for grid
                const shuffled = res.data.sort(() => 0.5 - Math.random());
                setFeaturedDishes(shuffled.slice(0, 6)); // Foody design has 6 or 8
            } catch (err) {
                console.error("Error fetching featured dishes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatures();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-cream">
            <Hero />

            {/* New Interactive Chef's Table Section */}
            <InteractiveMenu />

            <About />

            {/* Popular Dishes Section - Creative Showcase */}
            <section id="popular" className="py-32 bg-white relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-cream/50 skew-y-3 transform origin-top-left -z-0"></div>
                <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24">
                        <div className="md:max-w-2xl">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-primary font-sans font-bold tracking-[0.3em] uppercase text-xs block mb-4"
                            >
                                Fresh From Kitchen
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-display font-medium text-secondary mb-6 leading-tight italic"
                            >
                                Crowd <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600 font-bold">Favorites</span>
                            </motion.h2>
                            <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-transparent mb-6"></div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="hidden md:block max-w-sm text-right text-gray-500 text-lg font-normal leading-relaxed"
                        >
                            <p>Hand-picked daily specials that define our culinary identity. Tasted and loved by thousands for their authentic taste.</p>
                        </motion.div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {featuredDishes.length > 0 ? featuredDishes.map((dish, idx) => (
                                <motion.div
                                    key={dish._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                                    viewport={{ once: true }}
                                    onClick={() => setExpandedDishId(expandedDishId === dish._id ? null : dish._id)}
                                    className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 ease-out border border-white/10 hover:border-primary/30 ${expandedDishId === dish._id ? 'h-[600px] scale-[1.02]' : 'h-[500px] hover:-translate-y-2'}`}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay - Rich & Deep but Clearer Image */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${expandedDishId === dish._id ? 'opacity-90' : 'opacity-60 group-hover:opacity-80'}`}></div>

                                    {/* Premium Category Badge */}
                                    <div className="absolute top-6 left-6 z-20">
                                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] shadow-lg group-hover:bg-primary group-hover:text-secondary group-hover:border-primary transition-all duration-500">
                                            {dish.category}
                                        </span>
                                    </div>

                                    {/* Luxury Price Tag */}
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                                            <span className="font-header text-xl text-primary font-bold italic">${dish.price || '24'}</span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className={`absolute bottom-0 left-0 w-full p-8 z-20 transition-all duration-700 ${expandedDishId === dish._id ? 'translate-y-0' : 'translate-y-2 group-hover:translate-y-0'}`}>
                                        <h3 className="text-4xl font-header font-bold text-white mb-3 leading-none tracking-wide">
                                            {dish.name}
                                        </h3>

                                        <div className={`w-12 h-0.5 bg-primary mb-4 transition-all duration-500 ${expandedDishId === dish._id ? 'w-24' : 'group-hover:w-20'}`}></div>

                                        {expandedDishId === dish._id ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4"
                                            >
                                                <p className="text-gray-300 text-base leading-relaxed mb-6 font-semibold italic border-l-2 border-primary/50 pl-4">
                                                    "{dish.specialty || "A signature creation featuring locally sourced ingredients and a balance of traditional flavors."}"
                                                </p>
                                                <p className="text-primary/80 text-xs uppercase tracking-widest mb-2 font-bold">Perfect Pairing</p>
                                                <p className="text-white/80 text-sm font-normal">
                                                    Our house Sommelier recommends a vintage Pinot Noir.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-6 opacity-80 group-hover:text-gray-300 transition-colors duration-300">
                                                {dish.description || 'A delightful culinary masterpiece featuring premium ingredients and authentic flavors.'}
                                                <span className="block mt-2 text-primary text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                    Read More
                                                </span>
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-6 border-t border-white/10 pt-6">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <ChefHat key={i} size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                                                ))}
                                            </div>
                                            <button className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 ${expandedDishId === dish._id ? 'bg-primary text-secondary rotate-180' : 'bg-transparent text-white hover:bg-white hover:text-secondary hover:border-white'}`}>
                                                {expandedDishId === dish._id ? <X size={20} /> : <span className="text-2xl font-normal mb-1">+</span>}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-3 text-center py-20">
                                    <p className="text-gray-400">Our chefs are curating the menu...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="text-center mt-20">
                        <Link to="/menu" className="inline-flex items-center gap-3 px-10 py-4 bg-secondary text-white font-header font-bold uppercase tracking-widest rounded-full hover:bg-primary transition-colors shadow-xl hover:-translate-y-1">
                            View Full Menu
                        </Link>
                    </div>
                </div>
            </section>

            <Team />

            <ReservationSection />

            {/* Retaining Footer at the bottom of App.jsx structure usually, but here checking if it's inside layout */}
        </div >
    );
};

export default Home;
