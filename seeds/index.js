const mongoose = require('mongoose');
const nzcities = require('./nzcities');
const {places, location_descriptors} = require('./seedHelpers');
// import mongoose schema from models file
const Destination = require('../models/destination');

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
  await Destination.deleteMany({});
  for (let i=0; i<50; i++) {
    const random100 = Math.floor(Math.random() * nzcities.length);
    const date = '2023-07-01';
    const destination = new Destination({
      location: `${nzcities[random100].city}, ${nzcities[random100].region}`,
      title: `${sample(location_descriptors)} ${sample(places)}`,
      image: 'https://images.unsplash.com/photo-1626606076701-cf4ae64b2b03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date,
      description: "Unleash Your Wanderlust: destination Beyond Boundaries with Voyage Vibe!",
      
    })
    await destination.save();
  }
}

seedDB()
.then(() =>{
  mongoose.connection.close();
})