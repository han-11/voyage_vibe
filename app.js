if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
// require the packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');

// import the routes
const destinationsRoutes = require('./routes/destinations');
const commentsRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

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
// set the path for the views folder
app.set('views', path.join(__dirname, 'views'));
// parse the form data and put it in the request body
app.use(express.urlencoded({ extended: true }));
// set up the route as delete or put
app.use(methodOverride('_method'));
// use the public folder to serve the static files
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
} 
  
  
app.use(session(sessionConfig))
app.use(flash());
// use passport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// define a middleware to use the flash message
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // res.locals is an object that will be passed to the template
  res.locals.success = req.flash('success'),
  res.locals.error = req.flash('error')
  next();
})


// define the prefix for the routes
app.use('/destinations', destinationsRoutes);
app.use('/destinations/:id/comments', commentsRoutes);
app.use('/', userRoutes);

// define the route for the home page
app.get('/', (req, res) => {
  res.render('landing')
})




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