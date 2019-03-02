#!/usr/bin/env node
// this is doing the check from root directory. says /root/package.json modified

let installChanged = require('install-changed')
let shell = require('shelljs');
console.log('checking package.json');
if (installChanged.watchPackage()) {
    console.log('running npm link');
    shell.exec(__dirname + 'npmLink.sh');
}