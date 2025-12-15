#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get environment variables
const protocol = process.env.REACT_APP_SERVER_PROTOCOL || 'http';
const ip = process.env.REACT_APP_SERVER_IP || '127.0.0.1';
const port = process.env.REACT_APP_SERVER_PORT || '8443';

const buildDir = path.join(__dirname, 'build');

console.log(`Injecting config: ${protocol}://${ip}:${port}`);

// Function to recursively find and replace in files
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace common patterns - webpack replaces process.env with string literals
    const patterns = [
      // Direct URL replacements (most common)
      { from: /http:\/\/127\.0\.0\.1:8443/g, to: `${protocol}://${ip}:${port}` },
      { from: /http:\/\/localhost:8443/g, to: `${protocol}://${ip}:${port}` },
      { from: /https:\/\/127\.0\.0\.1:8443/g, to: `${protocol}://${ip}:${port}` },
      { from: /https:\/\/localhost:8443/g, to: `${protocol}://${ip}:${port}` },
      
      // Template literal patterns (backtick strings in code)
      { from: new RegExp('`http://127\\.0\\.0\\.1:8443`', 'g'), to: '`' + protocol + '://' + ip + ':' + port + '`' },
      { from: new RegExp('`http://localhost:8443`', 'g'), to: '`' + protocol + '://' + ip + ':' + port + '`' },
      { from: new RegExp('`https://127\\.0\\.0\\.1:8443`', 'g'), to: '`' + protocol + '://' + ip + ':' + port + '`' },
      { from: new RegExp('`https://localhost:8443`', 'g'), to: '`' + protocol + '://' + ip + ':' + port + '`' },
      
      // Webpack concatenated string patterns (process.env replacements)
      { from: /"http"\+"\/\/"\+"127\.0\.0\.1"\+":"\+"8443"/g, to: `"${protocol}://${ip}:${port}"` },
      { from: /"http"\+"\/\/"\+"localhost"\+":"\+"8443"/g, to: `"${protocol}://${ip}:${port}"` },
      { from: /"https"\+"\/\/"\+"127\.0\.0\.1"\+":"\+"8443"/g, to: `"${protocol}://${ip}:${port}"` },
      { from: /"https"\+"\/\/"\+"localhost"\+":"\+"8443"/g, to: `"${protocol}://${ip}:${port}"` },
      
      // Pattern with variables (process.env.REACT_APP_SERVER_PROTOCOL + "://" + ...)
      { from: /"http"\+"\/\/"\+"127\.0\.0\.1"\+":"\+"8443"/g, to: `"${protocol}://${ip}:${port}"` },
      
      // Escaped patterns
      { from: /\\"http:\\\/\\\/127\\.0\\.0\\.1:8443\\"/g, to: `\\"${protocol}://${ip}:${port}\\"` },
      
      // Minified patterns (no spaces)
      { from: /http:\/\/127\.0\.0\.1:8443/g, to: `${protocol}://${ip}:${port}` },
    ];

    patterns.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    // Ignore errors for binary files
  }
}

// Function to walk directory
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.js') || file.endsWith('.html')) {
      callback(filePath);
    }
  });
}

// Inject config into HTML files
function injectConfigIntoHTML(htmlPath) {
  try {
    let content = fs.readFileSync(htmlPath, 'utf8');
    const configScript = `<script>window.__REACT_APP_CONFIG__={SERVER_PROTOCOL:'${protocol}',SERVER_IP:'${ip}',SERVER_PORT:'${port}'};</script>`;
    
    if (!content.includes('window.__REACT_APP_CONFIG__')) {
      content = content.replace('</head>', `${configScript}</head>`);
      fs.writeFileSync(htmlPath, content, 'utf8');
      console.log(`Injected config into: ${htmlPath}`);
    }
  } catch (err) {
    console.error(`Error processing ${htmlPath}:`, err.message);
  }
}

// Process all files
if (fs.existsSync(buildDir)) {
  // Process JS files
  const jsDir = path.join(buildDir, 'static', 'js');
  if (fs.existsSync(jsDir)) {
    walkDir(jsDir, replaceInFile);
  }
  
  // Process HTML files
  const htmlFiles = fs.readdirSync(buildDir).filter(f => f.endsWith('.html'));
  htmlFiles.forEach(file => {
    injectConfigIntoHTML(path.join(buildDir, file));
  });
  
  console.log('Config injection completed!');
} else {
  console.error('Build directory not found!');
  process.exit(1);
}

