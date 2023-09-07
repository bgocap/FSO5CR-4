//DONE
require('dotenv').config()
//DONE
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

//DONE
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
//DONE
const Blog = mongoose.model('Blog', blogSchema)
//DONE
const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
//DONE
app.use(cors())
app.use(express.json())

//DONE
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

//DONE
app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
//DONE
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})