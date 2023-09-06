const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')

//GET ALL BLOGS
blogsRouter.get('/', (request, response, next) => {
    Blog.find({}).then(blgs => {
      response.json(blgs)
    }).catch(error=>next(error))
})

//CREATE AN ENTRY
blogsRouter.post('/',(request, response, next) =>{
    const newBlog=new Blog(request.body)

    Blog.save(newBlog).then(sblg=>{
        response.json(sblg)
    }).catch(error=>next(error))

})

module.exports = blogsRouter