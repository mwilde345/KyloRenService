#!/usr/bin/env node

let installChanged = require('install-changed')
let shelljs = require('shelljs');

if (installChanged.watchPackage()) {
    shelljs.exec('/home/pi/Documents/Dev/KyloRenService/cmd/npmLink.sh');
}