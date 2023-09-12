const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
      .map(blg => new Blog(blg))
  const promiseArray = blogObjects.map(blg => blg.save())
  await Promise.all(promiseArray)
})

test('Blogs are returned as json and numbers of blogs are checked', async () => {
  const allBlogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  expect(allBlogs.body).toHaveLength(helper.initialBlogs.length)
})

test('Check that id is defined', async () => {
  const allblogs = await helper.blogsInDb()
  allblogs.map(blg=>expect(blg.id).toBeDefined())
})

test('A valid blog can be added',async ()=>{
  const newBlog = {
    title:'POST Test',
    author:'Diego',
    url:'https://wepresent.wetransfer.com',
    likes:100
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(blgs => blgs.title)
  expect(titles).toContain('POST Test')
})

afterAll(async () => {
  await mongoose.connection.close()
})