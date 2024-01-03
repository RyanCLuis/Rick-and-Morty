///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const allEpisodesUrl = process.env.EPISODE_BASE_URL
const idEpSearchBaseUrl = process.env.id_EPISODE_BASE_URL

/////////////////////
// Create Router ////
/////////////////////
const router = express.Router()

////////////////////////////
// Routes & Controllers ////
////////////////////////////
// GET -> /episodes/all/:page
router.get('/all/:page', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const page = req.params.page
    axios(allEpisodesUrl + `?page=${page}`)
    .then(apiRes => {
        console.log('this came back from the api: \n', apiRes.data)
        const pageSize = 20
        res.render('episodes/index', { episodes: apiRes.data.results, username, userId, loggedIn, page, pageSize})
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

// GET -> /episodes/:id
router.get('/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const episodeId = req.params.id
    axios(`${idEpSearchBaseUrl}${episodeId}`)
    .then(apiRes => {
        console.log('This is apiRes.data: \n', apiRes.data)
        const episodeFound = apiRes.data
        // res.send(episodeFound)
        res.render('episodes/show', { episode: episodeFound, username, loggedIn, userId })
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