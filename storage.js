// FILE PROCESSING

const fs = require('fs');
const constant = require('./constants');
const sanitize = require("sanitize-filename");

let exportFolder = [];

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
        fs.writeFile(`${exportFolder[depth]}/${fileName}.${fileType}`, content, err => {
            if (callback) {
                callback(err);
            } else {
                if (err) {
                    throw err;
                }
            }
        });
    }
}