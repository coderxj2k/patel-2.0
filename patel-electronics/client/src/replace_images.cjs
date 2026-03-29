const fs = require('fs');
const path = require('path');

const srcDir = 'g:/patel-electronics-main/patel-2.0/patel-electronics/client/src';

// The precise replacement mappings
const map = [
  { oldText: 'https://images.unsplash.com/photo-1584243027496-9645097a0054?w=800&h=600&fit=crop', newText: '/images/fridge.png', regex: /https:\/\/images\.unsplash\.com\/photo-1584243027496-9645097a0054\?w=800\&h=600\&fit=crop/g },
  { oldText: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800&h=600&fit=crop', newText: '/images/ac.png', regex: /https:\/\/images\.unsplash\.com\/photo-1580837119756-563d608dd119\?w=800\&h=600\&fit=crop/g },
  { oldText: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop', newText: '/images/washer.png', regex: /https:\/\/images\.unsplash\.com\/photo-1558618047-3c8c76ca7d13\?w=800\&h=600\&fit=crop/g },
  { oldText: 'https://images.unsplash.com/photo-1596786350986-224a6375b5fa?w=800&h=600&fit=crop', newText: '/images/tv.png', regex: /https:\/\/images\.unsplash\.com\/photo-1596786350986-224a6375b5fa\?w=800\&h=600\&fit=crop/g },
  
  // These were seen in other fallback files potentially for airpure or powerstation, or secondary images. Let's just use a product ID based mapping as a safety net.
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let origContent = content;

      // By Unsplash URL
      map.forEach(m => {
        content = content.replace(m.regex, m.newText);
      });

      // Also let's do a regex to replace any unsplash image inside images array for a specific product ID if possible, but actually we can just find where product IDs are and replace their 'image:' and 'images:' specifically.
      
      // Let's replace 'image: ...' blocks programmatically just to be safe if the URLs differ.
      content = content.replace(/id:\s*'frostline-fridge'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/fridge.png'"));
      content = content.replace(/id:\s*'airstream-ac'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/ac.png'"));
      content = content.replace(/id:\s*'silkguard-washer'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/washer.png'"));
      content = content.replace(/id:\s*'cinema-view-oled'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/tv.png'"));
      // Also cinemaview-tv in useFirebaseData
      content = content.replace(/id:\s*'cinemaview-tv'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/tv.png'"));
      
      content = content.replace(/id:\s*'airpure-pro'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/purifier.png'"));
      content = content.replace(/id:\s*'powerstation-elite'[\s\S]*?image:\s*'.*?'/g, match => match.replace(/image:\s*'.*?'/, "image: '/images/powerstation.png'"));

      // Same line matching for object properties where id isn't prior, e.g. some flat list of categories or products if any.

      if (content !== origContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated images in', file);
      }
    }
  }
}

// Second pass: Replace the generic secondary images in `images: [...]` arrays just to prevent generic photos from showing up in thumbnails
function processSecondaryImages(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processSecondaryImages(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let origContent = content;

      // Replace any Unsplash photo array with a single image or repeated image array because the generated image is high quality
      content = content.replace(/images:\s*\[[\s\S]*?\]/g, (match, offset, string) => {
        // Quick heuristics to know which image it is based on the block
        let textBefore = string.substring(Math.max(0, offset - 500), offset);
        let img = "https://images.unsplash.com/photo-1579952361667-8e92354ee5b6"; // default generic
        
        if (textBefore.includes('fridge')) img = '/images/fridge.png';
        else if (textBefore.includes('ac') || textBefore.includes('airstream')) img = '/images/ac.png';
        else if (textBefore.includes('washer') || textBefore.includes('fabric')) img = '/images/washer.png';
        else if (textBefore.includes('tv') || textBefore.includes('oled') || textBefore.includes('cinema')) img = '/images/tv.png';
        else if (textBefore.includes('airpure') || textBefore.includes('purifier')) img = '/images/purifier.png';
        else if (textBefore.includes('powerstation')) img = '/images/powerstation.png';
        
        return "images: [\n      '" + img + "',\n      '" + img + "',\n      '" + img + "',\n      '" + img + "'\n    ]";
      });

      if (content !== origContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated secondary images in', file);
      }
    }
  }
}

processDir(srcDir);
processSecondaryImages(srcDir);
console.log('Done!');
