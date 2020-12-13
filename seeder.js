import fs from 'fs'
import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'

// Load env var
dotenv.config({ path: './config/config.env' })

// Load models
import Bootcamp from './models/Bootcamp.js'

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

// Read data
import bootcamps from './_data/bootcamps.js'

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)

    console.log('Data Imported...'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()

    console.log('Data Destroyed...'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
