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

test('blogs are returned as json and numbers of blogs are checked', async () => {
  const allBlogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  expect(allBlogs.body).toHaveLength(helper.initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})