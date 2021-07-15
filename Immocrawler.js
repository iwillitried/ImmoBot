var Crawler = require("node-webcrawler");
var url = require('url');

let store = {};

function ImmoCrawler(_url_string) {
    console.log("NEW CRAWLER WHO THIS");
    this.url_string = _url_string;
    let new_entity = {};
    new_entity.results = {};
    new_entity.all_results = {};
    new_entity.lastFetch = undefined; 
    store[this.url_string] = new_entity; 
    this.crawler = new Crawler({
        maxConnections : 10,
        callback : filter_results
    });
}

function filter_results(err, res, $) {
    if(err){
        console.log(err);
        return; 
    }

    let results = []; 
    $(".result-list-entry__brand-title-container").each((i, e) => {
        results[i] = e.attribs.href; 
    });
    results = results.filter((e) => {
        return e.includes('expose');
    });
    results.forEach((e, i) => {
        results[i] = e.substring(8);
    });
    storeResults(res.uri, results); 
}

function storeResults(id, results) {
    let entity = store[id];
    if (!entity) return;
    for (i in results) {
        let result = results[i]; 
        if (entity.all_results[result]) continue;
        entity.all_results[result] = {};
        entity.results[result] = {}; 
    }
}

ImmoCrawler.prototype.fetch = function fetch() {
    // Fetch ImmoScout URL if last fetch was more than 10s ago 
    let lastFetch = store[this.url_string].lastFetch;
    let now = Date.now(); 
    if (lastFetch === undefined || now - lastFetch > 10000) {
        //this.crawler.queue(this.url_string);
        store[this.url_string].lastFetch = now; 
    }
}

ImmoCrawler.prototype.getResults = function getResults() {
    let id = this.url_string
    if (!(store[id] && store[id].results && store[id].all_results)) return {};
    let res = store[id].results;
    store[id].results = {}; 
    return res; 
}

module.exports = ImmoCrawler; 