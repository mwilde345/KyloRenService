#!/usr/bin/env node
// this is doing the check from root directory. says /root/package.json modified
// because npm link is conditional, it wouldn't work to deploy this to a fresh machine. 
//  becaused startupScript couldn't run conditional-install

let installChanged = require('install-changed')
let shell = require('shelljs');
console.log('checking package.json');
if (installChanged.watchPackage()) {
    console.log('running npm link');
    shell.exec(__dirname + 'npmLink.sh');
}