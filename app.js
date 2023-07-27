const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Journey = require('./models/journey')

// connect to the database and create a new database
mongoose.connect('mongodb://localhost:27017/voyage_vibe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then( () =>{
  console.log("MongoDB Connected!")
})
.catch( err =>{
  console.log(err)
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.send("Hello World")
})

app.get('/journeys', async (req, res) => {
  const journeys = await Journey.find({})
  res.render('journeys/index', { journeys })
})

app.listen(3000, () => {
  console.log("listen to port 3000")
})