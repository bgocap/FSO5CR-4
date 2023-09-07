const dummy = (blogs) => {
    return blogs.length
    ?1
    :1
  }
const totalLikes = (blogs) =>{
    const result =  blogs.reduce((total,blog)=>total+=blog.likes,0)
    return result
}

const favoriteBlog = (blogs)=>{
    if(blogs.length){
        const highestNumOfLikes = blogs.reduce((currentMax,blog)=>{
            return blog.likes>currentMax?blog.likes:currentMax;
        },blogs[0].likes)
        const favoriteBlog = blogs.find(blog=>blog.likes===highestNumOfLikes)
        return ({
            title : favoriteBlog.title,
            author  : favoriteBlog.author,
            likes : favoriteBlog.likes
        })
    }else{return{message:"no blog to show"}}
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}