// CRAWLER CONFIGURATION

module.exports = {
    SEED: 'https://news.zing.vn/',
    MAX_CONNECTION: 7,
    MAX_DEPTH: 7,
    // SEED: 'http://127.0.0.1:8080/0.html',
    URL_OPTIONS: {
        normalizeHttps: true
    },
    EXPORT_FOLDER: 'export',
    SILENT_MODE: true
}
    