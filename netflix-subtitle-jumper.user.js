// ==UserScript==
// @name        Netflix subtitle jumper
// @description Allows you to jump to previous or next subtitle position with  hotkeys
// @license     MIT
// @version     1.0.0
// @author			Denis Susloparov
// @updateURL    https://github.com/susloparovdenis/netflix-subtitle-jumper/raw/master/netflix-subtitle-jumper.user.js
// @downloadURL  https://github.com/susloparovdenis/netflix-subtitle-jumper/raw/master/netflix-subtitle-jumper.user.js
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
    .getAllPlayerSessionIds()[0];

    player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
}

function parse_time(raw) {
    return raw.substring(0,raw.length-5);
}

function getCurrentSubtitleIndex() {
    return timestamps.findIndex(t => t >= player.getCurrentTime())-1;
}


function prevSubtitle() {
    player.seek(timestamps[getCurrentSubtitleIndex()-1]);
}

function nextSubtitle() {
    player.seek(timestamps[getCurrentSubtitleIndex()+1]);
}

function doc_keyUp(e) {
    switch(e.keyCode)
    {
        case 33: // PG_DOWN
            prevSubtitle();
            break;
        case 34: //PG_UP
            nextSubtitle(6);
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
        if(tag && tag.getAttribute('xmlns')=="http://www.w3.org/2006/10/ttaf1") {
            processSubtitles(xmlDoc);
        }
    }
});


