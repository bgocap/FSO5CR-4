const dummy = (blogs) => {
    return blogs.length
    ?1
    :1
  }
const totalLikes = (blogs) =>{
    return blogs.reduce((total,blog)=>total+=blog.likes,0)
}
  
module.exports = {
    dummy,
    totalLikes
}