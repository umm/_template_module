var mkdirp = require('mkdirp');
var path = require('path');
var package = require('../package.json');
var rsync = new (require('rsync'))();

var script_directory = __dirname;
// パッケージ名が @ で始まるならスコープ有りと見なす
var has_scope = /^@/.test(package.name);

if ('node_modules' != path.basename(path.resolve(script_directory, (has_scope ? '../' : '') + '../../'))) {
  // 開発インストールの場合無視する
  return;
}

// スクリプトの存在するディレクトリから見たパス
var source = path.resolve(script_directory, '../Assets');
var destination = path.resolve(script_directory, (has_scope ? '../' : '') + '../../../Assets/Modules');
// パッケージ名をそのまま付与
//   (ネームスペースを持つ場合、そのまま namespace + @ をプレフィックスにする)
if (/^@/.test(package.name)) {
  destination += '/' + package.name.replace(
    /^@([^\/]+)\/(.*)$/,
    function(match, namespace, package_name) {
      return namespace + '@' + package_name;
    }
  );
} else {
  destination += '/' + package.name;
}

// 宛先ディレクトリを作る (mkdir -p)
mkdirp(destination, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // rsync を用いてファイルを再帰的にコピーする
  rsync
    .flags('az')
    .delete()
    .source(source + '/')
    .destination(destination)
    .execute(function(err, code, command) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
});
