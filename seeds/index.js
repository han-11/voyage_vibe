const mongoose = require('mongoose');
const nzcities = require('./nzcities');
const {places, location_descriptors} = require('./seedHelpers');
// import mongoose schema from models file
const Journey = require('../models/journey')

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


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() =>{
  await Journey.deleteMany({});
  for (let i=0; i<50; i++) {
    const random100 = Math.floor(Math.random() * nzcities.length);
    const price = Math.floor(Math.random() * 20 ) + 10;
    const journey = new Journey({
      location: `${nzcities[random100].city}, ${nzcities[random100].region}`,
      title: `${sample(location_descriptors)} ${sample(places)}`,
      price,
      description: "Unleash Your Wanderlust: Journey Beyond Boundaries with Voyage Vibe!",
      
    })
    await journey.save();
  }
}

seedDB()
.then(() =>{
  mongoose.connection.close();
})