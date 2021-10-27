const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} =  require('../middleware')
const campgrounds = require('../controllers/campgrounds')

const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, upload.array('image'), catchAsync(campgrounds.createCampground))
	// .post(upload.array('image'), (req, res) => {
	// 	console.log(req.body, req.files)
	// 	res.send("check console")
	// })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn,isAuthor, catchAsync(campgrounds.delete))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router