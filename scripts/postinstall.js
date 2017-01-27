import mkdirp from 'mkdirp';
import path from 'path';
import ncp from 'ncp';

// Paths
let src = path.join(__dirname, '..', 'src');
let dir = path.join(__dirname, '..', '..', '..', 'Assets', 'Packages');

// Create folder if missing
mkdirp(dir, (err) => {
  if (err) {
    console.error(err)
    process.exit(1);
  }

  // Copy files
  ncp(src, dir, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
