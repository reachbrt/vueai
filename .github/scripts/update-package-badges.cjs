#!/usr/bin/env node

/**
 * Script to update package README badges:
 * 1. Remove codecov badges
 * 2. Fix Netlify Status badge to use shields.io format
 */

const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../../packages');

// Get all package directories
const packageDirs = fs.readdirSync(packagesDir).filter(dir => {
  const fullPath = path.join(packagesDir, dir);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Found ${packageDirs.length} packages to update...\n`);

let updatedCount = 0;

packageDirs.forEach(packageName => {
  const readmePath = path.join(packagesDir, packageName, 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    console.log(`⚠️  ${packageName}: No README.md found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(readmePath, 'utf8');
  let modified = false;
  
  // 1. Remove codecov badge lines
  const codecovPatterns = [
    // Pattern 1: codecov badge on its own line (markdown)
    /\[!\[codecov\]\(https:\/\/codecov\.io\/gh\/reachbrt\/vueai\/graph\/badge\.svg\?token=[^\)]+\)\]\(https:\/\/codecov\.io\/gh\/reachbrt\/vueai\)\n/g,
    // Pattern 2: codecov badge inline with other badges (HTML)
    /\n?\s*<a href="https:\/\/codecov\.io\/gh\/reachbrt\/vueai"><img src="https:\/\/codecov\.io\/gh\/reachbrt\/vueai\/graph\/badge\.svg\?token=[^"]+" alt="codecov"><\/a>\n?/g,
    // Pattern 3: codecov badge with different formatting
    /\n?\s*\[!\[codecov\]\(https:\/\/codecov\.io\/gh\/reachbrt\/vueai\/[^\)]+\)\]\(https:\/\/codecov\.io\/gh\/reachbrt\/vueai\)\n?/g,
  ];

  codecovPatterns.forEach(pattern => {
    if (content.match(pattern)) {
      content = content.replace(pattern, '\n');
      modified = true;
    }
  });
  
  // 2. Fix spacing issues (badges merged on same line)
  // Add newline before Netlify badge if it's directly after another badge
  content = content.replace(/(\]\([^)]+\))\[!\[Netlify Status\]/g, '$1\n[![Netlify Status');

  // 3. Fix Netlify Status badge - replace with shields.io format
  const netlifyPatterns = [
    // Pattern 1: Netlify API badge (most common)
    {
      pattern: /\[!\[Netlify Status\]\(https:\/\/api\.netlify\.com\/api\/v1\/badges\/[a-f0-9-]+\/deploy-status\)\]\(https:\/\/[^)]+\)/g,
      replacement: '[![Netlify Status](https://img.shields.io/netlify/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded?style=flat-square&logo=netlify)](https://aivue.netlify.app/)'
    },
    // Pattern 2: HTML format Netlify badge
    {
      pattern: /<a href="https:\/\/app\.netlify\.com\/sites\/[^"]+"><img src="https:\/\/api\.netlify\.com\/api\/v1\/badges\/[a-f0-9-]+\/deploy-status" alt="Netlify Status"><\/a>/g,
      replacement: '<a href="https://aivue.netlify.app/"><img src="https://img.shields.io/netlify/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded?style=flat-square&logo=netlify" alt="Netlify Status"></a>'
    },
    // Pattern 3: Different Netlify badge ID
    {
      pattern: /\[!\[Netlify Status\]\(https:\/\/api\.netlify\.com\/api\/v1\/badges\/9f08866c-e889-408a-959e-32d8e3f3ab49\/deploy-status\)\]\(https:\/\/[^)]+\)/g,
      replacement: '[![Netlify Status](https://img.shields.io/netlify/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded?style=flat-square&logo=netlify)](https://aivue.netlify.app/)'
    }
  ];

  netlifyPatterns.forEach(({ pattern, replacement }) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(readmePath, content, 'utf8');
    console.log(`✅ ${packageName}: Updated badges`);
    updatedCount++;
  } else {
    console.log(`   ${packageName}: No changes needed`);
  }
});

console.log(`\n✅ Updated ${updatedCount} package README files!`);

