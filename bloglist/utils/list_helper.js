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
        const maxLikes = blogs.reduce((maxLikes,item)=>{
            if(item.likes>maxLikes.likes){maxLikes=item}
            return maxLikes
        },blogs[0])
        return ({
            title : maxLikes.title,
            author  : maxLikes.author,
            likes : maxLikes.likes
        })
    }else{return{message:"no blogs in the list"}}
}

const mostBlogs = (blogs) => {
    if(blogs.length!==0){
        const countMap = blogs.reduce((countMap, item) => {
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
    }else{return{message:"no blogs in the list"}}
}

const mostLikes = (blogs) => {
    if(blogs.length!==0){
    const countMap = blogs.reduce((countMap,item)=>{
        countMap[item.author] = (countMap[item.author]||0) +item.likes;
        return countMap;
    },{})
    const mostLiked = Object.keys(countMap).reduce((mostLiked, key) => {
        return countMap[key]>countMap[mostLiked]?key:mostLiked;
    }, Object.keys(countMap)[0]);
    return ({
        author: mostLiked,
        likes: countMap[mostLiked]
    })}else{return{message:"no blogs in the list"}}
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}