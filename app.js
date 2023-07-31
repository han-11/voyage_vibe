const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { destinationSchema } = require('./schemas.js');
const Destination = require('./models/destination');


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


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// parse the form data and put it in the request body
app.use(express.urlencoded({ extended: true }));
// set up the route as delete or put
app.use(methodOverride('_method'));

const validateDestination = (req, res, next) => {
  const { error } = destinationSchema.validate(req.body);
  if (error) {
    const msg = result.error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


app.get('/', (req, res) => {
  res.send("Hello World")
})

app.get('/destinations', catchAsync(async (req, res) => {
  const destinations = await Destination.find({})
  res.render('destinations/index', { destinations })
}));

app.get('/destinations/new', (req, res) => {
  res.render('destinations/new')
});


app.post('/destinations', validateDestination, catchAsync(async (req, res) => {
  const destination = new Destination(req.body.destination);
  await destination.save();
  res.redirect(`/destinations/${destination._id}`);
}));

app.get('/destinations/:id', catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  res.render('destinations/show', { destination });
}));


app.get('/destinations/:id/edit', catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  res.render('destinations/edit', { destination })
}));

app.put('/destinations/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndUpdate(id, { ...req.body.destination });
  res.redirect(`/destinations/${id}`)
}));

app.delete('/destinations/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  res.redirect('/destinations')
}));

// define a middleware to handle all the request that not match the route above
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})


// error handler in middle ware, hanlde all the errors occured during request
app.use((err, req, res, next )=> {
  // destructure error information from anywhere 
  const {statusCode = 500, message='Something went wronng' } = err;

  res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
  console.log("listen to port 3000")
})