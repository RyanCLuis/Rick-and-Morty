///////////////////////////////////
// Our Schema and dependencies ////
///////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose


/////////////////////////
// Schema definition ////
/////////////////////////
const reviewSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

const characterSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    species: { type: String, required: true },
    gender: { type: String, required: true },
    origin: { type: String, required: true },
    favorite: { type: Boolean, required: true },
    image: { type: String, require: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
})

/////////////////////////
// create user model ////
/////////////////////////
const Character = model('Character', characterSchema)
const Review = model('Review', reviewSchema)

/////////////////////////
// export user model ////
/////////////////////////
module.exports = {Character, Review}