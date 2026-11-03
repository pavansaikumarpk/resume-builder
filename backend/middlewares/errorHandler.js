const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    if (err.name === 'MulterError') statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    if (err.message === 'Only .pdf files are allowed!') statusCode = 415;

    const isProduction = process.env.NODE_ENV === 'production';
    const message = statusCode >= 500 && isProduction
        ? 'An unexpected server error occurred.'
        : (err.message || 'Request failed.');

    if (statusCode >= 500) console.error('Request failed:', err);
    res.status(statusCode).json({
        message,
        ...(isProduction ? {} : { stack: err.stack })
    });
};

module.exports = { notFound, errorHandler };
