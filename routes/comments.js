const express = require('express');
const router = express.Router({ mergeParams:true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { commentSchema } = require('../schemas.js');
const Destination = require('../models/destination');
const Comment = require('../models/comment');
const comments = require('../controllers/comments');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware.js');



router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;