rquire('dotenv').config();
const app = require('./app');
const { initializeStorage } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initializeStorage();
        
        app.listen(PORT, () => {
            console.log(`🚀 Money Mate server running on port ${PORT}`);
            console.log(`📊 Open your browser to http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Closing server gracefully...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('\nSIGINT received. Closing server gracefully...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
         console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

startServer();
