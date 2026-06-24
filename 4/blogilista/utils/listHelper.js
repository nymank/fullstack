
const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc += curr.likes, 0)

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return null

	return blogs.reduce((max, blog) =>
		blog.likes > max.likes ? blog : max
	)
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return null

	const counts = blogs.reduce((acc, blog) => {
		acc[blog.author] = (acc[blog.author] || 0) + 1
		return acc
	}, {})

	const [author, blogCount] = Object.entries(counts).reduce(
		(max, current) => current[1] > max[1] ? current : max
	)

	return {
		author,
		blogs: blogCount,
	}
}

module.exports = {
	totalLikes,
	favoriteBlog,
	mostBlogs
}