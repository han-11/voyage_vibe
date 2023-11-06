const express = require('express');
const router = express.Router({ mergeParams:true });
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware.js');


// define the route for the comments, connect it to the controller, and validate the comment
// catch async errors and pass them to the error handler
router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;