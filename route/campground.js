const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campground=require('../controllers/campground')


router.route('/')
.get(catchAsync(campground.index ))
.post(isLoggedIn,validateCampground,catchAsync( campground.CreateCampground))

router.get('/new',isLoggedIn,campground.RenderNewForm)
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.RenderEditForm  ))

router.route('/:id')
.get(catchAsync( campground.showCampground))
.put(isLoggedIn,isAuthor,validateCampground, catchAsync( campground.updateCampground))
.delete(isLoggedIn,isAuthor,catchAsync( campground.deleteCampground))



module.exports=router;