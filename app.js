const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Destination = require('./models/destinations')

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
app.set('view', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/newdestination', async (req, res) => {
  const destination = new Destination({
    title: 'new destination',
   
  })
  await destination.save();
})

app.listen(3000, () => {
  console.log("listen to port 3000")
})