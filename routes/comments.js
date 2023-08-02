const express = require('express');
const router = express.Router({ mergeParams:true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { commentSchema } = require('../schemas.js');
const Destination = require('../models/destination');
const Comment = require('../models/comment');


const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}



router.post('/', validateComment, catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  destination.comments.push(comment);
  await comment.save();
  await destination.save();
  req.flash('success', 'Your comment has been added successfully!');
  res.redirect(`/destinations/${destination._id}`);
}));

router.delete('/:commentId', catchAsync(async (req, res) => {
  const { id, commentId } = req.params;
  await Destination.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash('success', 'Your comment has been deleted successfully!');
  res.redirect(`/destinations/${id}`);
}));

module.exports = router;