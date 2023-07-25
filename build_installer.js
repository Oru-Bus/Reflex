const {MSICreator} = require('electron-wix-msi');
const path = require('path');

const APP_DIR = path.resolve(__dirname, './Reflex-win32-x64');
const OUT_DIR = path.resolve(__dirname, './windows_installer');

const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    description: "Application Reflex",
    exe: 'Reflex',
    name: 'Reflex',
    manufacturer: 'Orubus',
    version: '0.0.2',

    ui: {
        chooseDirectory: true,
    },
});

msiCreator.create().then(function(){
    msiCreator.compile();
});