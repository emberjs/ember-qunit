/* jshint node:true */

var execSync = require('child_process').execSync;
var existsSync = require('exists-sync');

function run(command) {
  console.log('running: "' + command + '"');
  var output = execSync(command, { encoding: 'utf8' });
  console.log(output);
}

module.exports = {
  // Publish the new release to NPM after a successful push
  afterPush: function(project, versions) {
    run('ember build');

    if (!existsSync('../ember-qunit-builds')) {
      run('cd .. && git clone git@github.com:rwjblue/ember-qunit-builds.git');
    }

    run('cp ./build/*.* ../ember-qunit-builds/');
    run('cd ../ember-qunit-builds && git add --all');
    run('cd ../ember-qunit-builds && git commit --message="Release ' + versions.next + '"');
    run('cd ../ember-qunit-builds && git tag ' + versions.next);
    run('cd ../ember-qunit-builds && git push origin master --tags');

    run('npm publish');
  }
};
