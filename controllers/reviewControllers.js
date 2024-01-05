///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const Character = require('../models/character')


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
    const character_Id = req.params
    const review = req.body
    review.owner = userId
    console.log('this is character id: \n', character_Id)
    // 
    Character.findById(req.params.id)
    // console.log('this is review: \n', review)
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



//////////////
// Export ////
//////////////
module.exports = router