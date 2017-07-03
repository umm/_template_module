var mkdirp = require('mkdirp');
var path = require('path');
var ncp = require('ncp');

// Finish if development installation
if ('node_modules' != path.basename(path.dirname(process.cwd()))) {
  return;
}
// Paths
var source = path.join(__dirname, '..', 'Assets');
var destination = path.join(__dirname, '..', '..', '..', 'Assets', 'Packages');

// Create folder if missing
mkdirp(destination, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // Copy files
  ncp(source, destination, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
