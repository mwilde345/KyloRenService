#!/usr/bin/env node

const async = require('async');
const sounds = require('./sounds');
const lights = require('./lights');
// stop all current runConfig processes
//read from playedCache (not in the repo)
//read from configs
//  sort by date added (desc)
//  while selected is in playedCache, next
//      if all configs are in playedCache, reset and play the most recent.
//playSound
//playLed
//updatePlayedCache

function runConfig() {
    console.log('running');
    stopCurrentJobs();
    let playedCacheIds = loadPlayedCache() || [];
    let configs = loadConfigs() || [{configId: null}];
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
    playSound(selected);
    playLed(selected);
    updatePlayedCache(selected.configId, playedCacheIds);
    console.log('ran');
}

function stopCurrentJobs() {

}

function loadPlayedCache() {

}

function resetPlayedCache() {

}

function loadConfigs() {

}

async function playSound(selected) {
    sounds.main(selected);
}

async function playLed(selected) {
    lights.main(selected);
}

function updatePlayedCache(selectedId, playedCacheIds) {
    // append selectedId to playedCacheIds
    // set playedCache file content to playedCacheIds
}

runConfig();