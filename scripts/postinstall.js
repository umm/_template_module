var mkdirp = require('mkdirp');
var path = require('path');
var ncp = require('ncp');
var pascalCase = require('pascal-case');
var package = require('../package.json');

var script_directory = __dirname;
var has_scope = false;
if (/^@/.test(path.basename(path.resolve(script_directory, '../../')))) {
  // 二つ親のディレクトリが @ で始まる場合は Scoped なパッケージと見なす
  // XXX: package.json の中身を読むとヨサソウ
  has_scope = true;
}

if ('node_modules' != path.basename(path.resolve(script_directory, (has_scope ? '../' : '') + '../../'))) {
  // 開発インストールの場合無視する
  return;
}

// スクリプトの存在するディレクトリから見たパス
var source = path.resolve(script_directory, '../Assets');
var destination = path.resolve(script_directory, (has_scope ? '../' : '') + '../../../Assets/Modules');
// パッケージ名を PascalCase にして付与
//   (ネームスペースを持つ場合、そのまま namespace + @ をプレフィックスにする)
if (/^@/.test(package.name)) {
  destination += '/' + package.name.replace(
    /^@([^\/]+)\/(.*)$/,
    function(match, namespace, package_name) {
      return namespace + '@' + pascalCase(package_name);
    }
  );
} else {
  destination += '/' + pascalCase(package.name);
}

// 宛先ディレクトリを作る (mkdir -p)
mkdirp(destination, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // ファイルを再帰的にコピーする
  // NOTE: ココは rsync --delete とかにするかも
  ncp(source, destination, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
