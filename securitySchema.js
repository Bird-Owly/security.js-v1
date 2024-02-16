const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
    robloxUsername: String,
    memberID: String,
    status: String,
    mainAccountHolder: String,
    securityAccountType: String,
    securityNotification: String,
});

const SecurityModel = mongoose.model('SecurityModel', securitySchema);

module.exports = SecurityModel;