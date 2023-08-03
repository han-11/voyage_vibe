const Destination = require('../models/destination');


module.exports.index = async (req, res) => {
  const destinations = await Destination.find({})
  res.render('destinations/index', { destinations })
}

module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  res.render('destinations/new')
}

module.exports.createDestination = async (req, res) => {
  const destination = new Destination(req.body.destination);
  destination.author = req.user._id;
  await destination.save();
  req.flash('success', 'Successfully shared your destination!');
  res.redirect(`/destinations/${destination._id}`);
}

module.exports.showDestination = async (req, res) => {
  const destination = await Destination.findById(req.params.id).populate({
    path: 'comments',
    populate: {
      path: 'author'
    }
}).populate('author');
  console.log(destination);
  if (!destination) {
    req.flash('error', 'Cannot find that destination!');
    return res.redirect('/destinations');
  }
  res.render('destinations/show', { destination});
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id);
   if (!destination) {
    req.flash('error', 'Cannot find that destination!');
    return res.redirect('/destinations');
   }
  res.render('destinations/edit', { destination })
}

module.exports.updateDestination = async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndUpdate(id, { ...req.body.destination });
  req.flash('success', 'Successfully updated your destination!');
  res.redirect(`/destinations/${id}`)
}

module.exports.deleteDestination = async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted your destination!');
  res.redirect('/destinations')
}
