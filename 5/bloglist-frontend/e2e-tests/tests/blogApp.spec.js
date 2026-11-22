const { test, expect } = require("@playwright/test")
const { loginWith, getCurrentTimeDateStr, createBlog, removeBlog } = require("./helper")

test.describe("Blog app", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/")
    })

    test("Login form is shown", async ({ page }) => {
        await page.getByText("Log in").click()

        await expect(page.getByText("username")).toBeVisible()
        await expect(page.getByText("password")).toBeVisible()
    })

    test("Login succeeds with correct credentials", async ({ page }) => {
        await loginWith(page, "playwright", "playwright")

        await expect(page.getByText("Playwright logged in")).toBeVisible()
    })

    test("Login fails with incorrect credentials", async ({ page }) => {
        await loginWith(page, "playwright", "WRONGPASSWORD")

        await expect(page.getByText("Wrong credentials")).toBeVisible()
        await expect(page.getByText("Playwright logged in")).not.toBeVisible()
    })

    test("A new blog can be created and removed", async ({ page }) => {
        await loginWith(page, "playwright", "playwright")

        await expect(page.getByText("Playwright logged in")).toBeVisible()

        // test fails if a blog exists with the same name, so let's do this
        const title = `Playwright blog @ ${getCurrentTimeDateStr()}`
        const author = "Playwright"
        await createBlog(page, title, author, "https://playwright.com")

        await expect(
            page.getByText(`A new blog ${title} by ${author} added`)
        ).toBeVisible()
        await expect(
            page.getByText(`${title} ${author}`)
        ).toBeVisible()

        await removeBlog(page, title, author)
        await expect(page.getByText(`${title} ${author}`)).not.toBeVisible()
        await expect(page.getByText("Blog deleted")).toBeVisible()
    })

    test("Blog can be liked", async ({ page }) => {
        await loginWith(page, "playwright", "playwright")
        await expect(page.getByText("Playwright logged in")).toBeVisible()

        const title = `Playwright like button test ${getCurrentTimeDateStr()}`
        const author = "Playwright"
        await createBlog(page, title, author, "https://playwright.com")

        await page.getByText(`${title} ${author}`).getByRole("button", { name: "view" }).click()
        await expect(page.getByText("Likes: 0")).toBeVisible()

        await page.getByRole("button", { name: "like" }).click()
        await expect(page.getByText("Likes: 1")).toBeVisible()

        removeBlog(page, title, author, false)
        await expect(page.getByText(`${title} ${author}`)).not.toBeVisible()
        await expect(page.getByText("Blog deleted")).toBeVisible()
    })

    test("User that created the blog can exclusively remove it", async ({ page }) => {
        // log in with test user
        await loginWith(page, "playwright", "playwright")
        await expect(page.getByText("Playwright logged in")).toBeVisible()
        const title = `Playwright blog remove access test ${getCurrentTimeDateStr()}`
        const author = "Playwright"
        await createBlog(page, title, author, "https://playwright.com")
        await expect(
            page.getByText(`A new blog ${title} by ${author} added`)
        ).toBeVisible()
        await page.getByText(`${title} ${author}`).getByRole("button", { name: "view" }).click()
        await expect(page.getByRole("button", { name: "remove" })).toBeVisible()
        await page.getByRole("button", { name: "Logout" }).click()

        // log in with other test user
        await loginWith(page, "playwright2", "playwright2")
        await expect(page.getByText("Playwright 2 logged in")).toBeVisible()
        await page.getByText(`${title} ${author}`).getByRole("button", { name: "view" }).click()
        await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible()
        await page.getByRole("button", { name: "Logout" }).click()

        // and again with first user
        await loginWith(page, "playwright", "playwright")
        await expect(page.getByText("Playwright logged in")).toBeVisible()
        await removeBlog(page, title, author)
    })

    test("Blogs are sorted descending by likes", async ({ page }) => {
        // create 3 blogs and give them different like counts
        await loginWith(page, "playwright", "playwright")
        await expect(page.getByText("Playwright logged in")).toBeVisible()

        const author = "Playwright"

        const title1 = `Playwright like sorting blog 1 ${getCurrentTimeDateStr()}`
        await createBlog(page, title1, author, "https://playwright.com")
        await page.getByText(`${title1} ${author}`).getByRole("button", { name: "view" }).click()
        await page.getByRole("button", { name: "like" }).click()
        await expect(page.getByText("Likes: 1")).toBeVisible()
        await page.getByText(`${title1} ${author}`).getByRole("button", { name: "hide" }).click()

        const title2 = `Playwright like sorting blog 2 ${getCurrentTimeDateStr()}`
        await createBlog(page, title2, author, "https://playwright.com")
        await page.getByText(`${title2} ${author}`).getByRole("button", { name: "view" }).click()
        await page.getByRole("button", { name: "like" }).click()
        await page.getByRole("button", { name: "like" }).click()
        await expect(page.getByText("Likes: 2")).toBeVisible()
        await page.getByText(`${title2} ${author}`).getByRole("button", { name: "hide" }).click()

        const title3 = `Playwright like sorting blog 3 ${getCurrentTimeDateStr()}`
        await createBlog(page, title3, author, "https://playwright.com")
        await page.getByText(`${title3} ${author}`).getByRole("button", { name: "view" }).click()
        await page.getByRole("button", { name: "like" }).click()
        await page.getByRole("button", { name: "like" }).click()
        await page.getByRole("button", { name: "like" }).click()
        await expect(page.getByText("Likes: 3")).toBeVisible()
        await page.getByText(`${title3} ${author}`).getByRole("button", { name: "hide" }).click()

        // log in with other test user
        await page.getByRole("button", { name: "Logout" }).click()
        await loginWith(page, "playwright2", "playwright2")
        await expect(page.getByText("Playwright 2 logged in")).toBeVisible()

        // check that the created blogs are sorted in descending order
        const blogTitles = await page.locator(".blog").allTextContents()

        const index1 = blogTitles.findIndex(text => text.includes(title1))
        const index2 = blogTitles.findIndex(text => text.includes(title2))
        const index3 = blogTitles.findIndex(text => text.includes(title3))

        expect(index3).toBeGreaterThanOrEqual(0)
        expect(index2).toBeGreaterThanOrEqual(0)
        expect(index1).toBeGreaterThanOrEqual(0)

        expect(index3).toBeLessThan(index2)
        expect(index2).toBeLessThan(index1)

        // delete test blogs
        await page.getByRole("button", { name: "Logout" }).click()

        await loginWith(page, "playwright", "playwright")
        await expect(page.getByText("Playwright logged in")).toBeVisible()

        await removeBlog(page, title1, author)
        await expect(page.getByText(`${title1} ${author}`)).not.toBeVisible()
        await expect(page.getByText("Blog deleted")).toBeVisible()

        await removeBlog(page, title2, author)
        await expect(page.getByText(`${title1} ${author}`)).not.toBeVisible()
        await expect(page.getByText("Blog deleted")).toBeVisible()

        await removeBlog(page, title3, author)
        await expect(page.getByText(`${title3} ${author}`)).not.toBeVisible()
        await expect(page.getByText("Blog deleted")).toBeVisible()
    })
})