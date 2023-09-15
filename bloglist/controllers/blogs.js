const blogsRouter = require('express').Router()
const { response } = require('express')
const jwt = require('jsonwebtoken')
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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(body.url && body.title){
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)

        const newBlog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: (body.likes || 0),
            user:user._id
        })

        const savedBlog = await newBlog.save()
        user.blogs =  user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)

    }else{response.status(400).end()}
})

//DELETE A BLOG BY ID
blogsRouter.delete('/:id',async (request, response)=>{
    //const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id).populate('blogs', {id:1})
    if(user.blogs.some(blgs=>blgs.id===request.params.id)){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end() 
    }else{response.status(400).json({error: 'Invalid Token or ID' })}
    
})

//UPDATE LIKES OF A BLOG BY ID
blogsRouter.put('/:id',async (request,response)=>{
    const newBlog = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id , newBlog , { new:true })
    response.json(updatedBlog)
})

module.exports = blogsRouter