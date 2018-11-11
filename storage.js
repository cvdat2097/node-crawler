// FILE PROCESSING

const fs = require('fs');
const constant = require('./constants');
const sanitize = require("sanitize-filename");

let exportFolder = [];
let usedFilename = {};

// Create export folder
if (!fs.existsSync(`./${constant.EXPORT_FOLDER}`)) {
    fs.mkdirSync(`./${constant.EXPORT_FOLDER}`);
}


module.exports = {
    writeToFile: function (fileName, fileType, content, depth, callback) {
        // Generate subfolders
        if (!exportFolder[depth]) {
            exportFolder[depth] = constant.EXPORT_FOLDER + `/depth${depth}`;
            if (!fs.existsSync(`./${exportFolder[depth]}`)) {
                fs.mkdirSync(`./${exportFolder[depth]}`);
            }
        }


        fileName = sanitize(fileName);
        usedFilename[fileName] = true;
        if (usedFilename[fileName]) {
            fileName += (new Date()).getMilliseconds().toString();
        }
        
        fs.writeFile(`${exportFolder[depth]}/${fileName}.${fileType}`, content, err => {
            if (callback) {
                // usedFilename[filename] = true;
                callback(err);
            } else {
                if (err) {
                    // throw err;
                }
            }
        });
    }
}