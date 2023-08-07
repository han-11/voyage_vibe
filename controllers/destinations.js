const Destination = require('../models/destination');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken:mapBoxToken });
const { cloudinary } = require("../cloudinary");



//=======================
// ROUTES
//=======================

// For Fuzzy Search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// INDEX ROUTE
// This is how we see the data

module.exports.index = async (req, res) => {
    let perPage = 10;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    let noMatch = null;
    let allDestinations;
  
  if (req.query.search) {
      
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    try {
            const allDestinations = await Destination.find({ title: regex })
              .skip((perPage * pageNumber) - perPage)
              .limit(perPage)
              .exec();

            const count = await Destination.countDocuments({ title: regex });

            if (allDestinations.length < 1) {
              noMatch = "No destinations match that query, please try again.";
            }

            res.render("destinations/index", {
              destinations: allDestinations,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: req.query.search,
              result: `Searched results for "${req.query.search}"`
            });
      } catch (err) {
              req.flash("error", "Sorry, something unexpected went wrong. Please let me know by sending an email to jacob.d.grisham@gmail.com");
              res.redirect("/destinations"); // or handle the error appropriately
    } 
    
  } else {
    
      try {
            allDestinations = await Destination.find({})
              .skip((perPage * pageNumber) - perPage)
              .limit(perPage)
              .exec();
          // count how many destinations are in the database
              const count = await Destination.countDocuments();

              res.render("destinations/index", {
                destinations: allDestinations,
                current: pageNumber,
                pages: Math.ceil(count / perPage),
                noMatch: noMatch,
                search: false, 
                result: 'All Destinations',
                allDestinations: allDestinations
              });
      } catch (err) {
        console.log(err);
        // Handle the error appropriately
      }
  }
};

      


module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  res.render('destinations/new')
}

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
