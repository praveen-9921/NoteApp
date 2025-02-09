const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String
});

const UsersModel = mongoose.model('users', UsersSchema);

module.exports = UsersModel;
