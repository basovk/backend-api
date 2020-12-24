import express from 'express'
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.js'
import User from '../models/User.js'

const router = express.Router()

import { protect, authorize } from '../middleware/auth.js'

import { advancedResults } from '../middleware/advancedResults.js'

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

export default router
