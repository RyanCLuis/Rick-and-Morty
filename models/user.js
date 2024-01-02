////////////////////////////////
// Schema and Dependencies  ////
////////////////////////////////
const mongoose = require('../utils/connection')
const { Schema, model } = mongoose

//////////////////////////
// Schema Definition  ////
//////////////////////////
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})
///////////////////
// User model  ////
///////////////////
const User = model('User', userSchema)

///////////////
// Export  ////
///////////////
module.exports = User