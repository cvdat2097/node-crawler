const Crawler = require('crawler');
const constant = require('./constants');
const normalizeUrl = require('normalize-url');
const storage = require('./storage');

const visitedURL = {}

var crawler = new Crawler({
    maxConnections: constant.MAX_CONNECTION,
    callback: function (err, res, done) {
        if (err) {
            console.log(err);
        } else if (res.options.depth <= constant.MAX_DEPTH) {
            // Record current page
            let $ = res.$;
            let fileName = $('title').text();
            let fileText = $('body').text();
            let fileHTML = res.body;


            console.log(fileName);
            storage.writeToFile(fileName, 'txt', fileText);
            storage.writeToFile(fileName, 'html', fileHTML);

            // Extract all links
            const links = $('a');
            let L = links.length;

            for (let i = 0; i < L; i++) {
                if (links[i].attribs.href) {
                    try {
                        currentURL = normalizeUrl(links[i].attribs.href, constant.URL_OPTIONS);

                        if (currentURL && !visitedURL[currentURL]) {
                            crawler.queue({
                                uri: currentURL,
                                depth: res.options.depth + 1
                            });

                            visitedURL[currentURL] = true;

                            !constant.SILENT_MODE && console.log(`Enqueued URL: ${currentURL}`);
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
        }
        done();
    }
});

crawler.queue({
    uri: constant.SEED,
    depth: 0
});