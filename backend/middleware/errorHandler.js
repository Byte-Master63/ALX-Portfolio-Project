function errorHandler(err, req, res, next) {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
}

function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
