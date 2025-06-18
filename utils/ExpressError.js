class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message); // always call super first
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;