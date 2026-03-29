const fs = require('fs');
const path = require('path');

const dir = 'g:/patel-electronics-main/patel-2.0/patel-electronics/client/src';
const files = [
  'App.jsx',
  'ProductsPage.jsx',
  'ProductDetail.jsx',
  'Store.jsx',
  'Support.jsx',
  'Cart.jsx',
  'Checkout.jsx',
  'OrderConfirmation.jsx',
  'UserOrders.jsx',
  'Login.jsx',
  'Profile.jsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the <header> block entirely
  const origContent = content;
  content = content.replace(/<header className="top-bar">[\s\S]*?<\/header>/g, '<Navbar />');
  
  if (content !== origContent) {
    // Add import statement at the top if not there
    if (!content.includes('import Navbar')) {
      // Find the last import
      const importsStr = content.match(/^import .*?;?\n/gm);
      if (importsStr) {
        const lastImport = importsStr[importsStr.length - 1];
        content = content.replace(lastImport, lastImport + "import Navbar from './Navbar.jsx';\n");
      } else {
        content = "import Navbar from './Navbar.jsx';\n" + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('No header found in ' + file);
  }
});
