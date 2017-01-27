import path from 'path';
import ncp from 'ncp';
import mkdirp from 'mkdirp';
import fs from 'fs';

// Paths
let src_base = path.join(__dirname, '..', '..', '..', 'Assets', 'Packages');
let dst_base = path.join(__dirname, '..', 'src');

// Function: Check file or directory exists
let isExists = (path) => {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
  return false;
};

// Function: Check path is directory or not
let isDirectory = (path) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
  return false;
};

// Function: Copy files recursive
let copyFile = (path_src, path_dst) => {
  ncp(path_src, path_dst, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
};

// Read 'package.json'
fs.readFile('package.json', { 'encoding': 'utf8' }, (err, data) => {
  // Exit: If occurs read error
  if (err) {
    console.error(err);
    process.exit(1);
  }

  let package_json = JSON.parse(data);

  // Exit: If failure to parse 'package.json'
  if (!package_json) {
    console.error("Failure to parse 'package.json'");
    process.exit(1);
  }
  // Exit: If 'name' node does not changed from 'unity-package-template'
  if ('__PACKAGE_NAME__' == package_json.name) {
    console.error("You must change 'name' node in 'package.json'");
    process.exit(1);
  }
  // Exit: If 'files' node does not exists or empty
  if (!package_json.files || 0 == package_json.files.length) {
    console.error("'files' node does not exists or empty in 'package.json'");
    process.exit(1);
  }

  // Each 'files' node entry
  package_json.files.forEach((file) => {
    if (/^(scripts|src)$/.test(file)) {
      return;
    }
    var src = path.join(src_base, file);
    var dst = path.join(dst_base, file);
    // Exit: If source file does not exists
    if (!isExists(src)) {
      console.error(`Source file does not found: [${src}]`);
      process.exit(1);
    }

    // Copy file
    // Create directory if needed
    if (isDirectory(src) && !isExists(dst)) {
      mkdirp(dst, (err) => {
        // Exit: If failure to create directory
        if (err) {
          console.error(err);
          process.exit(1);
        }

        copyFile(src, dst);
      });
    } else if (!isExists(path.dirname(dst))) {
      mkdirp(path.dirname(dst), (err) => {
        // Exit: If failure to create parent directory
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
