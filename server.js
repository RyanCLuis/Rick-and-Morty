////////////////////////////////
// Import Dependencies      ////
////////////////////////////////
const express = require('express') 
require('dotenv').config() 
const path = require('path') 
const middleware = require('./utils/middleware')
///////////////////////
// Import Routers  ////
///////////////////////
const UserRouter = require('./controllers/userControllers')
const CharacterRouter = require('./controllers/characterControllers')
const EpisodeRouter = require('./controllers/episodeControllers')

//////////////////////////////////////////////////
// Create the app object + set up view engine ////
//////////////////////////////////////////////////
const app = express() 

// view engine - ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

///////////////////
// Middleware  ////
///////////////////
middleware(app)

///////////////
// Routes  ////
///////////////
app.get('/', (req, res) => {
    const { username, loggedIn, userID } = req.session
    res.render('home.ejs', { username, loggedIn, userID })
})

app.use('/users', UserRouter)
app.use('/character', CharacterRouter)
app.use('/episodes', EpisodeRouter)

// error page
app.get('/error', (req, res) => {
    const error = req.query.error || 'Im Pickle Rick! Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
    res.render('error.ejs', { error, userId, username, loggedIn })
})

////////////////////////
// Server Listener  ////
////////////////////////
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('Your server is running, better go catch it')
})

// End