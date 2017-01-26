var path = require('path');
var ncp = require('ncp');
var mkdirp = require('mkdirp');
var fs = require('fs');

// Paths
var src_base = path.join(__dirname, '..', '..', '..', 'Assets', 'Packages');
var dst_base = path.join(__dirname, '..', 'src');

// Function: Check file or directory exists
var isExists = function(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
  return false;
};

// Function: Check path is directory or not
var isDirectory = function(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
  return false;
};

// Function: Copy files recursive
var copyFile = function(path_src, path_dst) {
  ncp(path_src, path_dst, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
};

// Read 'package.json'
fs.readFile('package.json', { 'encoding': 'utf8' }, function(err, data) {
  // Exit: If occurs read error
  if (err) {
    console.error(err);
    process.exit(1);
  }

  var package_json = JSON.parse(data);

  // Exit: If 'files' node does not exists or empty
  if (!package_json || !package_json.files || 0 == package_json.files.length) {
    console.error('Could not found file / directory list in "package.json"');
    process.exit(1);
  }

  // Each 'files' node entry
  package_json.files.forEach(function(file) {
    var src = path.join(src_base, file);
    var dst = path.join(dst_base, file);
    // Exit: If source file does not exists
    if (!isExists(src)) {
      console.error('Source file / directory could not found: ["' + src + '"]');
      process.exit(1);
    }

    // Copy file
    // Create directory if needed
    if (isDirectory(src) && !isExists(dst)) {
      mkdirp(dst, function(err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        copyFile(src, dst);
      });
    } else {
      copyFile(src, dst);
    }
  });
});
