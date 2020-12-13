import Bootcamp from '../models/Bootcamp.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import geocoder from '../utils/geocoder.js'

// @desc        Get All Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  let query

  // copy of req.query
  const reqQuery = { ...req.query }

  // fields to exclude
  const removeFields = ['select', 'sort']

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // console.log(req.query)

  // console.log(queryStr)

  // create operators ($gt, $gte)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // console.log(queryStr)

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr))

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    // console.log(fields)
    query = query.select(fields)
    // console.log(query)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // executing query
  const bootcamps = await query

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps })
})

// @desc        Get Single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc        Create New Bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    success: true,
    data: bootcamp
  })
})

// @desc        Update Bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: bootcamp })
})

// @desc        Delete Bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: {} })
})

// @desc        Get bootcamps within radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Get lat and lon from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide distance by radius of earth
  // Earth radius = 3,963 miles or 6,378 km
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

export {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
}
