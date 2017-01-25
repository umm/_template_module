var path = require('path');
var ncp = require('ncp');
var fs = require('fs');

// Paths
var src_base = path.join(__dirname, '..', '..', '..', 'Assets', 'Packages');
var dst_base = path.join(__dirname, '..', 'src');

var exists = function(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
  return false;
};

// Target files and directories in the destination directory
fs.readdir(dst_base, function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  if (!files || 0 == files.length) {
    console.error('Any files or directories does not exists in "' + dst_base + '".');
    process.exit(1);
  }

  files.forEach(function(file) {
    var src = path.join(src_base, file);
    var dst = path.join(dst_base, file);
    if (!exists(src)) {
      console.error('Source files or directories does not exists: "' + src + '"');
      process.exit(1);
    }
    ncp(src, dst, function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    })
  });
});
