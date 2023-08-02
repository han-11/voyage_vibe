const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Import the Comment model
const Comment = require('./comment');

const DestinationSchema = new Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  date: String,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});


// Delete all comments associated with a destination when that destination is deleted
DestinationSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id : {
        $in: doc.comments
      }
    })
  }

})


module.exports = mongoose.model('Destination', DestinationSchema);