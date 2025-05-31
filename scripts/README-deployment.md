# Netlify Deployment Guide for @aivue Packages

This guide documents the successful deployment process for the @aivue demo to Netlify.

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# Make script executable
chmod +x scripts/deploy-netlify.sh

# Run deployment
./scripts/deploy-netlify.sh
```

### Option 2: Manual Netlify CLI

```bash
# Build packages
npm run build:packages

# Build demo
cd demo
npm install
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=dist --site=9f08866c-e889-408a-959e-32d8e3f3ab49
```

### Option 3: Manual Upload

1. Build the demo: `cd demo && npm run build`
2. Create zip: `cd dist && zip -r ../demo-deploy.zip .`
3. Upload to Netlify dashboard manually

## 📋 Deployment Configuration

### Netlify Settings

- **Site ID**: `9f08866c-e889-408a-959e-32d8e3f3ab49`
- **Site Name**: `aivue`
- **URL**: https://aivue.netlify.app
- **Build Command**: `cd demo && npm install && npm run build`
- **Publish Directory**: `demo/dist`
- **Node Version**: `18`

### Environment Variables

```toml
[build.environment]
NODE_VERSION = "18"
NPM_FLAGS = "--production=false"
```

### Build Command (netlify.toml)

```toml
[build]
  publish = "demo/dist"
  command = "cd demo && rm -rf node_modules && npm install && npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🎯 Successful Deployment Features

### ✅ What's Deployed

- **@aivue/core** - Core AI functionality
- **@aivue/chatbot** - Interactive chat components
- **@aivue/autosuggest** - AI-powered suggestions
- **@aivue/smartform** - Smart form validation
- **@aivue/analytics** - Real-time analytics dashboard

### 📊 Analytics Demo Features

- **Real-time Event Tracking** - Track user interactions
- **AI-powered Insights** - Generate intelligent analysis
- **Interactive Dashboard** - Beautiful metrics display
- **Data Export** - JSON export functionality
- **Conversation Analytics** - Sentiment and topic analysis
- **Performance Monitoring** - Response time tracking

### 🎮 Interactive Demo Controls

- **Simulate User Interaction** - Creates interaction events
- **Simulate AI Request** - Generates AI request/response events
- **Generate AI Insights** - Shows AI-powered analysis
- **Export Analytics Data** - Downloads analytics as JSON

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clean install
   cd demo
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Netlify CLI Not Found**
   ```bash
   npm install -g netlify-cli
   ```

3. **Authentication Issues**
   ```bash
   netlify login
   ```

4. **Large Bundle Warning**
   - Bundle size: ~555KB (acceptable for demo)
   - Consider code splitting for production

### Build Verification

```bash
# Check build output
ls -la demo/dist/

# Should contain:
# - index.html
# - assets/ (CSS, JS, images)
```

## 📈 Performance Metrics

### Successful Build Stats

- **Build Time**: ~2.17s
- **Deploy Time**: ~5.4s
- **Bundle Size**: 554.63 kB (gzipped: 207.88 kB)
- **Assets**: 5 files total

### Optimization Notes

- CSS: 61.01 kB (gzipped: 11.30 kB)
- JS: 554.63 kB (gzipped: 207.88 kB)
- Images: 5.58 kB (gzipped: 1.40 kB)

## 🔗 Links

- **Live Demo**: https://aivue.netlify.app
- **Netlify Dashboard**: https://app.netlify.com/sites/aivue
- **GitHub Repository**: https://github.com/reachbrt/vueai
- **npm Packages**: https://www.npmjs.com/org/aivue

## 📝 Deployment Checklist

- [ ] All packages built successfully
- [ ] Demo dependencies installed
- [ ] Demo builds without errors
- [ ] Netlify CLI available
- [ ] Site ID configured correctly
- [ ] Deploy completes successfully
- [ ] Analytics tab visible on live site
- [ ] All interactive features working
- [ ] No console errors in browser

## 🎉 Success Indicators

When deployment is successful, you should see:

1. **Analytics tab** in the navigation (📊 icon)
2. **Interactive demo controls** working
3. **Real-time event tracking** functional
4. **Live metrics** updating
5. **No console errors** in browser dev tools

## 🔄 Future Deployments

For future deployments, simply run:

```bash
./scripts/deploy-netlify.sh
```

This will:
1. Build all packages
2. Install demo dependencies
3. Build demo
4. Deploy to Netlify
5. Generate deployment summary

The deployment process is now standardized and repeatable! 🚀
