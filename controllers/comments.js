const Destination = require('../models/destination');
const Comment = require('../models/comment');


module.exports.createComment = async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  comment.lastUpdated = Date.now();
  destination.comments.push(comment);
  await comment.save();
  await destination.save();
  req.flash('success', 'Your comment has been added successfully!');
  res.redirect(`/destinations/${destination._id}`);
}

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Destination.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash('success', 'Your comment has been deleted successfully!');
  res.redirect(`/destinations/${id}`);
}