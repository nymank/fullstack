
const loginWith = async (page, username, password)  => {
    await page.getByRole("button", { name: "Log in" }).click()
    await page.getByLabel("username").fill(username)
    await page.getByLabel("password").fill(password)
    await page.getByRole("button", { name: "login" }).click()
}

const getCurrentTimeDateStr = () => {
    return `${new Date().toTimeString().slice(0, 8)} ${new Date().toDateString().slice(4)}`
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole("button", { name: "New blog" }).click()
    await page.getByRole("textbox", { name: "title" }).fill(title)
    await page.getByRole("textbox", { name: "author" }).fill(author)
    await page.getByRole("textbox", { name: "url" }).fill(url)
    await page.getByRole("button", { name: "Save" }).click()
    await page.getByText(`${title} ${author}`).waitFor()
}

const removeBlog = async (page, title, author, clickViewFirst=true) => {
    const titleAuthorHeading = `${title} ${author}`

    if(clickViewFirst) {
        await page.getByText(titleAuthorHeading).getByRole("button", { name: "view" }).click()
    }

    page.once("dialog", async (dialog) => {
        await dialog.accept()
    })
    await page.getByRole("button", { name: "remove" }).click()
    await page.keyboard.press("Enter")
}

export { loginWith, getCurrentTimeDateStr, createBlog, removeBlog }