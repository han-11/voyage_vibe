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
  for (let i = 0; i < 50; i++) {
    author: "64cac9553381f58875baae8d";
    const random100 = Math.floor(Math.random() * nzcities.length);
    const date = '2023-07-01';
    const destination = new Destination({
      // Hard coded author id
      author: "64cac9553381f58875baae8d",
      location: `${nzcities[random100].city}, ${nzcities[random100].region}`,
      title: `${sample(location_descriptors)} ${sample(places)}`,
        geometry: {
                type: "Point",
                coordinates: [ nzcities[random100].lng,
                    nzcities[random100].lat]
            },
      images: [
                {
                    url: 'https://res.cloudinary.com/deg98levx/image/upload/v1691105537/VoyageVibe/geqfvaihj3blxqgfa67n.jpg',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/deg98levx/image/upload/v1691105273/VoyageVibe/cinejnnvsolsxqbd9xw8.jpg',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
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