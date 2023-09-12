const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')

//GET ALL BLOGS
blogsRouter.get('/', async (request, response) => {
    const allBlogs = await Blog.find({})
    response.json(allBlogs)
})

//CREATE A BLOG
blogsRouter.post('/',async (request, response) =>{
    const body = request.body
    if(body.url && body.title){
        const newBlog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: (body.likes || 0)
        })
        const savedBlog = await newBlog.save()
        response.status(201).json(savedBlog)
    }else{response.status(400).end()}
})

//DELETE A BLOG BY ID
blogsRouter.delete('/:id',async (request, response)=>{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end() 
})

module.exports = blogsRouter