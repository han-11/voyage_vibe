const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const destinations = require('../controllers/destinations');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage});
const {isLoggedIn, validateDestination, isAuthor } = require('../middleware.js');



// define the route for the destinations, connect it to the controller, and validate the destination
router.route('/')
  .get(catchAsync(destinations.index))
  .post(isLoggedIn,
    upload.array('image'), 
     validateDestination,
    catchAsync(destinations.createDestination))

router.get('/new', isLoggedIn, destinations.renderNewForm);


router.route('/:id')
    .get( catchAsync(destinations.showDestination))
    .put(isLoggedIn,
      isAuthor,
    upload.array('image'), 
    validateDestination,
    catchAsync(destinations.updateDestination))
    .delete(isLoggedIn,
    isAuthor,
    catchAsync(destinations.deleteDestination));

// define the route for the edit page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(destinations.renderEditForm));


module.exports = router;