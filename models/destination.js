const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Import the Comment model
const Comment = require('./comment');


const ImageSchema = new Schema({
  url: String,
  filename: String
})
// convert the image to thumbnail, to display it on edit page
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200');
})

const opt = { toJSON: { virtuals: true}};

const DestinationSchema = new Schema({
  title: String,
  images: [ImageSchema],
  description: String,
  location: String,
  date: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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