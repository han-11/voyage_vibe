const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const destinations = require('../controllers/destinations');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage});
const {isLoggedIn, validateDestination, isAuthor } = require('../middleware.js');




router.route('/')
  .get(catchAsync(destinations.index))
  .post(isLoggedIn,
    validateDestination,
    catchAsync(destinations.createDestination))

router.get('/new', isLoggedIn, destinations.renderNewForm);

router.route('/:id')
    .get( catchAsync(destinations.showDestination))
    .put(isLoggedIn,
    isAuthor,
    validateDestination,
    catchAsync(destinations.updateDestination))
    .delete(isLoggedIn,
    isAuthor,
    catchAsync(destinations.deleteDestination));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(destinations.renderEditForm));


module.exports = router;