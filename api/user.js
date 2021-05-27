const express = require('express');
const router = express.Router();

// MongoDB Schemas
const User = require('../models/User');
const Review = require('../models/Review');

// REVIEW ------------------------------------------------------------ START

/// Delete a movie review
router.delete('/review', async (req, res) => {

  // Get [review_id] from request query
  const {
    review_id,
  } = req.query;

  console.log(review_id);
  
  try {
    let data = await Review.findOneAndDelete({ id: review_id });
    return res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

/// Add a movie review to database
router.post('/review', async (req, res) => {
  
  // Get [user_id] and [movie_id] from request query
  const {
    user_id,
    movie_id
  } = req.query;

  // Get review data from request body
  const {
    id,
    title,
    body,
    rating,
  } = req.body;

  const reviewData = {
    id,
    user_id,
    movie_id,
    title,
    body,
    rating,
  }

  try {
    // Try to find review from this [user_id] for this [movie_id]
    // let data = await Review.findOne({ user_id: user_id, movie_id: movie_id });
    let data = await Review.findOne({ id: reviewData.id });

    // If we find an existing review, update it's details
    if (data) {
      console.log('found matching review');
      data = await Review.findOneAndUpdate(
        { id: reviewData.id },
        { $set: reviewData },
        { new: true }
      );
      return res.status(200).send(data);
    } else {
      console.log('new review');
      data = new Review(reviewData);
      await data.save();
      return res.status(200).send(data);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// Get all reviews for [user_id]
router.get('/review/user/:user_id', async (req, res) => {

  // Get user_id param from request
  let user_id = req.params.user_id;

  try {
    const data = await Review.find({ user_id: user_id });
    if (!data) return res.status(400).json({ msg: 'Review data not found' });
    res.json(data);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Review data not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Get all review for [movie_id]
router.get('/review/movie/:movie_id', async (req, res) => {

  // Get movie_id param from request
  let movie_id = req.params.movie_id;

  try {
    const data = await Review.find({ movie_id: movie_id });
    if (!data) return res.status(400).json({ msg: 'Movie review data not found' });
    res.json(data);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Movie review data not found' });
    }
    res.status(500).send('Server Error');
  }
});

// REVIEW ------------------------------------------------------------ END

// USER ------------------------------------------------------------ START

// Get user with [user_id]
router.get('/:user_id', async (req, res) => {

  /// Get user_id param from request
  let user_id = req.params.user_id;

  try {
    const data = await User.findOne({ id: user_id });
    if (!data) return res.status(400).json({ msg: 'User data not found' });
    res.json(data);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'User data not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Add or update user to database
router.post('/', async (req, res) => {

  // Get user data from request body
  const {
    id,
    username,
    location,
    watchlist,
  } = req.body;

  const userData = {
    id,
    username,
    location,
    watchlist,
    bio,
    imageUrl,
  }

  try {
    // Try to find a user with this [id] in the datbase
    let data = await User.findOne({ id: id  });

    // If we find an existing user, update their details
    if (data) {
      console.log('Found an existing user with id: ' + userData.id);
      data = await User.findOneAndUpdate(
        { id: userData.id },
        { $set: userData },
        { new: true }
      );
      return res.status(200).send(data);
    }
    // If we do not find an existing user, create a new one
    else {
      console.log('new user');
      data = new User(userData);
      await data.save();
      return res.status(200).send(data);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// Add movie to user's watchlist
router.put('/:user_id/watchlist', async (req, res) => {

  // Get user_id param from request
  let user_id = req.params.user_id;
  // Get movie_id from query params
  let movie_id = req.query.movie_id;

  try {
    // Try to find user with this [user_id]
    let data = await User.findOneAndUpdate(
      { id: user_id },
      { $addToSet: { watchlist: movie_id } },
      { new: true }
    );
    return res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// Remove movie to user's watchlist
router.delete('/:user_id/watchlist', async (req, res) => {

  // Get user_id param from request
  let user_id = req.params.user_id;
  // Get movie_id from query params
  let movie_id = req.query.movie_id;

  try {
    // Try to find user with this [user_id]
    let data = await User.findOneAndUpdate(
      { id: user_id },
      { $pull: { watchlist: movie_id } },
      { new: true }
    );
    return res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});


// USER ------------------------------------------------------------ END

module.exports = router;