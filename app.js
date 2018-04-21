const electron = require('electron');
const app = electron.app;
const path = require("path");
const url = require("url");

const BrowserWindow = electron.BrowserWindow;

require('electron-reload')(__dirname);

function createWindow(){

    var mainWindow = new BrowserWindow({
        'min-width':1000,
        'min-height':500,
        resizable: true,
        // center: true,
        icon: 'assets/images/icon.png',
        title: 'Umak music player', 
        backgroundColor: '#333333',
        minimizable: true,
        maximizable: true,
        titleBarStyle: 'hidden'
    });

    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools();

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "./pages/song_manager.html"),
        protocol: "file",
        slashes: true
    }));

    mainWindow.on("closed", function(){
        mainWindow = null;
    });
}

app.on("ready", function(){
    createWindow();
});

app.on("close", function(){
    mainWindow = null;
});

app.on("window-all-closed", function(){
    app.quit();
    if(process.platform !== "darwin"){
        app.quit();
    }
});