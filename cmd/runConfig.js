#!/usr/bin/env node

const async = require('async');
const sounds = require(__dirname + '/sounds');
const lights = require(__dirname + '/lights');
// stop all current runConfig processes
//read from playedCache (not in the repo)
//read from configs
//  sort by date added (desc)
//  while selected is in playedCache, next
//      if all configs are in playedCache, reset and play the most recent.
//playSound
//playLed
//updatePlayedCache

async function runConfig() {
    console.log('running');
    stopCurrentJobs();
    let playedCacheIds = loadPlayedCache() || [];
    let configs = loadConfigs() || [{configId: null, color: '0xef0000', soundlength: 3000}];
    let counter = 0;
    let selected = configs[counter];
    while(playedCacheIds.includes(selected.configId)) {
        counter++;
        selected = configs[counter];
    }
    if (counter === configs.length) {
        resetPlayedCache();
        selected = configs[0];
    }
    await playSound(selected);
    await playLed(selected);
    // wait for expanding, waiting, and contracting
    //await wait(selected.soundlength);
    updatePlayedCache(selected.configId, playedCacheIds);
    console.log('done in runconfig');
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stopCurrentJobs() {

}

function loadPlayedCache() {

}

function resetPlayedCache() {

}

function loadConfigs() {

}

function playSound(selected) {
    sounds.main(selected);
}

async function playLed(selected) {
    await lights.main(selected);
}

function updatePlayedCache(selectedId, playedCacheIds) {
    // append selectedId to playedCacheIds
    // set playedCache file content to playedCacheIds
}

runConfig();