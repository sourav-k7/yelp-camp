const express = require('express');
const Review = require('../models/review')
const router = express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground');
const review = require('../controllers/review')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware')

router.post('/',isLoggedIn,validateReview,catchAsync(review.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

module.exports=router;