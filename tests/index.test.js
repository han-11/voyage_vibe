const mongoose = require('mongoose');
const User = require('../models/user.js');;
const Comment = require('../models/comment.js');;
const Destination = require('../models/destination.js');;

// Initialize Mongoose
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// User model tests
describe('User Model', () => {
  beforeAll(async () => {
    // Clear the User collection before testing
    await User.deleteMany({});
  });
// test creating a new user to the database
  it('should save a user to the database', async () => {
    const user = new User({
      email: 'testuser@example.com',
    });

    const savedUser = await user.save();
    expect(savedUser.email).toBe(user.email);
  });
// test finding a user by email
   it('should find a user by email', async () => {
    const user = await User.findOne({ email: 'testuser@example.com' });
    expect(user).not.toBeNull();
    expect(user.email).toBe('testuser@example.com');
   });
  // test updating a user email
    it('should update a user email', async () => {
    const user = await User.findOne({ email: 'testuser@example.com' });
    user.email = 'updated@example.com';
    const updatedUser = await user.save();
    expect(updatedUser.email).toBe('updated@example.com');
    });
  
  // test deleting a user from the database
  it('should delete a user from the database', async () => {
    const user = await User.findOne({ email: 'updated@example.com' });
    const deletedUser = await user.deleteOne();
    expect(deletedUser).not.toBeNull();
  });
  
});

// Comment model tests
describe('Comment Model', () => {
  beforeAll(async () => {
    // Clear the Comment collection before testing
    await Comment.deleteMany({});
  });
  
  // test creating a new comment to the database

  it('should save a comment to the database', async () => {
    const comment = new Comment({
      body: 'This is a test comment',
      rating: 4,
    });

    const savedComment = await comment.save();
    expect(savedComment.body).toBe(comment.body);
  });
  
  
  // test finding a comment by body
  it('should find a comment by body', async () => {
    const comment = await Comment.findOne({ body: 'This is a test comment' });
    expect(comment).not.toBeNull();
    expect(comment.body).toBe('This is a test comment');
  });
  
  // test updating a comment in the database

  it('should update a comment rating', async () => {
    const comment = await Comment.findOne({ body: 'This is a test comment' });
    comment.rating = 5;
    const updatedComment = await comment.save();
    expect(updatedComment.rating).toBe(5);
  });
// test deleting a comment from the database
  it('should delete a comment from the database', async () => {
    const comment = await Comment.findOne({ body: 'This is a test comment' });
    const deletedComment = await comment.deleteOne();
    expect(deletedComment).not.toBeNull();
  });
  
  
});

// Destination model tests
describe('Destination Model', () => {
  beforeAll(async () => {
    // Clear the Destination collection before testing
    await Destination.deleteMany({});
  });
    // test creating a new destination to the database
    it('should save a destination to the database', async () => {
  const destination = new Destination({
    title: 'Test Destination',
    description: 'This is a test destination',
    location: 'Test Location',
    geometry: {
      type: 'Point',
      coordinates: [1.23, 4.56],
    },
  });

  const savedDestination = await destination.save();
  expect(savedDestination.title).toBe(destination.title);
    });
  
  // test finding a destination by title
  
  it('should find a destination by title', async () => {
    const destination = await Destination.findOne({ title: 'Test Destination' });
    expect(destination).not.toBeNull();
    expect(destination.title).toBe('Test Destination');
  });
// test updating a destination in the database
  it('should update a destination description', async () => {
    const destination = await Destination.findOne({ title: 'Test Destination' });
    destination.description = 'Updated destination description';
    const updatedDestination = await destination.save();
    expect(updatedDestination.description).toBe('Updated destination description');
  });
// test deleting a destination from the database
  it('should delete a destination from the database', async () => {
    const destination = await Destination.findOne({ title: 'Test Destination' });
    const deletedDestination = await destination.deleteOne();
    expect(deletedDestination).not.toBeNull();
  });

});

// Close Mongoose connection
afterAll(async () => {
  await mongoose.connection.close();
}
); // Set the timeout to 10 seconds