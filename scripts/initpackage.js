var path = require('path');
var ncp = require('ncp');
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');
var fs = require('fs');
var readlineSync = require('readline-sync');

var v = {
  package_name: '',
  description: '',
  repository: {
    type: 'git',
    name: process.env.npm_config_repository_name || '',
    host: process.env.npm_config_repository_host || '',
    group: process.env.npm_config_repository_group || '',
    user: process.env.npm_config_repository_user || ''
  },
  author: {
    name: process.env.npm_config_author_name || '',
    email: process.env.npm_config_author_email || '',
    url: process.env.npm_config_author_url || ''
  },
  license: process.env.npm_config_license || 'MIT'
};

var f_read_input = function(message, original, required) {
  result = original;
  do {
    input = readlineSync.question(message + ' ' + (original ? '[' + original + '] ' : ''));
    if (input) {
      result = input;
    }
  } while (!result && required);
  return result;
};

var f_configure = function(shortly) {
  v.package_name = f_read_input('What is package name?', v.package_name, true);
  v.description = f_read_input('Please input description if needed.', v.description, false);
  if (!shortly) {
    v.repository.type = f_read_input('What is repository type?', v.repository.type, true);
  }
  v.repository.name = f_read_input('What is repository name?', v.repository.name || v.package_name, true);
  if (!shortly) {
    v.repository.host = f_read_input('What is repository host?', v.repository.host, true);
    v.repository.group = f_read_input('What is repository group?', v.repository.group, true);
    v.repository.user = f_read_input('What is repository user?', v.repository.user, true);
    v.author.name = f_read_input('What is author name?', v.author.name, true);
    v.author.email = f_read_input('What is author email?', v.author.email, false);
    v.author.url = f_read_input('What is author url?', v.author.url, false);
    v.license = f_read_input('What is package license?', v.license, true);
  }
  if ('git' == v.repository.type && !/.git$/.test(v.repository.name)) {
    v.repository.name = v.repository.name + '.git';
  }

  var data = fs.readFileSync('package.json', { encoding: 'utf8' });
  console.log(f_replace_placeholder(data));

  if (readlineSync.question('\nOK? ', { trueValue: [ 'y', 'yes', 'ok' ], falseValue: [ 'n', 'no', 'ng' ], caseSensitive: false })) {
    f_write_package_json();
  } else {
    f_configure(false);
  }
};

var f_replace_placeholder = function(data) {
  data = data.replace(/__PACKAGE_NAME__/g, v.package_name);
  data = data.replace(/__DESCRIPTION__/g, v.description);
  data = data.replace(/__REPOSITORY_NAME__/g, v.repository.name);
  data = data.replace(/__REPOSITORY_TYPE__/g, v.repository.type);
  data = data.replace(/__REPOSITORY_HOST__/g, v.repository.host);
  data = data.replace(/__REPOSITORY_GROUP__/g, v.repository.group);
  data = data.replace(/__REPOSITORY_USER__/g, v.repository.user);
  data = data.replace(/__AUTHOR_NAME__/g, v.author.name);
  data = data.replace(/__AUTHOR_EMAIL__/g, v.author.email);
  data = data.replace(/__AUTHOR_URL__/g, v.author.url);
  data = data.replace(/__LICENSE__/g, v.license);
  return data;
};

var f_write_package_json = function() {
  fs.readFile('package.json', { encoding: 'utf8' }, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    data = f_replace_placeholder(data);

    fs.writeFile('package.json', data, { encoding: 'utf8' }, function() {
      console.log('Finish wrote `package.json\'.');
    });
  });
};

f_configure(true);

