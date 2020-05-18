// ==UserScript==
// @name        Netflix subtitle seek 
// @description User script for netflix. Allows you to seek to seek to the previous/next subtitle using hotkeys.
// @license     MIT
// @version     1.0.0
// @author			Denis Susloparov
// @updateURL    https://github.com/susloparovdenis/netflix-subtitle-seek/raw/master/netflix-subtitle-seek.user.js
// @downloadURL  https://github.com/susloparovdenis/netflix-subtitle-seek/raw/master/netflix-subtitle-seek.user.js
// @include     https://www.netflix.com/*
// @grant       none
// @require     https://cdn.rawgit.com/Tithen-Firion/UserScripts/7bd6406c0d264d60428cfea16248ecfb4753e5e3/libraries/xhrHijacker.js?version=1.0
// ==/UserScript==


var timestamps;
var player;

function processSubtitles(xmlDoc) {
    timestamps = Array.from(xmlDoc.getElementsByTagName('p'))
        .map(t => t.getAttribute('begin'))
        .map(parse_time);
    const videoPlayer = netflix
    .appContext
    .state
    .playerApp
    .getAPI()
    .videoPlayer;

    const playerSessionId = videoPlayer
    .getAllPlayerSessionIds()
    .find(s => s.includes("watch"));
    
    player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
}

function parse_time(raw) {
    return raw.substring(0,raw.length-5);
}

function getCurrentSubtitleIndex() {
    return timestamps.findIndex(t => t >= player.getCurrentTime())-1;
}


function seekFromCurrent(lines) {
    player.seek(timestamps[getCurrentSubtitleIndex()-lines]);
}

function doc_keyUp(e) {
    switch(e.keyCode)
    {
        case 33: // PG_DOWN
            seekFromCurrent(-1);
            break;
        case 34: //PG_UP
            seekFromCurrent(+1);
            break;
        case 36: //HOME
            seekFromCurrent(0);
            break;
        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);

xhrHijacker(function(xhr, id, origin, args) {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xhr.response,"text/xml");
    if(origin === 'load') {
      
        const tag = xmlDoc.querySelector('tt');
        if(tag && tag.getAttribute('xmlns')=="http://www.w3.org/ns/ttml") {
            processSubtitles(xmlDoc);
        }
    }
});


// ==UserScript==
// @name        Netflix subtitle seek 
// @description User script for netflix. Allows you to seek to seek to the previous/next subtitle using hotkeys.
// @license     MIT
// @version     1.0.0
// @author			Denis Susloparov
// @updateURL    https://github.com/susloparovdenis/netflix-subtitle-seek/raw/master/netflix-subtitle-seek.user.js
// @downloadURL  https://github.com/susloparovdenis/netflix-subtitle-seek/raw/master/netflix-subtitle-seek.user.js
// @include     https://www.netflix.com/*
// @grant       none
// @require     https://cdn.rawgit.com/Tithen-Firion/UserScripts/7bd6406c0d264d60428cfea16248ecfb4753e5e3/libraries/xhrHijacker.js?version=1.0
// ==/UserScript==


var timestamps;
var player;

function processSubtitles(xmlDoc) {
    timestamps = Array.from(xmlDoc.getElementsByTagName('p'))
        .map(t => t.getAttribute('begin'))
        .map(parse_time);
    const videoPlayer = netflix
    .appContext
    .state
    .playerApp
    .getAPI()
    .videoPlayer;

    const playerSessionId = videoPlayer
    .getAllPlayerSessionIds()
    .find(s => s.includes("watch"));
    
    player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
}

function parse_time(raw) {
    return raw.substring(0,raw.length-5);
}

function getCurrentSubtitleIndex() {
    return timestamps.findIndex(t => t >= player.getCurrentTime())-1;
}


function seekFromCurrent(lines) {
    player.seek(timestamps[getCurrentSubtitleIndex()-lines]);
}

function doc_keyUp(e) {
    switch(e.keyCode)
    {
        case 33: // PG_DOWN
            seekFromCurrent(-1);
            break;
        case 34: //PG_UP
            seekFromCurrent(+1);
            break;
        case 36: //HOME
            seekFromCurrent(0);
            break;
        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);

xhrHijacker(function(xhr, id, origin, args) {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xhr.response,"text/xml");
    if(origin === 'load') {
      
        const tag = xmlDoc.querySelector('tt');
        if(tag && tag.getAttribute('xmlns')=="http://www.w3.org/ns/ttml") {
            processSubtitles(xmlDoc);
        }
    }
});


