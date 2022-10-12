const { logger } = require('../logger/logger')

process.on("uncaughtException",(error) => {
    logger.error(error.message, error);
});

process.on("unhandledRejection",(error) => {
    logger.error(error.message, error);
});

function handleErrors(error, req, res, next) {
    try {
        if (res.statusCode === 200) {
            res.status(500);
        }
        
        logger.error(error.message, error);
        res.json({ error: error.message || "Something Went Wrong !!" });
    } catch (error) {
        next();
    }
}

module.exports = handleErrors;