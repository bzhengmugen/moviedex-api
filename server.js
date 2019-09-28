require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies-data-small.json')
const cors = require('cors')
const helmet = require('helmet');


const app = express();

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next){
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: "unauthorized request"})
    }

    next()
});

function handleGetMovie(req, res){
    let response = MOVIES;

    if(req.query.genre){
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    
    if(req.query.country){
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if(req.query.avg_vote){
        debugger
        response = response.filter(movie =>
            movie.avg_vote>=(Number(req.query.avg_vote))
        )
    }
    res.json(response)
}

app.get('/movie', handleGetMovie);
 
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
});