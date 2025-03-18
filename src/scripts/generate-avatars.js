nconst fs = require('fs');
const path = require('path');
const Identicon = require('identicon.js');

// Function to generate an identicon avatar
function generateAvatar(name, size = 64) {
  // Use the name as a hash input
  const hash = Buffer.from(name).toString('hex').substring(0, 16).padEnd(16, '0');
  const options = {
    size: size,
    format: 'png'
  };
  
  return new Identicon(hash, options).toString();
}

// Names for our avatars
const names = [
  'alex',
  'morgan',
  'jamie',
  'taylor',
  'jordan',
  'placeholder'
];

// Create avatars directory if it doesn't exist
const avatarsDir = path.join(__dirname, '../../public/avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Generate avatars
names.forEach(name => {
  const avatar = generateAvatar(name);
  const avatarPath = path.join(avatarsDir, `${name}.jpg`);
  
  // Convert base64 to image file
  const data = avatar.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(avatarPath, Buffer.from(data, 'base64'));
  console.log(`Generated avatar for ${name} at ${avatarPath}`);
});

console.log('All avatars generated successfully!'); 