require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const DATA = require('./MovieData.json');
const cors = require('cors');
const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next){
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN;
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
       }
       next()
})

app.get('/movie', (req, res) => {
    res.status(200);
    let response = DATA;

if(req.query.genre){
  response = response.filter( movie =>
    movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
}
if(req.query.country){
    response = response.filter(movie =>
    movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
}
if(req.query.avg_vote){
  response =  response.filter((movie)=>
  Number(movie.avg_vote) >= Number(req.query.avg_vote)
  )
}
res.json(response)
})

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});