try {
    const c = await import('./controllers/newsletterController.js');
    console.log('Controller loaded');
} catch (e) {
    console.error('Controller failed', e);
}

try {
    const m = await import('./middleware/authMiddleware.js');
    console.log('Middleware loaded');
} catch (e) {
    console.error('Middleware failed', e);
}
