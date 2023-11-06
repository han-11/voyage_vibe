const {destinationSchema, commentSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Destination = require('./models/destination');
const Comment = require('./models/comment.js');

// check if session has the user's information
 module.exports.isLoggedIn = (req,res, next) => {
   if (!req.isAuthenticated()) {
    // store the url they are requesting return to their previous page before loggin in
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first');
    return res.redirect('/login');
  }
  next();
 }


//  return the user to the previous page that they  visited before login
 module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo
  }
  next();
 }


// handle validation error in destination schema
module.exports.validateDestination = (req, res, next) => {
  const{error} = destinationSchema.validate(req.body);
  if(error){
    const msg= error.details.map( el => el.message).join(",");
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

// validate comments format 
module.exports.validateComment = (req, res, next) => {
  const{ error} = commentSchema.validate(req.body);
  if(error){
    const msg= error.details.map( el => el.message).join(",");
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


// check if the current user the same with the author of the destination
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const destination = await Destination.findById(id);
  if (!destination.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/destinations/${id}`)
  } 
  next();
};

// check if the current user the same with the author of the destination
module.exports.isCommentAuthor = async (req, res, next) => {
  const {id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/destinations/${id}`)
  } 
  next();
};