///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const {Character} = require('../models/character')
const allCharactersUrl = process.env.CHARACTER_API_URL
const idSearchBaseUrl = process.env.id_CHARACTER_BASE_URL
const allEpisodesUrl = process.env.EPISODE_BASE_URL
const idEpSearchBaseUrl = process.env.id_EPISODE_BASE_URL

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
    axios(allCharactersUrl + `?page=${page}`)
    .then(apiRes => {
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
        res.render('characters/favorite', { characters: userCharacters, username, loggedIn, userId})
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

// UPDATE -> /character/update/:id
router.put('/update/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const characterId = req.params.id
    const theCharacter = req.body
    delete theCharacter.owner
    theCharacter.favorite = !!theCharacter.favorite
    theCharacter.owner = userId
    Character.findById(characterId)
    .then(foundCharacter => {
        if (foundCharacter.owner == userId) {
            return foundCharacter.updateOne(theCharacter)
        } else {
            res.redirect(`/error?error=YOU%20CANT%20UPDATE%20THIS%20CHARACTER!`)
        }
    })
    .then(returnedCharacter => {
        res.redirect(`/character/favorites/${characterId}`)
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

// DELETE -> /character/delete/:id
router.delete('/delete/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const characterId = req.params.id
    Character.findById(characterId)
        .then(character => {
            if (character.owner == userId) {
                return character.deleteOne()
            } else {
                res.redirect(`/error?error=YOU%20CANT%20DELETE%20THIS%20CHARACTER!`)
            }
        })
        .then(deletedCharacter => {
            res.redirect('/character/favorites')
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> /favorites/:id
router.get('/favorites/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    Character.findById(req.params.id)
        .then(theCharacter => {
            res.render('characters/favoriteDetail', { character: theCharacter, username, loggedIn, userId })
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
    episodeRes = []
    axios(`${idSearchBaseUrl}${characterId}`)
    .then(apiRes => {
        const characterFound = apiRes.data 
        let allEpCharacterIn = characterFound.episode
        const episodes = characterFound.episode.map(ep => (ep.substr(-2,2).replace('/', '')))
        res.render('characters/show', { character: characterFound, episodes, username, loggedIn, userId })
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