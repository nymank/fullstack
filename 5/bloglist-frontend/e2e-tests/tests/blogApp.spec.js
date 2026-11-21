const { test, expect } = require("@playwright/test")

test.describe("Blog app", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173")
    })

    test("Login form is shown", async ({ page }) => {
        await page.getByText("Log in").click()

        await expect(page.getByText("username")).toBeVisible()
        await expect(page.getByText("password")).toBeVisible()
    })

    test("Login succeeds with correct credentials", async ({ page }) => {
        await page.getByText("Log in").click()

        await page.getByRole("textbox", { name: "username" }).fill("Calemakar8")
        await page.getByRole("textbox", { name: "password" }).fill("Calemakar8")

        await page.getByRole("button", { name: "login", exact: true }).click()

        await expect(page.getByText("Cale Makar logged in")).toBeVisible()
    })

    test("Login fails with incorrect credentials", async ({ page }) => {
        await page.getByText("Log in").click()

        await page.getByLabel("username").fill("Calemakar8")
        await page.getByLabel("password").fill("Calemakar7")

        await page.getByRole("button", { name: "login", exact: true }).click()

        await expect(page.getByText("Wrong credentials")).toBeVisible()
        await expect(page.getByText("Cale Makar logged in")).not.toBeVisible()
    })

    test("A new blog can be created", async ({ page }) => {
        await page.getByText("Log in").click()

        await page.getByLabel("username").fill("mluukkai")
        await page.getByLabel("password").fill("salainen")

        await page.getByRole("button", { name: "login", exact: true }).click()

        await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible()

        await page.getByText("New blog").click()

        // test fails if a blog exists with the same name, so let's do this
        const title = `Matti's blog ${Date.now()}`
        const author = "Matti Luukkainen"
        await page.getByRole("textbox", { name: "title" }).fill(title)
        await page.getByRole("textbox", { name: "author" }).fill(author)
        await page.getByRole("textbox", { name: "url" }).fill("https://MattiLuukkainen.com")
        await page.getByRole("button", { name: "Save", exact: true }).click()
        await expect(
            page.getByText(`A new blog ${title} by ${author} added`)
        ).toBeVisible()
        await expect(
            page.getByText(`${title} ${author}`)
        ).toBeVisible()
    })

    test("Blog can be liked", async ({ page }) => {
        await page.getByText("Log in").click()

        await page.getByLabel("username").fill("Calemakar8")
        await page.getByLabel("password").fill("Calemakar8")
        await page.getByRole("button", { name: "login", exact: true }).click()
        await expect(page.getByText("Cale Makar logged in")).toBeVisible()

        await page.getByRole("button", { name: "view", exact: true }).first().click()
        await page.getByRole("button", { name: "like", exact: true }).click()
    })
})