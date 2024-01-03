///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const Character = require('../models/character')
const allCharactersUrl = process.env.CHARACTER_API_URL
const idSearchBaseUrl = process.env.id_CHARACTER_BASE_URL
const allEpisodesUrl = process.env.EPISODE_BASE_URL
const idEpSearchBaseUrl = process.env.id_EPISODE_BASE_UR
/////////////////////
// Create Router ////
/////////////////////
const router = express.Router()

////////////////////////////
// Routes & Controllers ////
////////////////////////////
// GET -> /character/all/:page
router.get('/all/:page', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const page = req.params.page
    console.log('this is the req.params.page: ', allCharactersUrl + `?page=${page}`)
    axios(allCharactersUrl + `?page=${page}`)
    .then(apiRes => {
        // console.log('this came back from the api: \n', apiRes.data)
        const pageSize = 20
        res.render('characters/index', { characters: apiRes.data.results, username, userId, loggedIn, page, pageSize})
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})


// POST -> /character/add
router.post('/add', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const theCharacter = req.body
    const characterId = req.params.id
    theCharacter.owner = userId
    theCharacter.favorite = !!theCharacter.favorite
    // res.send(theCharacter)
    Character.create(theCharacter)
    .then(newCharacter => {
        res.redirect(`/character/favorites`)
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

// GET -. /character/favoirtes
router.get('/favorites', (req, res) => {
    const { username, loggedIn, userId } = req.session
    Character.find({ owner: userId})
        .then(userCharacters => {
            // res.send(userCharacters)
            res.render('characters/favorite', { characters: userCharacters, username, loggedIn, userId})
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> /character/:id
router.get('/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const characterId = req.params.id
    axios(`${idSearchBaseUrl}${characterId}`)
    .then(apiRes => {
        // console.log('This is apiRes.data: \n', apiRes.data)
        const characterFound = apiRes.data
        // res.send(characterFound)
        res.render('characters/show', { character: characterFound, username, loggedIn, userId })
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