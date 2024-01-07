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
        const pageSize = 20
        res.render('episodes/index', { episodes: apiRes.data.results, username, userId, loggedIn, page, pageSize})
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

// GET -> /episodes/:id
router.get('/:id', async (req, res) => {
    try{
    const { username, loggedIn, userId } = req.session
    const episodeId = req.params.id
    const episodeAxios = await axios.get(`${idEpSearchBaseUrl}${episodeId}`)
    const episode = episodeAxios.data
    const characters = await Promise.all(episode.characters.map((ch) => (
        axios(ch))
        .then(res => {
        return res.data
        })))
    res.render('episodes/show', { episode, characters, username, loggedIn, userId })
        } catch(err) {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    }
})


//////////////
// Export ////
//////////////
module.exports = router