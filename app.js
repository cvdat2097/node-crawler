// MAIN PROGRAM

const Crawler = require('crawler');
const constant = require('./constants');
const normalizeUrl = require('normalize-url');
const storage = require('./storage');

const visitedURL = {}
var nVisitedURL = 0;

var crawler = new Crawler({
    maxConnections: constant.MAX_CONNECTION,
    callback: function (err, res, done) {
        if (err) {
            console.log(err);
        } else if (res.options.depth <= constant.MAX_DEPTH) {
            try {
                // Record current page
                let $ = res.$;
                let fileName = $('title').text();
                let fileText = $('body').text();
                let fileHTML = res.body;

                nVisitedURL++;
                storage.writeToFile(fileName, 'txt', fileText, res.options.depth);
                storage.writeToFile(fileName, 'html', fileHTML, res.options.depth);
                console.log(`${nVisitedURL}|${res.options.depth} ${fileName}`);

                // Extract all links
                const links = $('a');
                let L = links.length;

                for (let i = 0; i < L; i++) {
                    let rawURL = links[i].attribs.href;
                    if (rawURL) {
                        try {
                            if (rawURL[0] == '/') {
                                rawURL = rawURL.replace('/', constant.SEED);
                            }
                            let finalURL = normalizeUrl(rawURL, constant.URL_OPTIONS);

                            if (finalURL && !visitedURL[finalURL]) {
                                crawler.queue({
                                    uri: finalURL,
                                    depth: res.options.depth + 1
                                });

                                visitedURL[finalURL] = true;

                                if (!constant.SILENT_MODE) {
                                    console.log(`Enqueued URL: ${finalURL}`);
                                }
                            }
                        } catch (err) {
                            if (!constant.SILENT_MODE) {
                                if (err.code === 'ERR_INVALID_URL') {
                                    console.log(`Invalid URL: ${err.input}`);
                                } else {
                                    console.log(err);
                                }
                            }
                        }
                    }
                }
            } catch (e) {

            }
        }
        done();
    }
});

// Start crawling
crawler.queue({
    uri: constant.SEED,
    depth: 0
});