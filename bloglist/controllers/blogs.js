const blogsRouter = require('express').Router()
const { response } = require('express')
const User = require('../models/user')
const Blog = require('../models/blog')
const { request } = require('../app')

//GET ALL BLOGS
blogsRouter.get('/', async (request, response) => {
    const allBlogs = await Blog.find({}).populate('user', {name:1})
    response.json(allBlogs)
})

//CREATE A BLOG
blogsRouter.post('/',async (request, response) =>{
    const body = request.body
    if(body.url && body.title){
        const users=await User.find({})
        const newBlog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: (body.likes || 0),
            user:users[0].id
        })
        const savedBlog = await newBlog.save()
        users[0].blogs =  users[0].blogs.concat(savedBlog._id)
        await users[0].save()
        response.status(201).json(savedBlog)
    }else{response.status(400).end()}
})

//DELETE A BLOG BY ID
blogsRouter.delete('/:id',async (request, response)=>{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end() 
})

//UPDATE LIKES OF A BLOG BY ID
blogsRouter.put('/:id',async (request,response)=>{
    const newBlog = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id , newBlog , { new:true })
    response.json(updatedBlog)
})

module.exports = blogsRouter