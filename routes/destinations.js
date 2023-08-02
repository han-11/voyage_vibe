const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Destination = require('../models/destination');
const { destinationSchema } = require('../schemas.js');


const validateDestination = (req, res, next) => {
  const { error } = destinationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


router.get('/', catchAsync(async (req, res) => {
  const destinations = await Destination.find({})
  res.render('destinations/index', { destinations })
}));

router.get('/new', (req, res) => {
  res.render('destinations/new')
});


router.post('/', validateDestination, catchAsync(async (req, res) => {

  const destination = new Destination(req.body.destination);
  await destination.save();
  req.flash('success', 'Successfully shared your destination!');
  res.redirect(`/destinations/${destination._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id).populate('comments');
  if (!destination) {
    req.flash('error', 'Cannot find that destination!');
    return res.redirect('/destinations');
  }
  res.render('destinations/show', { destination});
}));


router.get('/:id/edit', catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
   if (!destination) {
    req.flash('error', 'Cannot find that destination!');
    return res.redirect('/destinations');
  }
  res.render('destinations/edit', { destination })
}));

router.put('/:id', validateDestination, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndUpdate(id, { ...req.body.destination });
  req.flash('success', 'Successfully updated your destination!');
  res.redirect(`/destinations/${id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted your destination!');
  res.redirect('/destinations')
}));

module.exports = router;