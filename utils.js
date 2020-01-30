const uuidv4 = require('uuid/v4');

const status_model = {
    method: '',
    action: '',
    errors: [],
    warnings: [],
    data: [],
    message: ""
};

function initStatus(req, message="") {
    let status = JSON.parse(JSON.stringify(status_model));
    status.method = req.method;
    status.action = req.originalUrl;
    status.message = message;

    console.log(`${req.method} ${req.originalUrl}`);

    return status;
}

function generateUuid(req) {
    // return uuidv5(req.protocol + '://' + req.get('host') + req.originalUrl, uuidv5.URL);
    return uuidv4();
}

module.exports = {initStatus, generateUuid};