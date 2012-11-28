var fs = require('fs-extra');
var rjs = require('requirejs');



var version = Date.now();

var outputFolder = 'output/version/' + version


fs.removeSync('output');
fs.mkdirSync('output');
fs.mkdirSync('output/version');
fs.mkdirSync(outputFolder);

rjs.optimize({
    baseUrl: '../js/app',
    mainConfigFile: '../js/app/main.js',
    out: outputFolder + '/js/main.js',
    name: 'main'
});
rjs.optimize({
    cssIn: '../css/main.css',
    out: outputFolder + '/css/main.css'
});


