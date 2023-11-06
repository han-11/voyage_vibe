const Destination = require('../models/destination');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken:mapBoxToken });
const { cloudinary } = require("../cloudinary");



//=======================
// ROUTES
//=======================

// For Destinations Search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// INDEX ROUTE

module.exports.index = async (req, res, next) => {
    let noMatch = null;
    let currentPage = Number(req.query.page);
  let results = 'All Destinations ';

    if (!currentPage || currentPage < 1)
    // if client req /index w/o ?page 
    {
      currentPage = 1;
      
        // get grounds from the database
      if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        try {
          req.session.destinations = await Destination.find({ title: regex }).limit(1000);
          if (req.session.destinations.length < 1) {
              noMatch = "No destinations match that query, please try again.";
            }
        } catch (err) {
          req.flash("error", "Sorry, something unexpected went wrong. Please let me know by sending an email to jacob.d.grisham@gmail.com");
         res.redirect("/destinations"); // or handle the error appropriately
        
        }
      } else {
    //     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        req.session.destinations = await Destination.find({}).limit(1000);
      }

        // Initialize Pagination
        let len = (req.session.destinations).length;
        req.session.pagination = {
            totalItems: len, // total # of Destinations
            itemsPerPage: 10,
            totalPages: Math.ceil(len / 10) // total # of pages
        }
    }

    if (!req.session.pagination || !req.session.destinations) res.redirect('/destinations');

    const {
        itemsPerPage,
        totalItems,
        totalPages
    } = req.session.pagination;
    let start = (currentPage - 1) * itemsPerPage;
    let end = currentPage * itemsPerPage;
    if (end > totalItems) end = totalItems;

    const destinations = (req.session.destinations);
    res.render('destinations/index', {
      destinations,
      totalPages,
      currentPage,
      start,
      end,
      noMatch,
      results: req.query.search ?  `Search results for "${req.query.search}"`  : results
      });
};
   

// render the new destination form
module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  res.render('destinations/new')
}


// create a new destination and save it to the database
module.exports.createDestination = async (req, res) => {  
  const geoData = await geocoder.forwardGeocode({
    query: req.body.destination.location,
    limit: 1
  }).send();
  const destination = new Destination(req.body.destination);
  destination.geometry = geoData.body.features[0].geometry;
  destination.images = req.files.map( f => ({ url: f.path, filename:f.filename }));
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
  const destination = await Destination.findByIdAndUpdate(id, { ...req.body.destination });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  destination.images.push(...imgs);
  await destination.save();
  if (req.body.deleteImages) {
    console.log(req.body.deleteImages);
    // delete images from cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    // delete images from mongo database
        await destination.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
  req.flash('success', 'Successfully updated your destination!');
  res.redirect(`/destinations/${id}`)
}

module.exports.deleteDestination = async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted your destination!');
  res.redirect('/destinations')
}
