import express from 'express'
import dotenv from 'dotenv'

// load envs
dotenv.config({ path: './config/config.env' })

// Initialize express
const app = express()

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
