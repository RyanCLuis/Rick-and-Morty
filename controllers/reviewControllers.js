///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const {Character, Review } = require('../models/character')



/////////////////////
// Create Router ////
/////////////////////
const router = express.Router()

////////////////////////////
// Routes & Controllers ////
////////////////////////////

// POST -> /character/:id/reviews
router.post('/:id/reviews', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const review = req.body
    review.owner = userId
    Character.findById(req.params.id)
    .then(char => { 
        char.reviews.push(req.body)
        return char.save()
    })
    .then(savedChar => {
        res.redirect(`/character/favorites/${req.params.id}`)
    })
    .catch(err => {
        console.log('error') 
        res.redirect(`/error?error=${err}`)
    })
})

router.delete('/:reviewId/:charId/reviews', (req, res) => {
    const { username, loggedIn, userId } = req.session
    Character.findById(req.params.charId)
        .then(char => {
            let review = char.reviews.find(review => review._id == req.params.reviewId)
            if (review && review.owner == userId) {
                return Character.updateOne({ _id: req.params.charId }, {
                    $pull: {
                        reviews: { _id: req.params.reviewId },
                    },
                })
            } else {
                res.redirect(`/error?error=YOU%20CANT%20DELETE%20THIS%20REVIEW!`)
            }
        })
        .then(() => {
            res.redirect(`/character/favorites/${req.params.charId}`)
        })
        .catch(err => {
            console.log('error', err);
            res.redirect(`/error?error=${err}`);
        })
})

//////////////
// Export ////
//////////////
module.exports = router