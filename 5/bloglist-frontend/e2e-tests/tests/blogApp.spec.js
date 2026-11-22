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
})