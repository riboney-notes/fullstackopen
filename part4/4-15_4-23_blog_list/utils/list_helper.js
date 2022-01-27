// receives an array and returns the value 1
const dummy = (blogs) => 1

// receives an array of blogs and returns total sum of likes 
const totalLikes = (blogs) =>  blogs.reduce((sum, next) => sum + next.likes, 0)

// receive array of blogs and return which blog has the most likes
const favoriteBlog = (blogs) => {
    const likes = blogs.flatMap(blog => blog.likes)
    const index = likes.indexOf(Math.max(...likes))
    return blogs[index]
}


const getAuthors = (blogs) => {
    let authors = []

    blogs.forEach(blog => {
        if(!authors.some(b => b === blog.author)) 
            authors.push(blog.author)
    })

    return authors
}

// receives an array of blogs, returns the author who has the largest amount of blogs
//  and the amount 

const mostBlogs = (blogs) => {

    const countblogs = (authors) => {
        let blogsCounts = Array(authors.length).fill(0)

        for(i=0; i<authors.length; i++){
            for(j=0; j<blogs.length; j++){
                if(authors[i] === blogs[j].author){
                    blogsCounts[i] += 1
                }
            }
        }
        return blogsCounts
    }

    let authors = getAuthors(blogs)
    let blogCounts = countblogs(authors)
    let maxblogs = Math.max(...blogCounts)
    let indexOfMax = blogCounts.indexOf(maxblogs)

    return {
        author: authors[indexOfMax],
        blogs: blogCounts[indexOfMax]
    }
}

// receives an array of blogs, returns the author who has the largest amount of likes
//  and the amount of likes

const mostLikes = (blogs) => {
    const countlikes = (authors) => {
        let blogslikes = Array(authors.length).fill(0)

        for(i=0; i<authors.length; i++){
            for(j=0; j<blogs.length; j++){
                if(authors[i] === blogs[j].author){
                    blogslikes[i] += blogs[j].likes
                }
            }
        }
        return blogslikes
    }

    let authors = getAuthors(blogs)
    let blogslikes = countlikes(authors)
    let maxlikes = Math.max(...blogslikes)
    let indexOfMax = blogslikes.indexOf(maxlikes)

    return {
        author: authors[indexOfMax],
        likes: blogslikes[indexOfMax]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}