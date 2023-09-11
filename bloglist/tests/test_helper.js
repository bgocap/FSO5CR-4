const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author X',
    url:'https://google.uk',
    likes: 5
  },
  {
    title: 'Blog 2',
    author: 'Author Y',
    url:'https://google.es',
    likes: 20
  },
  {
    title: 'Blog 3',
    author: 'Author Z',
    url:'https://google.fi',
    likes: 10
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blg => blg.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}