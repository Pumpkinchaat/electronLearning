const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const {app , BrowserWindow , ipcMain} = electron;

let mainWindow;

app.on("ready" , () => {
    console.log("App is ready");
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(`file:///${__dirname}\\index.html`);
});

ipcMain.on("video:send" , (evt , videoPath)=>{
    ffmpeg.ffprobe(videoPath , (err , metadata) => {
        const duration = metadata.format.duration;
        mainWindow.webContents.send("video:lengthCalculated" , duration);
    })
})

//NOTES
// BrowserWindow
// send: ipcRenderer.send("evt_name" , stuff);
// recieve: ipcRenderer.on("evt_name" , (evt , stuff) => {});

// app
// send: mainWindow.webContents.send("evt_name" , stuff);
// recieve: ipcMain.on("evt_name" , (evt , stuff) => {});