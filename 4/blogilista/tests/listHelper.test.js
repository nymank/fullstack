const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/listHelper")

describe("List helper tests", () => {
	const blogs = [
		{
			_id: "5a422aa71b54a676234d17f8",
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
			likes: 1,
			__v: 0
		},
		{
			_id: "6a3acbd36d6650ba96637655",
			title: "Nuuskiksen blogi",
			author: "Nuuskamuikkunen",
			url: "https://nuuskiksenblogi.fi",
			likes: 2,
		},
		{
			_id: "6a3acbf1823bcdbd3361c53c",
			title: "Muumipeikon blogi",
			author: "Muumipeikko",
			url: "https://muumipeikonblogi.fi",
			likes: 3,
		},
	].sort((a, b) => a.likes - b.likes)

	test("likes of empty list is 0", () => {
		const result = listHelper.totalLikes([])
		assert.strictEqual(result, 0)
	})

	test("returns likes of a single blog", () => {
		const result = listHelper.totalLikes(blogs.slice(0, 1))
		assert.strictEqual(result, blogs[0].likes)
	})

	test("correctly calculates total likes of multiple blogs", () => {
		const result = listHelper.totalLikes(blogs)
		assert.strictEqual(result, 6)
	})

	test("returns the favourite blog", () => {
		const result = listHelper.favoriteBlog(blogs)
		assert.deepStrictEqual(result, blogs[blogs.length-1])
	})

	test("favoriteBlog returns the null if empty blogs", () => {
		const result = listHelper.favoriteBlog([])
		assert.strictEqual(result, null)
	})
})