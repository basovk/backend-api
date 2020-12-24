import express from 'express'
import {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses.js'
import Course from '../models/Course.js'

const router = express.Router({ mergeParams: true })

// Check for logged in user to see if he can reach route
import { protect, authorize } from '../middleware/auth.js'

import { advancedResults } from '../middleware/advancedResults.js'

router
  .route('/')
  .get(
    advancedResults(Course, { path: 'bootcamp', select: 'name description' }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)

export default router
