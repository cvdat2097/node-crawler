const fs = require('fs');
const constant = require('./constants');
const sanitize = require("sanitize-filename");

const processingFiles = [];

if (!fs.existsSync(`./${constant.FILE_PATH}`)) {
    fs.mkdirSync(`./${constant.FILE_PATH}`);
}

module.exports = {
    writeToFile: function (fileName, fileType, content, callback) {
        fileName = sanitize(fileName);
        fs.writeFile(`${constant.FILE_PATH}/${fileName}.${fileType}`, content, err => {
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