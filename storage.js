const fs = require('fs');
const constant = require('./constants');
const sanitize = require("sanitize-filename");

const processingFiles = [];

let exportFolder = [];

if (!fs.existsSync(`./${constant.EXPORT_FOLDER}`)) {
    fs.mkdirSync(`./${constant.EXPORT_FOLDER}`);
}



module.exports = {
    writeToFile: function (fileName, fileType, content, depth, callback) {
        // Generate subfolders
        if (!exportFolder[depth]) {
            exportFolder[depth] = constant.EXPORT_FOLDER + `/depth${depth}`;
            fs.mkdirSync(`./${exportFolder[depth]}`);
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