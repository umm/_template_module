#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var path = require('path');

var postMergePath = path.join(process.cwd(), '.git', 'hooks', 'post-merge');

var command_detect_changed_files = "changed_files=\"$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)\"";

var comment_begin   = "# umm: automatic updator: BEGIN";
var comment_end     = "# umm: automatic updator: END";
var comment_command = "# umm: automatic updator:   for ";

var installUpdator = (target_file, command) => {
  var stream = fs.createReadStream(postMergePath, 'utf8');
  var reader = readline.createInterface({ input: stream });
  var lines = [];
  var exists_block = false;
  var inside_block = false;
  var skip_insert_line = 0;
  var generateCommandLine = (target_file, command) => {
    return "echo \"\$changed_files\" | grep --quiet \"" + target_file + "\" && eval \"" + command + "\"";
  };
  var generateCommentLine = (target_file) => {
    return comment_command + target_file;
  };
  reader
  .on(
    'line',
    (line) => {
      if (new RegExp("^" + comment_begin).test(line)) {
        /* アップデータの開始行を検知した場合 */
        lines.push(line);
        lines.push(command_detect_changed_files);
        exists_block = true;
        skip_insert_line = 2;
      } else if (new RegExp("^" + comment_end).test(line)) {
        /* アップデータの終了行を検知した場合 */
        // 対象のファイルに関する監視を追加
        lines.push(generateCommentLine(target_file));
        lines.push(generateCommandLine(target_file));
        lines.push(line);
        skip_insert_line = 1;
      } else if (new RegExp("^" + comment_command + target_file).test(line)) {
        /* 対象のコマンド行を検知した場合 */
        // 行の追加スキップを予約
        skip_insert_line = 2;
      }
      if (skip_insert_line > 0) {
        skip_insert_line--;
        return;
      }
      lines.push(line);
    }
  )
  .on(
    'close',
    () => {
      if (!exists_block) {
        /* 未追加の場合にはブロックごと新規追加 */
        lines.push('');
        lines.push(comment_begin);
        lines.push(command_detect_changed_files);
        lines.push(generateCommentLine(target_file));
        lines.push(generateCommandLine(target_file, command));
        lines.push(comment_end);
      }

      // ファイル書き込み
      fs.writeFileSync(postMergePath, lines.join("\n"), { mode: 0o755 });

      console.log('Install umm updator');
    }
  );
}

installUpdator('package-lock.json', 'npm run umm:clean && npm install');

// vim:set ft=javascript et sw=2 sts=2:
