
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');

try {
  // Read the existing package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the build script if it doesn't exist
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  packageJson.scripts.build = 'node build.js';
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Build script added successfully to package.json');
  console.log('You can now run: npm run build');
} catch (error) {
  console.error('Failed to update package.json:', error);
}
