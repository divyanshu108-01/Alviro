import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeToNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if already exists
        const existing = await NewsletterSubscriber.findOne({ email });

        if (existing) {
            if (!existing.isActive) {
                // Reactivate if previously unsubscribed
                existing.isActive = true;
                await existing.save();
                return res.status(200).json({ message: 'Welcome back! You have been resubscribed.' });
            }
            return res.status(400).json({ message: 'You are already subscribed to our newsletter.' });
        }

        await NewsletterSubscriber.create({ email });

        res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
        console.error('Newsletter Signup Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
