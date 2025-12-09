# GitHub Packages Setup Guide

This guide explains how to make your @aivue packages appear in the GitHub Packages sidebar.

## 📦 Current Status

All @aivue packages are published to **npm** and properly configured with repository links:

- ✅ @aivue/core
- ✅ @aivue/chatbot
- ✅ @aivue/autosuggest
- ✅ @aivue/smartform
- ✅ @aivue/image-caption
- ✅ @aivue/emotion-ui
- ✅ @aivue/doc-intelligence
- ✅ @aivue/predictive-input
- ✅ @aivue/smart-notify
- ✅ @aivue/voice-actions
- ✅ @aivue/analytics
- ✅ @aivue/smart-datatable
- ✅ @aivue/360-spin
- ✅ @aivue/chatbot-storage

## 🎯 How to Make Packages Appear in GitHub Sidebar

GitHub detects packages in two ways:

### Option 1: Wait for npm Detection (24-48 hours)
GitHub automatically scans npm registry and links packages that have the correct `repository` field. All your packages already have this configured, so they should appear within 24-48 hours.

### Option 2: Publish to GitHub Package Registry (Immediate)
Publish packages directly to GitHub Package Registry to make them appear immediately.

## 🚀 Publishing to GitHub Package Registry

### Step 1: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Package Publishing"
4. Select scopes:
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
   - ✅ `read:packages` - Download packages from GitHub Package Registry
   - ✅ `delete:packages` - Delete packages from GitHub Package Registry (optional)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Set Environment Variable

```bash
export GITHUB_TOKEN=your_token_here
```

### Step 3: Run the Publish Script

```bash
./scripts/publish-to-github.sh
```

This will:
1. Build all packages
2. Configure npm for GitHub Package Registry
3. Publish each package to GitHub
4. Clean up temporary files

### Step 4: Verify

Visit https://github.com/reachbrt?tab=packages to see your packages!

## 📝 Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
# Configure npm for GitHub Packages
echo "@aivue:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc

# Publish a specific package
cd packages/smart-datatable/dist
npm publish --registry=https://npm.pkg.github.com
```

## 🔄 GitHub Actions (Automated)

We've also created a GitHub Actions workflow (`.github/workflows/publish-packages.yml`) that automatically publishes packages when you push a version tag:

```bash
git tag v2.0.1
git push origin v2.0.1
```

Or trigger manually from GitHub Actions tab.

## 📊 Package Visibility

Once published to GitHub Package Registry, your packages will appear:

1. **Repository Sidebar** - Right side of https://github.com/reachbrt/vueai
2. **Packages Tab** - https://github.com/reachbrt?tab=packages
3. **Organization Packages** - https://github.com/orgs/aivue/packages (if you create an org)

## 🔗 Dual Publishing

You can publish to both npm and GitHub Package Registry:

- **npm** - For public consumption (`npm install @aivue/chatbot`)
- **GitHub** - For GitHub integration and visibility

Both registries can coexist with the same package versions.

## ⚠️ Important Notes

1. **Package Names**: GitHub Package Registry requires scoped packages (@aivue/*)
2. **Authentication**: Users need GitHub token to install from GitHub Packages
3. **Public Access**: Set `"publishConfig": { "access": "public" }` in package.json
4. **Repository Field**: Must match your GitHub repo URL

## 🎉 Success!

After publishing, your packages will appear in the GitHub sidebar within minutes!

Visit: https://github.com/reachbrt/vueai to see them.

