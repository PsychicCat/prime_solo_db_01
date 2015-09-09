var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model("message", MessageSchema);