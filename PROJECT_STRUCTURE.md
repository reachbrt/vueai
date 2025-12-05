# 📁 VueAI Project Structure

**Clean, organized, and professional folder structure**

---

## 🌳 Directory Tree

```
vueai/
│
├── 📦 packages/                    # All @aivue npm packages
│   ├── analytics/                  # AI-powered analytics
│   ├── autosuggest/                # Smart input suggestions
│   ├── chatbot/                    # AI chat components
│   ├── chatbot-server/             # Backend utilities
│   ├── chatbot-storage/            # Storage integration
│   ├── core/                       # Core AI functionality
│   ├── doc-intelligence/           # Document processing & OCR
│   ├── emotion-ui/                 # Emotion-aware UI
│   ├── image-caption/              # AI image captioning
│   ├── predictive-input/           # Predictive text input
│   ├── smart-datatable/            # Advanced data tables
│   ├── smart-notify/               # Intelligent notifications
│   ├── smartform/                  # AI form validation
│   └── voice-actions/              # Voice command integration
│
├── 🎨 demo/                        # Live demo application
│   ├── src/
│   │   ├── assets/images/          # Demo-specific images
│   │   ├── components/             # Demo components
│   │   └── views/                  # Demo pages
│   ├── dist/                       # Built demo files
│   ├── package.json                # Demo dependencies
│   └── vite.config.ts              # Demo build config
│
├── 🖼️ assets/                      # Project assets
│   ├── images/                     # Images and logos
│   │   ├── generated-icon.png      # Project icon
│   │   └── vueai-logo.svg          # VueAI logo
│   └── icons/                      # Icons (for future use)
│
├── ⚙️ config/                       # Configuration files
│   ├── components.json             # Shadcn UI configuration
│   ├── drizzle.config.ts           # Database configuration
│   └── vitest.config.ts            # Test configuration
│
├── 📚 docs/                        # Documentation
│   ├── AI_PROVIDERS.md             # AI provider integration guide
│   ├── DEMO_FIXES.md               # Demo fixes documentation
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── RELEASE_NOTES.md            # Release notes
│   ├── autosuggest.md              # Autosuggest docs
│   ├── chatbot.md                  # Chatbot docs
│   ├── contributing.md             # Contribution guidelines
│   ├── core.md                     # Core package docs
│   ├── getting-started.md          # Getting started guide
│   ├── migration-guide.md          # Migration guide
│   ├── smartform.md                # SmartForm docs
│   └── wiki-setup.md               # Wiki setup guide
│
├── 🔧 scripts/                     # Build and deployment scripts
│   ├── cleanup/                    # Cleanup scripts
│   ├── publish/                    # Publishing scripts
│   ├── setup/                      # Setup scripts
│   ├── deploy-netlify.sh           # Netlify deployment
│   └── README.md                   # Scripts documentation
│
├── 💻 client/                      # Client application
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilities
│   │   ├── packages/               # Package demos
│   │   ├── pages/                  # Application pages
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   └── index.html                  # HTML template
│
├── 🖥️ server/                      # Server code
│   ├── index.ts                    # Server entry point
│   ├── routes.ts                   # API routes
│   ├── storage.ts                  # Storage handlers
│   └── vite.ts                     # Vite server integration
│
├── 🗄️ db/                          # Database files
│   ├── index.ts                    # Database connection
│   └── seed.ts                     # Database seeding
│
├── 🔗 shared/                      # Shared utilities
│   └── schema.ts                   # Shared schemas
│
├── 📄 Root Configuration Files
│   ├── package.json                # Root package config
│   ├── package-lock.json           # Dependency lock file
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vite.config.ts              # Vite bundler config
│   ├── tailwind.config.ts          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS config
│   └── netlify.toml                # Netlify deployment config
│
└── 📖 Documentation Files
    ├── README.md                   # Main project README
    ├── CHANGELOG.md                # Version history
    ├── CLEANUP_SUMMARY.md          # Cleanup documentation
    └── PROJECT_STRUCTURE.md        # This file
```

---

## 📦 Package Structure

Each package in `packages/` follows this structure:

```
package-name/
├── src/
│   ├── components/                 # Vue components
│   ├── composables/                # Vue composables
│   ├── utils/                      # Utility functions
│   └── index.ts                    # Package entry point
├── dist/                           # Built files (generated)
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Build configuration
└── README.md                       # Package documentation
```

---

## 🎯 Key Principles

### **1. Separation of Concerns**
- Packages are isolated in `packages/`
- Demo is separate in `demo/`
- Assets organized in `assets/`
- Config files in `config/`

### **2. Clear Naming**
- Descriptive folder names
- Consistent structure across packages
- Logical grouping

### **3. Standard Practices**
- Common config files in root
- Documentation in `docs/`
- Scripts in `scripts/`

### **4. Maintainability**
- Easy to navigate
- Clear purpose for each folder
- Scalable structure

---

## 🔍 Quick Reference

| Need to find... | Look in... |
|----------------|------------|
| Package source code | `packages/<package-name>/src/` |
| Package documentation | `packages/<package-name>/README.md` |
| Demo application | `demo/` |
| Project images/logos | `assets/images/` |
| Configuration files | `config/` or root |
| Build scripts | `scripts/` |
| API documentation | `docs/` |
| Database files | `db/` |
| Server code | `server/` |

---

**Clean structure = Happy developers! 🎉**

