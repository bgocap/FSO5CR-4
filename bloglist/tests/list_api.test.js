const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')
const { all } = require('../controllers/blogs')

//DB SET initial Users
beforeEach(async () => {
  await User.deleteMany({})
  const { username, name, password } = helper.initialUser
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({username,name,passwordHash,})
  await user.save()
})

//DB SET initial Blogs
beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blg => new Blog(blg))
  const promiseArray = blogObjects.map(blg => blg.save())
  await Promise.all(promiseArray)
})

describe('Verification of a blog',()=>{
  test('blogs are returned as json and numbers of blogs are checked', async () => {
    const allBlogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    expect(allBlogs.body).toHaveLength(helper.initialBlogs.length)
  })
  test('check that id is defined', async () => {
    const allblogs = await helper.blogsInDb()
    allblogs.map(blg=>expect(blg.id).toBeDefined())
  })
})

describe('Addition of a blog',()=>{
  test('a valid blog can be added',async ()=>{

    const newLogin = {username:'user1',password:'password'}
    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const token = loginResponse.body.token
    
    const newBlog = {
      title:'POST Test',
      author:'Diego',
      url:'https://wepresent.wetransfer.com',
      likes:100
    }


    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(blgs => blgs.title)
    expect(titles).toContain('POST Test')

  })

  test('when likes is missing in a POST request, it is filled with 0',async ()=>{
    
    const newLogin = {username:'user1',password:'password'}
    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const token = loginResponse.body.token
    
    const newBlog = {
      title:'POST 0 likes test',
      author:'Diego2',
      url:'https://google.com.pe',
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toEqual(0)
  })

  test('when title is missing in a POST request, it returns 400',async ()=>{
    
    const newLogin = {username:'user1',password:'password'}
    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const token = loginResponse.body.token
    
    const newBlog = {
      author:'impossibleAuthor',
      url:'https://youtube.com',
      likes: 2
    }
    await api.post('/api/blogs').set('Authorization', 'Bearer '+ token).send(newBlog).expect(400)
  })

  test('when url is missing in a POST request, it returns 400',async ()=>{
    
    const newLogin = {username:'user1',password:'password'}
    const loginResponse = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const token = loginResponse.body.token
    
    const newBlog = {
      title:'The impossible blog',
      author:'impossibleAuthor',
      likes: 2
    }
    await api.post('/api/blogs').set('Authorization', 'Bearer '+ token).send(newBlog).expect(400)
  })

  test('when the token is not given or invalid, it returns 401 unauthorized',async ()=>{
        
    const token = 'incorrect token'
    const newBlog = {
      title:'The impossible blog',
      author:'impossibleAuthor',
      likes: 2
    }
    await api.post('/api/blogs').set('Authorization', 'Bearer '+ token).send(newBlog).expect(401)
  })

})

describe('Deletion of a blog',()=>{
  test('can delete a blog by id', async ()=>{
    const allBlogs = await helper.blogsInDb()
    await api.delete(`/api/blogs/${allBlogs[0].id}`).expect(204)
  })
})

describe('Edition of a blog',()=>{
  test('can udpate the number of likes',async ()=>{
    const allBlogs = await helper.blogsInDb()
    const udaptedBlog = {...allBlogs[0], likes:12}
    const response = await api
      .put(`/api/blogs/${udaptedBlog.id}`)
      .send(udaptedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual(udaptedBlog)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'password',
      name: 'dummyr',
      password: 'he',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password should have at least 3 characters!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})