#!/usr/bin/env node

/**
 * Script to fetch combined npm download counts for all @aivue packages
 * and update the README.md with actual numbers
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const packages = [
  '@aivue/core',
  '@aivue/chatbot',
  '@aivue/autosuggest',
  '@aivue/smartform',
  '@aivue/image-caption',
  '@aivue/emotion-ui',
  '@aivue/doc-intelligence',
  '@aivue/analytics',
  '@aivue/360-spin',
  '@aivue/predictive-input',
  '@aivue/smart-datatable',
  '@aivue/smart-notify',
  '@aivue/voice-actions',
  '@aivue/chatbot-server',
  '@aivue/chatbot-storage'
];

function fetchDownloads(packageName, period = 'last-month') {
  return new Promise((resolve, reject) => {
    const url = `https://api.npmjs.org/downloads/point/${period}/${packageName}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.downloads || 0);
        } catch (e) {
          console.error(`Error parsing data for ${packageName}:`, e);
          resolve(0);
        }
      });
    }).on('error', (e) => {
      console.error(`Error fetching ${packageName}:`, e);
      resolve(0);
    });
  });
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

async function main() {
  console.log('Fetching download counts for all @aivue packages...\n');
  
  // Fetch last month downloads
  const monthlyPromises = packages.map(pkg => fetchDownloads(pkg, 'last-month'));
  const monthlyDownloads = await Promise.all(monthlyPromises);
  const totalMonthly = monthlyDownloads.reduce((sum, count) => sum + count, 0);
  
  // Fetch total downloads (from 2020-01-01)
  const totalPromises = packages.map(pkg => fetchDownloads(pkg, '2020-01-01:2099-12-31'));
  const totalDownloads = await Promise.all(totalPromises);
  const totalAll = totalDownloads.reduce((sum, count) => sum + count, 0);
  
  console.log('Download Statistics:');
  console.log('===================');
  packages.forEach((pkg, i) => {
    console.log(`${pkg}: ${monthlyDownloads[i].toLocaleString()} (last month) | ${totalDownloads[i].toLocaleString()} (total)`);
  });
  console.log('===================');
  console.log(`TOTAL (Last Month): ${totalMonthly.toLocaleString()}`);
  console.log(`TOTAL (All Time): ${totalAll.toLocaleString()}`);
  console.log('===================\n');
  
  // Update README.md
  const readmePath = path.join(__dirname, '../../README.md');
  let readme = fs.readFileSync(readmePath, 'utf8');
  
  // Create badge URLs with actual numbers
  const monthlyBadge = `https://img.shields.io/badge/downloads-${formatNumber(totalMonthly)}%2Fmonth-CB3837?style=flat-square&logo=npm&label=npm%20downloads`;
  const totalBadge = `https://img.shields.io/badge/total%20downloads-${formatNumber(totalAll)}-CB3837?style=flat-square&logo=npm`;

  const npmStatUrl = 'https://npm-stat.com/charts.html?package=%40aivue%2Fcore&package=%40aivue%2Fchatbot&package=%40aivue%2Fautosuggest&package=%40aivue%2Fsmartform&package=%40aivue%2Fimage-caption&package=%40aivue%2Femotion-ui&package=%40aivue%2Fdoc-intelligence&package=%40aivue%2Fanalytics&package=%40aivue%2F360-spin&package=%40aivue%2Fpredictive-input&package=%40aivue%2Fsmart-datatable&package=%40aivue%2Fsmart-notify&package=%40aivue%2Fvoice-actions&from=2020-01-01';

  // Replace the monthly download badge
  const monthlyPattern = /(<a href="https:\/\/npm-stat\.com\/charts\.html[^"]+"><img src=")https:\/\/img\.shields\.io\/badge\/downloads-[^"]+(">)/;
  readme = readme.replace(monthlyPattern, `$1${monthlyBadge}$2`);

  // Replace the total download badge
  const totalPattern = /(<a href="https:\/\/npm-stat\.com\/charts\.html[^"]+"><img src=")https:\/\/img\.shields\.io\/badge\/total%20downloads-[^"]+(">)/;
  readme = readme.replace(totalPattern, `$1${totalBadge}$2`);
  
  // Save the updated README
  fs.writeFileSync(readmePath, readme, 'utf8');
  
  console.log('✅ README.md updated with latest download counts!');
  console.log(`   Monthly: ${formatNumber(totalMonthly)}/month`);
  console.log(`   Total: ${formatNumber(totalAll)}`);
  
  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `monthly_downloads=${totalMonthly}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `total_downloads=${totalAll}\n`);
  }
}

main().catch(console.error);

