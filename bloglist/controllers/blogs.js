const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')

//GET ALL BLOGS
blogsRouter.get('/', async (request, response) => {
    const allBlogs = await Blog.find({})
    response.json(allBlogs)
})

//CREATE AN ENTRY
blogsRouter.post('/',async (request, response) =>{
    const newBlog = new Blog(request.body)
    const savedBlog = await newBlog.save()
    response.status(201).json(savedBlog)
})

module.exports = blogsRouter