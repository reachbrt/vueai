# Setting Up the GitHub Wiki

Follow these steps to set up the GitHub Wiki for the AIVue project:

## Step 1: Create the Wiki Pages

1. Go to your GitHub repository: https://github.com/reachbrt/vueai
2. Click on the "Wiki" tab in the top navigation bar
3. If the wiki hasn't been created yet, click on "Create the first page"
4. Otherwise, click on "New Page" to create additional pages

## Step 2: Add the Home Page

1. If creating the first page, the title will be "Home" by default
2. Otherwise, create a new page with the title "Home"
3. Copy the content from the `WIKI_HOME.md` file
4. Click "Save Page"

## Step 3: Add the Getting Started Page

1. Click on "New Page"
2. Set the title to "Getting Started"
3. Copy the content from the `WIKI_GETTING_STARTED.md` file
4. Click "Save Page"

## Step 4: Add the Core Package Page

1. Click on "New Page"
2. Set the title to "Core"
3. Copy the content from the `WIKI_CORE.md` file
4. Click "Save Page"

## Step 5: Add the Chatbot Package Page

1. Click on "New Page"
2. Set the title to "Chatbot"
3. Copy the content from the `WIKI_CHATBOT.md` file
4. Click "Save Page"

## Step 6: Add the Migration Guide Page

1. Click on "New Page"
2. Set the title to "Migration Guide"
3. Copy the content from the `WIKI_MIGRATION_GUIDE.md` file
4. Click "Save Page"

## Step 7: Add the Contributing Guide Page

1. Click on "New Page"
2. Set the title to "Contributing"
3. Copy the content from the `WIKI_CONTRIBUTING.md` file
4. Click "Save Page"

## Step 8: Create Additional Pages (Optional)

You can create additional pages for the other packages and topics:

- Autosuggest
- Smartform
- Advanced Configuration
- Examples
- FAQ

## Step 9: Set Up the Sidebar

1. Create a new page with the title "_Sidebar"
2. Add the following content:

```markdown
### AIVue Documentation

* [Home](Home)
* [Getting Started](Getting-Started)
* **Packages**
  * [@aivue/core](Core)
  * [@aivue/chatbot](Chatbot)
  * [@aivue/autosuggest](Autosuggest)
  * [@aivue/smartform](Smartform)
* **Guides**
  * [Advanced Configuration](Advanced-Configuration)
  * [Migration Guide](Migration-Guide)
* **Community**
  * [Contributing](Contributing)
  * [Examples](Examples)
  * [FAQ](FAQ)
```

3. Click "Save Page"

## Step 10: Set Up the Footer

1. Create a new page with the title "_Footer"
2. Add the following content:

```markdown
[AIVue](https://github.com/reachbrt/vueai) | [npm](https://www.npmjs.com/package/@aivue/core) | [License](https://github.com/reachbrt/vueai/blob/main/LICENSE)
```

3. Click "Save Page"

## Step 11: Clone the Wiki Repository (Optional)

If you want to manage the wiki locally:

1. Clone the wiki repository:
   ```bash
   git clone https://github.com/reachbrt/vueai.wiki.git
   ```
2. Make changes locally
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update wiki"
   git push origin main
   ```

## Step 12: Add Wiki Link to README

Add a link to the wiki in your repository's README.md file:

```markdown
## Documentation

For detailed documentation, please visit the [Wiki](https://github.com/reachbrt/vueai/wiki).
```

## Step 13: Announce the Wiki

Let users know about the new documentation:

1. Create an issue or discussion on GitHub
2. Update the repository description to mention the wiki
3. Add a link to the wiki in your npm package descriptions

## Additional Tips

- Keep the wiki up to date with code changes
- Use consistent formatting and style
- Add images and diagrams where helpful
- Link between pages to create a cohesive documentation
- Consider adding a search feature using GitHub's search functionality
