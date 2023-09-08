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
    if(blogs.length!==0){
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

const mostBlogs = (blogs) => {
    if(blogs.length!==0){const countMap = blogs.reduce((countMap, item) => {
        countMap[item.author]=(countMap[item.author] || 0) + 1;
        return countMap;
        }, {});
        const mostRepeated = Object.keys(countMap).reduce((mostRepeated, key) => {
            return countMap[key]>countMap[mostRepeated]?key:mostRepeated;
        }, Object.keys(countMap)[0]);
        return ({
            author: mostRepeated,
            blogs: countMap[mostRepeated]
        })
    }else{return{message:"no blog to show"}}
  }
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}