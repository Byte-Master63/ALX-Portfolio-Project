const app = require('./app');
const { initializeStorage } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initializeStorage();
        
        app.listen(PORT, () => {
            console.log(`🚀 Money Mate server running on port ${PORT}`);
            console.log(`📊 Open your browser to http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
