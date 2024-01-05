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
router.get('/:id', async (req, res) => {
    try{
    const { username, loggedIn, userId } = req.session
    const episodeId = req.params.id
    const episode = await axios.get(`${idEpSearchBaseUrl}${episodeId}`)
    console.log('This is apiRes.data: \n', episode.data)
    console.log('This is episode: \n', episode)
    // const episodeFound = apiRes.data
    // const characters = episodeFound.characters.map(ch => (ch.substr(-3,3).replace('/', '').replace('r', '')))
    const characters = await Promise.all(episode.data.characters.map((ch) => (
        axios(ch))
        .then(res => {
            // console.log(res.data)
        return res.data
        })))
    console.log(characters)
    // res.send(episodeFound)
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