///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const allCharactersUrl = process.env.CHARACTER_API_URL
const idSearchBaseUrl = process.env.id_CHARACTER_BASE_URL
const allEpisodesUrl = process.env.EPISODE_BASE_URL
const idEpSearchBaseUrl = process.env.id_CHARACTER_BASE_URL

/////////////////////
// Create Router ////
/////////////////////
const router = express.Router()

////////////////////////////
// Routes & Controllers ////
////////////////////////////
// GET -> /character
router.get('/:page', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const page = req.params.page
    console.log('this is the req.params.page: ', allCharactersUrl + `?page=${page}`)
    axios(allCharactersUrl + `?page=${page}`)
    .then(apiRes => {
        console.log('this came back from the api: \n', apiRes.data)
        const pageSize = 20
        res.render('characters/index', { characters: apiRes.data.results, username, userId, loggedIn, page, pageSize})
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

// GET -> /characters/:id

//////////////
// Export ////
//////////////
module.exports = router