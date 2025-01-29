class Logger {
    static info(service, method, message) {
        console.log(`[${service}][${method}] ${message}`);
    }

    static error(service, method, error, context = {}) {
        console.error(`[${service}][${method}] ERROR:`, {
            message: error.message,
            stack: error.stack,
            context
        });
    }

    static debug(service, method, data) {
        console.debug(`[${service}][${method}] DEBUG:`, data);
    }

    static warn(service, method, message) {
        console.warn(`[${service}][${method}] WARNING: ${message}`);
    }
}

module.exports = Logger;