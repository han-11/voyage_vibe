const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Import the Comment model
const Comment = require('./comment');

// define the schema for the images
const ImageSchema = new Schema({
  url: String,
  filename: String
})
// convert the image to thumbnail, to display it on edit page
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200');
})

// Add a virtual property to the ImageSchema
const opt = { toJSON: { virtuals: true}};

const DestinationSchema = new Schema({
  title: String,
  images: [ImageSchema],
  description: String,
  location: String,
  date: String,
  geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opt);


// Add a virtual property to the DestinationSchema
DestinationSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/destinations/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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